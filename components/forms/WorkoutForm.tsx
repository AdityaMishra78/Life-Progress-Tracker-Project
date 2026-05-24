"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

interface WorkoutFormProps {
  onSuccess?: () => void;
}

export function WorkoutForm({ onSuccess }: WorkoutFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a workout title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to log a workout");
      }

      const { error: insertError } = await supabase.from("workout_logs").insert({
        title: title.trim(),
        duration_minutes: duration,
        user_id: user.id,
        completed_at: new Date().toISOString()
      });

      if (insertError) throw insertError;

      setTitle("");
      setDuration(45);
      setNotes("");
      
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Workout title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Upper body workout"
          disabled={loading}
        />
      </div>
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
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
          placeholder="What exercises did you do? (optional)"
          disabled={loading}
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Logging..." : "Log Workout"}
      </Button>
    </form>
  );
}
