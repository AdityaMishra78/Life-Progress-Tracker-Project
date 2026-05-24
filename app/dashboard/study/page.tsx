"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StudySessionForm } from "@/components/forms/StudySessionForm";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Brain, Calendar, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { localDb } from "@/lib/localDb";

export default function StudyPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("study_sessions")
          .select(`
            id,
            duration_minutes,
            session_type,
            notes,
            started_at,
            subject_id,
            subjects (
              name,
              color
            )
          `)
          .eq("user_id", user.id)
          .order("started_at", { ascending: false });

        if (error) throw error;
        setSessions(data || []);
      } else {
        setSessions(localDb.getStudySessions());
      }
    } catch (err) {
      console.error("Error fetching study sessions:", err);
      setSessions(localDb.getStudySessions());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this study session log?")) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("study_sessions").delete().eq("id", id);
        if (error) throw error;
      } else {
        localDb.deleteStudySession(id);
      }
      
      setSessions((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete study session:", err);
      alert("Failed to delete study session. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Study Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Log your sessions, track progress, and keep your study momentum going.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Hide session form" : "Log a session"}
        </Button>
      </div>

      {showForm && (
        <AnimatedCard>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Log study session</h2>
          </div>
          <StudySessionForm onSuccess={() => {
            setShowForm(false);
            fetchSessions();
          }} />
        </AnimatedCard>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-card/40" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        !showForm && (
          <AnimatedCard>
            <EmptyState
              title="Track your study sessions"
              description="Log hours, set goals, and watch your knowledge grow over time."
              action={
                <Button onClick={() => setShowForm(true)}>
                  Log a session
                </Button>
              }
            />
          </AnimatedCard>
        )
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => {
            const subjectName = session.subjects?.name || "General Study";
            const subjectColor = session.subjects?.color || "#8b5cf6";

            return (
              <AnimatedCard key={session.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
                    <Brain size={24} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black">{subjectName}</h3>
                      <Badge
                        variant="outline"
                        style={{ borderColor: subjectColor, color: subjectColor }}
                      >
                        {session.session_type}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {session.duration_minutes} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(session.started_at), "PPP p")}
                      </span>
                    </div>
                    {session.notes && (
                      <p className="mt-2 text-sm text-muted/80 bg-card/40 rounded-xl p-2.5 max-w-xl">
                        {session.notes}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 self-end sm:self-center"
                  onClick={() => handleDelete(session.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </AnimatedCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
