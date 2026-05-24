import { getDashboardData } from "@/lib/dashboard";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyChart } from "@/components/analytics/WeeklyChart";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { TodayOverview } from "@/components/dashboard/TodayOverview";
import { GamificationPanel } from "@/components/dashboard/GamificationPanel";
import { formatMinutes } from "@/lib/utils";
import { Brain, Dumbbell, Flame, Gauge, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const { stats, weekly, goals } = await getDashboardData().catch(() => ({
    stats: {
      studyMinutesToday: 120,
      workoutCompletionRate: 75,
      skillsLearnedThisWeek: 3,
      productivityScore: 68,
      level: 3,
      xp: 385,
      nextLevelXp: 720,
      dailyStreak: 5,
      workoutsToday: 1,
      completedHabitsCount: 5,
      totalHabitsCount: 7
    },
    weekly: [
      { day: "Mon", study: 120, workout: 1 },
      { day: "Tue", study: 90, workout: 0 },
      { day: "Wed", study: 150, workout: 1 },
      { day: "Thu", study: 60, workout: 0 },
      { day: "Fri", study: 180, workout: 1 },
      { day: "Sat", study: 45, workout: 0 },
      { day: "Sun", study: 0, workout: 0 }
    ],
    goals: [
      { id: "1", title: "Learn TypeScript", progress: 65, priority: "high", deadline: "2026-06-01" },
      { id: "2", title: "Run 5K", progress: 40, priority: "medium", deadline: "2026-05-15" },
      { id: "3", title: "Read 12 books", progress: 25, priority: "low", deadline: "2026-12-31" }
    ]
  }));

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
            {goals.map((goal) => (
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
