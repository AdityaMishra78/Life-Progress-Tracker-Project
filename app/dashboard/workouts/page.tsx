"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { WorkoutForm } from "@/components/forms/WorkoutForm";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Dumbbell, Calendar, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { localDb } from "@/lib/localDb";

export default function WorkoutsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("workout_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false });

        if (error) throw error;
        setWorkouts(data || []);
      } else {
        setWorkouts(localDb.getWorkouts());
      }
    } catch (err) {
      console.error("Error fetching workouts:", err);
      // Fallback
      setWorkouts(localDb.getWorkouts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this workout log?")) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("workout_logs").delete().eq("id", id);
        if (error) throw error;
      } else {
        localDb.deleteWorkout(id);
      }
      
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete workout:", err);
      alert("Failed to delete workout. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Workout Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Track your fitness sessions, reps, and progress.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Hide workout form" : "Log a workout"}
        </Button>
      </div>

      {showForm && (
        <AnimatedCard>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Log your workout</h2>
          </div>
          <WorkoutForm onSuccess={() => {
            setShowForm(false);
            fetchWorkouts();
          }} />
        </AnimatedCard>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-card/40" />
          ))}
        </div>
      ) : workouts.length === 0 ? (
        !showForm && (
          <AnimatedCard>
            <EmptyState
              title="Log your workouts"
              description="Track exercises, sets, reps, and weight. Monitor your fitness journey."
              action={
                <Button onClick={() => setShowForm(true)}>Log a workout</Button>
              }
            />
          </AnimatedCard>
        )
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <AnimatedCard key={workout.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black">{workout.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {workout.duration_minutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {format(new Date(workout.completed_at), "PPP p")}
                    </span>
                  </div>
                  {workout.notes && (
                    <p className="mt-2 text-sm text-muted/80 bg-card/40 rounded-xl p-2.5 max-w-xl">
                      {workout.notes}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 self-end sm:self-center"
                onClick={() => handleDelete(workout.id)}
              >
                <Trash2 size={16} />
              </Button>
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
