import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ALLOWED_TABLES = new Set([
  "subjects", "study_topics", "study_sessions",
  "workout_routines", "exercises", "workout_logs", "exercise_logs", "body_measurements",
  "skills", "skill_logs", "habits", "habit_logs",
  "goals", "tasks", "analytics_events"
]);

type Params = Promise<{ table: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { table } = await params;

  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: "Table not allowed" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 50);

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: Params }) {
  const { table } = await params;

  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: "Table not allowed" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const { data, error } = await supabase
    .from(table)
    .insert({ ...body, user_id: auth.user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
