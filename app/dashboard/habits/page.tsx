"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { HabitForm } from "@/components/forms/HabitForm";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, Trash2, Calendar, Award } from "lucide-react";
import { format } from "date-fns";

export default function HabitsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [habits, setHabits] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabitsData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const todayStr = format(new Date(), "yyyy-MM-dd");

      const [habitsRes, logsRes] = await Promise.all([
        supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
          .eq("active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("habit_logs")
          .select("habit_id")
          .eq("user_id", user.id)
          .eq("completed_on", todayStr)
      ]);

      if (habitsRes.error) throw habitsRes.error;
      if (logsRes.error) throw logsRes.error;

      setHabits(habitsRes.data || []);
      setCompletedToday(logsRes.data?.map((l: any) => l.habit_id) || []);
    } catch (err) {
      console.error("Error fetching habits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabitsData();
  }, [fetchHabitsData]);

  async function toggleHabit(habitId: string, isCompleted: boolean) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const todayStr = format(new Date(), "yyyy-MM-dd");

      if (isCompleted) {
        // Uncheck: delete log
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_on", todayStr)
          .eq("user_id", user.id);
        if (error) throw error;
        setCompletedToday((prev) => prev.filter((id) => id !== habitId));
      } else {
        // Check: insert log
        const { error } = await supabase
          .from("habit_logs")
          .insert({
            habit_id: habitId,
            completed_on: todayStr,
            completed: true,
            user_id: user.id
          });
        if (error) throw error;
        setCompletedToday((prev) => [...prev, habitId]);
      }
      router.refresh();
    } catch (err) {
      console.error("Error toggling habit:", err);
    }
  }

  async function handleDeleteHabit(id: string) {
    if (!confirm("Are you sure you want to delete this habit? All log history will be removed.")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      
      setHabits((prev) => prev.filter((h) => h.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete habit:", err);
      alert("Failed to delete habit. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Habit Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Create and track daily habits with streaks and reminders.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Hide habit form" : "Add a habit"}
        </Button>
      </div>

      {showForm && (
        <AnimatedCard>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Add a habit</h2>
          </div>
          <HabitForm onSuccess={() => {
            setShowForm(false);
            fetchHabitsData();
          }} />
        </AnimatedCard>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-card/40" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        !showForm && (
          <AnimatedCard>
            <EmptyState
              title="Build lasting habits"
              description="Create daily or weekly habits, track check-ins, and build streaks."
              action={<Button onClick={() => setShowForm(true)}>Add a habit</Button>}
            />
          </AnimatedCard>
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const isCompleted = completedToday.includes(habit.id);
            const color = habit.color || "#22c55e";

            return (
              <AnimatedCard
                key={habit.id}
                className="flex flex-col justify-between p-5 border transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: `${color}25` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span
                      className="inline-block rounded-lg px-2 py-0.5 text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {habit.period} • {habit.routine}
                    </span>
                    <h3 className="text-lg font-black leading-tight line-clamp-1">{habit.name}</h3>
                    {habit.description && (
                      <p className="mt-1 text-sm text-muted line-clamp-2">{habit.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleHabit(habit.id, isCompleted)}
                    className="flex size-10 items-center justify-center rounded-xl bg-card border border-border shadow-sm text-muted hover:scale-105 active:scale-95 transition"
                    style={{ color: isCompleted ? color : "inherit" }}
                  >
                    {isCompleted ? (
                      <CheckSquare size={24} style={{ fill: `${color}10` }} />
                    ) : (
                      <Square size={24} />
                    )}
                  </button>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Award size={14} style={{ color }} />
                    <span>Active Habit</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1.5 size-8 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDeleteHabit(habit.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
