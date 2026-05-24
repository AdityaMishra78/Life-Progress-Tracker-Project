"use client";

import { useState, useEffect, useCallback } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyChart } from "@/components/analytics/WeeklyChart";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { TodayOverview } from "@/components/dashboard/TodayOverview";
import { GamificationPanel } from "@/components/dashboard/GamificationPanel";
import { formatMinutes } from "@/lib/utils";
import { Brain, Dumbbell, Flame, Gauge, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { localDb } from "@/lib/localDb";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { levelFromXp, nextLevelXp } from "@/lib/gamification";

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    stats: {
      studyMinutesToday: 0,
      workoutCompletionRate: 0,
      skillsLearnedThisWeek: 0,
      productivityScore: 0,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      dailyStreak: 0,
      workoutsToday: 0,
      completedHabitsCount: 0,
      totalHabitsCount: 0
    },
    weekly: [
      { day: "Mon", study: 0, workout: 0 },
      { day: "Tue", study: 0, workout: 0 },
      { day: "Wed", study: 0, workout: 0 },
      { day: "Thu", study: 0, workout: 0 },
      { day: "Fri", study: 0, workout: 0 },
      { day: "Sat", study: 0, workout: 0 },
      { day: "Sun", study: 0, workout: 0 }
    ],
    goals: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        // Fallback to local storage database
        const localData = localDb.getDashboardData();
        setData(localData);
        return;
      }

      const userId = auth.user.id;
      const today = format(new Date(), "yyyy-MM-dd");
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      const monthStart = startOfMonth(new Date()).toISOString();

      const [
        profileRes,
        studyTodayRes,
        workoutsMonthRes,
        skillsWeekRes,
        habitsTodayRes,
        streakRes,
        weeklyStudyRes,
        weeklyWorkoutRes,
        goalsRes,
        workoutsTodayRes,
        activeHabitsRes
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("study_sessions").select("duration_minutes, started_at").eq("user_id", userId).gte("started_at", `${today}T00:00:00`).lte("started_at", `${today}T23:59:59`),
        supabase.from("workout_logs").select("id, completed_at").eq("user_id", userId).gte("completed_at", monthStart),
        supabase.from("skill_logs").select("id, hours, logged_at").eq("user_id", userId).gte("logged_at", weekStart),
        supabase.from("habit_logs").select("id").eq("user_id", userId).eq("completed_on", today),
        supabase.from("streaks").select("*").eq("user_id", userId).eq("type", "overall").maybeSingle(),
        supabase.from("study_sessions").select("duration_minutes, started_at").eq("user_id", userId).gte("started_at", weekStart),
        supabase.from("workout_logs").select("completed_at").eq("user_id", userId).gte("completed_at", weekStart),
        supabase.from("goals").select("id, title, progress, priority, deadline").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
        supabase.from("workout_logs").select("id").eq("user_id", userId).gte("completed_at", `${today}T00:00:00`).lte("completed_at", `${today}T23:59:59`),
        supabase.from("habits").select("id").eq("user_id", userId).eq("active", true)
      ]);

      const studyMinutesToday = studyTodayRes.data?.reduce((sum, s) => sum + s.duration_minutes, 0) ?? 0;
      const workoutsThisMonth = workoutsMonthRes.data?.length ?? 0;
      const workoutCompletionRate = Math.min(100, Math.round((workoutsThisMonth / 12) * 100));
      const skillsLearnedThisWeek = skillsWeekRes.data?.length ?? 0;

      const profile = profileRes.data;
      const xp = profile?.xp ?? 0;
      const level = levelFromXp(xp);

      const productivityScore = Math.min(
        100,
        Math.round(
          studyMinutesToday * 0.45 +
            workoutsThisMonth * 4 +
            (habitsTodayRes.data?.length ?? 0) * 8 +
            skillsLearnedThisWeek * 5
        )
      );

      const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
        day,
        study: 0,
        workout: 0
      }));

      weeklyStudyRes.data?.forEach((s) => {
        const idx = new Date(s.started_at).getDay();
        const normalized = idx === 0 ? 6 : idx - 1;
        weekly[normalized].study += s.duration_minutes;
      });

      weeklyWorkoutRes.data?.forEach((w) => {
        const idx = new Date(w.completed_at).getDay();
        const normalized = idx === 0 ? 6 : idx - 1;
        weekly[normalized].workout += 1;
      });

      setData({
        stats: {
          studyMinutesToday,
          workoutCompletionRate,
          skillsLearnedThisWeek,
          productivityScore,
          level,
          xp,
          nextLevelXp: nextLevelXp(level),
          dailyStreak: streakRes.data?.current_count ?? 0,
          workoutsToday: workoutsTodayRes.data?.length ?? 0,
          completedHabitsCount: habitsTodayRes.data?.length ?? 0,
          totalHabitsCount: activeHabitsRes.data?.length ?? 0
        },
        weekly,
        goals: goalsRes.data ?? []
      });
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
      // Fallback to local storage database in case of errors
      setData(localDb.getDashboardData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-card/40 border border-border/10" />
          ))}
        </section>
        <section className="grid gap-6 xl:grid-cols-[1.5fr_.9fr]">
          <div className="h-96 rounded-2xl bg-card/40 border border-border/10" />
          <div className="h-96 rounded-2xl bg-card/40 border border-border/10 flex flex-col items-center justify-center" />
        </section>
      </div>
    );
  }

  const { stats, weekly, goals } = data;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Daily streak"
          value={`${stats.dailyStreak} days`}
          icon={Flame}
          tone="orange"
        />
        <StatCard
          title="Productivity"
          value={`${stats.productivityScore}%`}
          icon={Gauge}
          tone="purple"
        />
        <StatCard
          title="Studied today"
          value={formatMinutes(stats.studyMinutesToday)}
          icon={Brain}
          tone="cyan"
        />
        <StatCard
          title="Workout rate"
          value={`${stats.workoutCompletionRate}%`}
          icon={Dumbbell}
          tone="green"
        />
        <StatCard
          title="Skills learned"
          value={stats.skillsLearnedThisWeek}
          icon={Sparkles}
          tone="pink"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_.9fr]">
        <AnimatedCard>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Weekly balance</h2>
              <p className="text-sm text-muted">Study minutes vs workout logs</p>
            </div>
          </div>
          <WeeklyChart data={weekly} />
        </AnimatedCard>

        <AnimatedCard className="flex flex-col items-center justify-center">
          <ProgressRing value={stats.productivityScore} label="Score" />
          <h3 className="mt-5 text-xl font-black">Today&apos;s momentum</h3>
          <p className="mt-1 text-center text-sm text-muted">
            Keep pushing. One more focused action levels up your day.
          </p>
        </AnimatedCard>
      </section>

      <TodayOverview stats={stats} />

      <section className="grid gap-6 xl:grid-cols-3">
        <GamificationPanel
          level={stats.level}
          xp={stats.xp}
          nextLevelXp={stats.nextLevelXp}
        />
        <QuoteCard />
        <AnimatedCard>
          <h2 className="mb-4 text-xl font-black">Active goals</h2>
          <div className="space-y-4">
            {goals.map((goal: any) => (
              <div key={goal.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold">{goal.title}</span>
                  <span className="text-muted">{goal.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neutral-800 to-neutral-400 dark:from-neutral-200 dark:to-neutral-600 transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </section>
    </div>
  );
}
