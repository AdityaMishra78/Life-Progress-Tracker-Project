import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "productivity";
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = auth.user.id;

  const insights: Record<string, unknown> = {};

  if (type === "productivity") {
    const { data: sessions } = await supabase
      .from("study_sessions")
      .select("duration_minutes, started_at")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(30);

    const { data: habits } = await supabase
      .from("habit_logs")
      .select("completed_on")
      .eq("user_id", userId)
      .limit(30);

    const studyMinutes = sessions?.reduce((s, r) => s + (r.duration_minutes ?? 0), 0) ?? 0;
    const habitDays = new Set(habits?.map((h) => h.completed_on)).size;

    insights.totalStudy = studyMinutes;
    insights.avgDailyStudy = Math.round(studyMinutes / 30);
    insights.activeHabitDays = habitDays;
    insights.score = Math.min(100, Math.round(studyMinutes / 5 + habitDays * 3));
  }

  return NextResponse.json(insights);
}
