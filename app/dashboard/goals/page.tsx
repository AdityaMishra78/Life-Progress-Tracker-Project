"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { GoalForm } from "@/components/forms/GoalForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Target, Trash2, Calendar, Award, Plus, Minus, Check } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { localDb } from "@/lib/localDb";

export default function GoalsPage() {
  const router = useRouter();
  const [showGuide, setShowGuide] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("goals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setGoals(data || []);
      } else {
        setGoals(localDb.getGoals());
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
      setGoals(localDb.getGoals());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  async function updateProgress(goalId: string, currentProgress: number, change: number) {
    const nextProgress = Math.max(0, Math.min(100, currentProgress + change));
    const completed = nextProgress === 100;
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("goals")
          .update({ progress: nextProgress, completed })
          .eq("id", goalId);

        if (error) throw error;
      } else {
        localDb.updateGoalProgress(goalId, nextProgress);
      }

      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, progress: nextProgress, completed } : g))
      );
      router.refresh();
    } catch (err) {
      console.error("Failed to update goal progress:", err);
    }
  }

  async function handleDeleteGoal(id: string) {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("goals").delete().eq("id", id);
        if (error) throw error;
      } else {
        localDb.deleteGoal(id);
      }
      
      setGoals((prev) => prev.filter((g) => g.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete goal:", err);
      alert("Failed to delete goal. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Goals</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Create new goals and manage your progress with confidence.
          </p>
        </div>
        <Button onClick={() => setShowGuide((value) => !value)}>
          {showGuide ? "Hide goal ideas" : "View goal ideas"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnimatedCard>
          <h2 className="mb-4 text-lg font-bold">Add a new goal</h2>
          <GoalForm onSuccess={fetchGoals} />
        </AnimatedCard>
        
        <div className="space-y-4">
          {showGuide && (
            <AnimatedCard>
              <div className="space-y-3">
                <p className="font-semibold text-primary">Try goal ideas like:</p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
                  <li>Read 20 pages every day (Education)</li>
                  <li>Run three times per week (Health)</li>
                  <li>Finish a development course in one month (Career)</li>
                  <li>Save a specific amount of money (Finance)</li>
                </ul>
              </div>
            </AnimatedCard>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-card/40" />
              ))}
            </div>
          ) : goals.length === 0 ? (
            <EmptyState
              title={showGuide ? "Goal ideas" : "Set your goals"}
              description="Break down big ambitions into actionable goals and track your progress."
              action={
                <Button onClick={() => setShowGuide((value) => !value)}>
                  {showGuide ? "Hide goal ideas" : "View goal ideas"}
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const isUrgent = goal.priority === "urgent";
                const isHigh = goal.priority === "high";
                const isMedium = goal.priority === "medium";

                const badgeVariant = isUrgent
                  ? "destructive"
                  : isHigh
                  ? "default"
                  : isMedium
                  ? "outline"
                  : "secondary";

                let daysRemaining = null;
                if (goal.deadline) {
                  daysRemaining = differenceInDays(new Date(goal.deadline), new Date());
                }

                return (
                  <AnimatedCard
                    key={goal.id}
                    className="flex flex-col justify-between p-5 border border-border/40 relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-block rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary uppercase">
                              {goal.category}
                            </span>
                            <Badge variant={badgeVariant}>
                              {goal.priority} priority
                            </Badge>
                          </div>
                          <h3 className="text-lg font-black leading-tight">{goal.title}</h3>
                          {goal.description && (
                            <p className="mt-1 text-sm text-muted">{goal.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 size-8 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold">Progress</span>
                          <span className="font-black text-primary">{goal.progress}%</span>
                        </div>
                        
                        <div className="h-2 rounded-full bg-muted/15 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-neutral-800 to-neutral-400 dark:from-neutral-200 dark:to-neutral-600 transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateProgress(goal.id, goal.progress, -10)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted/15 flex items-center justify-center transition active:scale-95 disabled:opacity-40"
                              disabled={goal.progress === 0}
                            >
                              <Minus size={14} />
                            </button>
                            <button
                              onClick={() => updateProgress(goal.id, goal.progress, 10)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted/15 flex items-center justify-center transition active:scale-95 disabled:opacity-40"
                              disabled={goal.progress === 100}
                            >
                              <Plus size={14} />
                            </button>
                            {goal.progress < 100 && (
                              <button
                                onClick={() => updateProgress(goal.id, goal.progress, 100 - goal.progress)}
                                className="px-2.5 h-8 rounded-lg border border-border bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/20 flex items-center justify-center transition text-xs font-bold active:scale-95"
                              >
                                Complete
                              </button>
                            )}
                          </div>

                          {goal.completed && (
                            <span className="flex items-center gap-1 text-xs font-black text-emerald-400 uppercase tracking-wider">
                              <Check size={14} className="stroke-[3]" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {goal.deadline && (
                      <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          Deadline: {format(new Date(goal.deadline), "PP")}
                        </span>
                        {daysRemaining !== null && (
                          <span className={`font-bold ${daysRemaining < 3 ? "text-red-400 animate-pulse" : daysRemaining < 7 ? "text-amber-400" : ""}`}>
                            {daysRemaining < 0
                              ? "Overdue"
                              : daysRemaining === 0
                              ? "Due today"
                              : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`}
                          </span>
                        )}
                      </div>
                    )}
                  </AnimatedCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
