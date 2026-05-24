import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { startOfWeek, startOfDay, subDays, format, parseISO } from "date-fns";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.user.id;
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
    const past28DaysStart = startOfDay(subDays(now, 27)).toISOString();

    // Fetch all required data in parallel
    const [
      profileRes,
      studySessionsAllRes,
      workoutLogsAllRes,
      habitLogsAllRes,
      skillLogsAllRes,
      streakRes,
      weeklyStudyRes,
      weeklyWorkoutRes
    ] = await Promise.all([
      supabase.from("profiles").select("xp").eq("id", userId).single(),
      
      supabase
        .from("study_sessions")
        .select("duration_minutes, started_at")
        .eq("user_id", userId),
        
      supabase
        .from("workout_logs")
        .select("duration_minutes, completed_at")
        .eq("user_id", userId),
        
      supabase
        .from("habit_logs")
        .select("completed_on")
        .eq("user_id", userId),
        
      supabase
        .from("skill_logs")
        .select("hours, logged_at")
        .eq("user_id", userId),
        
      supabase
        .from("streaks")
        .select("current_count")
        .eq("user_id", userId)
        .eq("type", "habit")
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
        .gte("completed_at", weekStart)
    ]);

    // 1. XP Gained
    const xpGained = profileRes.data?.xp ?? 0;

    // 2. Study Minutes
    const totalStudyMinutes = studySessionsAllRes.data?.reduce((sum, s) => sum + s.duration_minutes, 0) ?? 0;

    // 3. Workouts Count
    const totalWorkouts = workoutLogsAllRes.data?.length ?? 0;

    // 4. Habit Streak
    const habitStreak = streakRes.data?.current_count ?? 0;

    // 5. Weekly study vs workout (for WeeklyChart)
    const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      study: 0,
      workout: 0
    }));

    weeklyStudyRes.data?.forEach((s) => {
      const idx = new Date(s.started_at).getDay();
      const normalized = idx === 0 ? 6 : idx - 1;
      weeklyData[normalized].study += s.duration_minutes;
    });

    weeklyWorkoutRes.data?.forEach((w) => {
      const idx = new Date(w.completed_at).getDay();
      const normalized = idx === 0 ? 6 : idx - 1;
      weeklyData[normalized].workout += 1;
    });

    // 6. Balance Distribution (for BalanceChart)
    const studyVal = totalStudyMinutes;
    const workoutVal = workoutLogsAllRes.data?.reduce((sum, w) => sum + w.duration_minutes, 0) ?? 0;
    const habitVal = (habitLogsAllRes.data?.length ?? 0) * 15; // approximate 15 mins per habit checked off
    const skillVal = Math.round((skillLogsAllRes.data?.reduce((sum, s) => sum + Number(s.hours), 0) ?? 0) * 60);

    const hasData = (studyVal + workoutVal + habitVal + skillVal) > 0;

    const balanceData = [
      { name: "Study", value: hasData ? studyVal : 25, color: "#8b5cf6" },
      { name: "Workout", value: hasData ? workoutVal : 25, color: "#22c55e" },
      { name: "Habits", value: hasData ? habitVal : 25, color: "#f59e0b" },
      { name: "Skills", value: hasData ? skillVal : 25, color: "#06b6d4" }
    ];

    // 7. Activity Heatmap over last 28 days (for Heatmap)
    const heatmapDataMap: Record<string, number> = {};
    
    // Initialize past 28 days with 0 activity
    for (let i = 0; i < 28; i++) {
      const dateStr = format(subDays(now, 27 - i), "yyyy-MM-dd");
      heatmapDataMap[dateStr] = 0;
    }

    // Accumulate activities per date
    studySessionsAllRes.data?.forEach((s) => {
      const dateStr = format(new Date(s.started_at), "yyyy-MM-dd");
      if (dateStr in heatmapDataMap) {
        heatmapDataMap[dateStr] += 1;
      }
    });

    workoutLogsAllRes.data?.forEach((w) => {
      const dateStr = format(new Date(w.completed_at), "yyyy-MM-dd");
      if (dateStr in heatmapDataMap) {
        heatmapDataMap[dateStr] += 1;
      }
    });

    habitLogsAllRes.data?.forEach((h) => {
      if (h.completed_on in heatmapDataMap) {
        heatmapDataMap[h.completed_on] += 1;
      }
    });

    skillLogsAllRes.data?.forEach((s) => {
      const dateStr = format(new Date(s.logged_at), "yyyy-MM-dd");
      if (dateStr in heatmapDataMap) {
        heatmapDataMap[dateStr] += 1;
      }
    });

    const heatmapData = Object.entries(heatmapDataMap).map(([dateStr, value]) => ({
      date: format(parseISO(dateStr), "MMM d"),
      value
    }));

    return NextResponse.json({
      studyMinutes: totalStudyMinutes,
      workouts: totalWorkouts,
      habitStreak,
      xpGained,
      weeklyData,
      balanceData,
      heatmapData
    });
  } catch (err: any) {
    console.error("Analytics API Error:", err);
    return NextResponse.json({ error: "Failed to generate analytics data" }, { status: 500 });
  }
}
