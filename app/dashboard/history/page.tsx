"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Brain, Dumbbell, Sparkles, CheckSquare, Calendar, Trash2, History } from "lucide-react";
import { format } from "date-fns";
import { localDb } from "@/lib/localDb";

type LogItem = {
  id: string;
  type: "study" | "workout" | "skill" | "habit";
  title: string;
  subtitle: string;
  notes?: string | null;
  timestamp: string;
  extraInfo?: string;
  color?: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "study" | "workout" | "skill" | "habit">("all");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const normalized: LogItem[] = [];

      if (user) {
        // Fetch all different logs in parallel from Supabase
        const [studyRes, workoutRes, skillRes, habitRes] = await Promise.all([
          supabase
            .from("study_sessions")
            .select("id, duration_minutes, session_type, notes, started_at, subjects(name, color)")
            .eq("user_id", user.id),
          supabase
            .from("workout_logs")
            .select("id, title, duration_minutes, completed_at")
            .eq("user_id", user.id),
          supabase
            .from("skill_logs")
            .select("id, hours, milestone, notes, logged_at, skills(name)")
            .eq("user_id", user.id),
          supabase
            .from("habit_logs")
            .select("id, completed_on, habits(name, color)")
            .eq("user_id", user.id)
        ]);

        if (studyRes.data) {
          studyRes.data.forEach((s: any) => {
            normalized.push({
              id: s.id,
              type: "study",
              title: s.subjects?.name || "General Study",
              subtitle: `${s.session_type} Session`,
              notes: s.notes,
              timestamp: s.started_at,
              extraInfo: `${s.duration_minutes} mins`,
              color: s.subjects?.color || "#8b5cf6"
            });
          });
        }

        if (workoutRes.data) {
          workoutRes.data.forEach((w: any) => {
            normalized.push({
              id: w.id,
              type: "workout",
              title: w.title || "Gym Session",
              subtitle: "Fitness Log",
              timestamp: w.completed_at,
              extraInfo: `${w.duration_minutes} mins`,
              color: "#22c55e"
            });
          });
        }

        if (skillRes.data) {
          skillRes.data.forEach((s: any) => {
            normalized.push({
              id: s.id,
              type: "skill",
              title: s.skills?.name || "Skill Building",
              subtitle: s.milestone || "Practiced Skill",
              notes: s.notes,
              timestamp: s.logged_at,
              extraInfo: `+${s.hours} hours`,
              color: "#ec4899"
            });
          });
        }

        if (habitRes.data) {
          habitRes.data.forEach((h: any) => {
            normalized.push({
              id: h.id,
              type: "habit",
              title: h.habits?.name || "Habit Check-in",
              subtitle: "Completed Habit",
              timestamp: `${h.completed_on}T12:00:00Z`,
              extraInfo: "Checked off",
              color: h.habits?.color || "#e5e7eb"
            });
          });
        }
      } else {
        // Fallback to local storage database
        const localStudy = localDb.getStudySessions();
        const localWorkout = localDb.getWorkouts();
        const localSkills = localDb.getSkills();
        const localSkillLogs = localDb.getSkillLogs();
        const localHabits = localDb.getHabits();
        const localHabitLogs = localDb.getHabitLogs();

        localStudy.forEach((s) => {
          normalized.push({
            id: s.id,
            type: "study",
            title: s.subjects?.name || "General Study",
            subtitle: `${s.session_type} Session`,
            notes: s.notes,
            timestamp: s.started_at,
            extraInfo: `${s.duration_minutes} mins`,
            color: s.subjects?.color || "#8b5cf6"
          });
        });

        localWorkout.forEach((w) => {
          normalized.push({
            id: w.id,
            type: "workout",
            title: w.title,
            subtitle: "Fitness Log",
            notes: w.notes,
            timestamp: w.completed_at,
            extraInfo: `${w.duration_minutes} mins`,
            color: "#22c55e"
          });
        });

        localSkillLogs.forEach((s) => {
          const parent = localSkills.find((k) => k.id === s.skill_id);
          normalized.push({
            id: s.id,
            type: "skill",
            title: parent?.name || "Skill Building",
            subtitle: "Practiced Skill",
            timestamp: s.logged_at,
            extraInfo: `+${s.hours} hours`,
            color: "#ec4899"
          });
        });

        localHabitLogs.forEach((h) => {
          const parent = localHabits.find((k) => k.id === h.habit_id);
          normalized.push({
            id: h.id,
            type: "habit",
            title: parent?.name || "Habit Check-in",
            subtitle: "Completed Habit",
            timestamp: `${h.completed_on}T12:00:00Z`,
            extraInfo: "Checked off",
            color: parent?.color || "#e5e7eb"
          });
        });
      }

      normalized.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(normalized);
    } catch (err) {
      console.error("Error loading history logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  async function handleDelete(log: LogItem) {
    if (!confirm("Are you sure you want to delete this log? This cannot be undone.")) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        let table = "";
        if (log.type === "study") table = "study_sessions";
        else if (log.type === "workout") table = "workout_logs";
        else if (log.type === "skill") table = "skill_logs";
        else if (log.type === "habit") table = "habit_logs";

        const { error } = await supabase.from(table).delete().eq("id", log.id);
        if (error) throw error;
      } else {
        if (log.type === "study") localDb.deleteStudySession(log.id);
        else if (log.type === "workout") localDb.deleteWorkout(log.id);
        else if (log.type === "skill") {
          // Find skill log to delete
          const logs = localDb.getSkillLogs();
          const target = logs.find((l) => l.id === log.id);
          if (target) {
            const list = logs.filter((l) => l.id !== log.id);
            localStorage.setItem("local_db_skill_logs", JSON.stringify(list));
            // Recalculate parent skill
            const skills = localDb.getSkills();
            const skillIndex = skills.findIndex((s) => s.id === target.skill_id);
            if (skillIndex > -1) {
              const skill = skills[skillIndex];
              const totalHours = list
                .filter((l) => l.skill_id === target.skill_id)
                .reduce((sum, l) => sum + Number(l.hours), 0);
              skills[skillIndex] = {
                ...skill,
                progress: Math.min(100, Math.round((totalHours / skill.target_hours) * 100))
              };
              localStorage.setItem("local_db_skills", JSON.stringify(skills));
            }
          }
        } else if (log.type === "habit") {
          const list = localDb.getHabitLogs().filter((h) => h.id !== log.id);
          localStorage.setItem("local_db_habit_logs", JSON.stringify(list));
        }
      }

      setLogs((prev) => prev.filter((item) => item.id !== log.id));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete log:", err);
      alert("Failed to delete log. Please try again.");
    }
  }

  const filteredLogs = logs.filter((log) => activeTab === "all" || log.type === activeTab);

  const getIcon = (type: string) => {
    switch (type) {
      case "study": return Brain;
      case "workout": return Dumbbell;
      case "skill": return Sparkles;
      case "habit": return CheckSquare;
      default: return History;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "study": return "text-neutral-500 bg-neutral-100 dark:bg-neutral-800/60 dark:text-neutral-300";
      case "workout": return "text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 dark:text-neutral-300";
      case "skill": return "text-neutral-600 bg-neutral-100 dark:bg-neutral-800/60 dark:text-neutral-300";
      case "habit": return "text-neutral-700 bg-neutral-100 dark:bg-neutral-800/60 dark:text-neutral-300";
      default: return "text-neutral-500 bg-neutral-100 dark:bg-neutral-800/60 dark:text-neutral-300";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Logs History</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          A centralized, unified feed of all study sessions, workouts, skill practice hours, and habit checks you have logged.
        </p>
      </div>

      <div className="flex gap-2 border-b border-border/40 pb-2 overflow-x-auto no-scrollbar">
        {(["all", "study", "workout", "skill", "habit"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition whitespace-nowrap ${
              activeTab === tab
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground hover:bg-card/60"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-card/40 border border-border/10" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <AnimatedCard>
          <EmptyState
            title="No logs found"
            description={
              activeTab === "all"
                ? "You haven't logged any activities yet. Start adding workouts or study sessions!"
                : `No logged ${activeTab} activities found in your database.`
            }
          />
        </AnimatedCard>
      ) : (
        <div className="grid gap-4">
          {filteredLogs.map((log) => {
            const Icon = getIcon(log.type);
            const badgeClasses = getTypeColor(log.type);

            return (
              <AnimatedCard
                key={`${log.type}-${log.id}`}
                className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center border border-border/40"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex size-12 items-center justify-center rounded-2xl ${badgeClasses}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black leading-tight">{log.title}</h3>
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {log.type}
                      </Badge>
                      {log.extraInfo && (
                        <span className="text-xs font-black text-foreground bg-foreground/5 px-2 py-0.5 rounded-lg border border-foreground/10">
                          {log.extraInfo}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{log.subtitle}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted/80">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {format(new Date(log.timestamp), "PPP p")}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="mt-2 text-sm text-muted bg-card/40 border border-border/10 rounded-xl p-2.5 max-w-xl">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 self-end sm:self-center"
                  onClick={() => handleDelete(log)}
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
