import { createClient } from "@/lib/supabase/server";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { levelFromXp, nextLevelXp } from "./gamification";

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) throw new Error("Unauthorized");

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

    supabase
      .from("study_sessions")
      .select("duration_minutes, started_at")
      .eq("user_id", userId)
      .gte("started_at", `${today}T00:00:00`)
      .lte("started_at", `${today}T23:59:59`),

    supabase
      .from("workout_logs")
      .select("id, completed_at")
      .eq("user_id", userId)
      .gte("completed_at", monthStart),

    supabase
      .from("skill_logs")
      .select("id, hours, logged_at")
      .eq("user_id", userId)
      .gte("logged_at", weekStart),

    supabase
      .from("habit_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("completed_on", today),

    supabase
      .from("streaks")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "overall")
      .maybeSingle(),

    supabase
      .from("study_sessions")
      .select("duration_minutes, started_at")
      .eq("user_id", userId)
      .gte("started_at", weekStart),

    supabase
      .from("workout_logs")
      .select("completed_at")
      .eq("user_id", userId)
      .gte("completed_at", weekStart),

    supabase
      .from("goals")
      .select("id, title, progress, priority, deadline")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", userId)
      .gte("completed_at", `${today}T00:00:00`)
      .lte("completed_at", `${today}T23:59:59`),

    supabase
      .from("habits")
      .select("id")
      .eq("user_id", userId)
      .eq("active", true)
  ]);

  const studyMinutesToday =
    studyTodayRes.data?.reduce((sum, s) => sum + s.duration_minutes, 0) ?? 0;

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

  return {
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
    profile,
    weekly,
    goals: goalsRes.data ?? []
  };
}
