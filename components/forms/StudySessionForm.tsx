"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { QuickAuth } from "@/components/dashboard/QuickAuth";

interface StudySessionFormProps {
  onSuccess?: () => void;
}

export function StudySessionForm({ onSuccess }: StudySessionFormProps) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(60);
  const [sessionType, setSessionType] = useState("focus");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectsList, setSubjectsList] = useState<{ id: string; name: string }[]>([]);

  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  const checkUser = useCallback(async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    setUser(authUser);
    setUserLoading(false);
    
    if (authUser) {
      const { data } = await supabase
        .from("subjects")
        .select("id, name")
        .eq("user_id", authUser.id);
      if (data) setSubjectsList(data);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    if (duration <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to log a session");
      }

      // 1. Find or create the subject
      const trimmedSubjectName = subject.trim();
      const existing = subjectsList.find(
        (s) => s.name.toLowerCase() === trimmedSubjectName.toLowerCase()
      );

      let subjectId = null;
      if (existing) {
        subjectId = existing.id;
      } else {
        const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const { data: newSub, error: subError } = await supabase
          .from("subjects")
          .insert({
            name: trimmedSubjectName,
            user_id: user.id,
            color: randomColor
          })
          .select()
          .single();

        if (subError) throw subError;
        subjectId = newSub.id;
      }

      // 2. Log the study session
      const { error: sessionError } = await supabase.from("study_sessions").insert({
        subject_id: subjectId,
        duration_minutes: duration,
        session_type: sessionType,
        notes: notes.trim(),
        user_id: user.id,
        started_at: new Date().toISOString()
      });

      if (sessionError) throw sessionError;

      setSubject("");
      setDuration(60);
      setNotes("");
      setSessionType("focus");

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to log study session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (userLoading) {
    return <div className="h-44 animate-pulse rounded-2xl bg-card/40 border border-border/10" />;
  }

  if (!user) {
    return (
      <QuickAuth
        title="Activate Study Tracker"
        description="Verify your workspace to record focus hours, subjects, and study sessions."
        onSuccess={checkUser}
      />
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          list="subjects-datalist"
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Mathematics"
          disabled={loading}
        />
        <datalist id="subjects-datalist">
          {subjectsList.map((s) => (
            <option key={s.id} value={s.name} />
          ))}
        </datalist>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Duration (min)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Session type</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          >
            <option value="focus">Focused</option>
            <option value="review">Review</option>
            <option value="practice">Practice</option>
            <option value="reading">Reading</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
          placeholder="What did you study? (optional)"
          disabled={loading}
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Logging..." : "Log Study Session"}
      </Button>
    </form>
  );
}
