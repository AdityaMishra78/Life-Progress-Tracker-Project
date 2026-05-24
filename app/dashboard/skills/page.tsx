"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SkillForm } from "@/components/forms/SkillForm";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Sparkles, Trash2, Plus, Clock, BookOpen, ChevronDown, ChevronUp, History } from "lucide-react";
import { format } from "date-fns";

export default function SkillsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  
  // Inline log state
  const [loggingSkillId, setLoggingSkillId] = useState<string | null>(null);
  const [logHours, setLogHours] = useState(2);
  const [logNotes, setLogNotes] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  const fetchSkillsData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch skills and their logs in parallel
      const [skillsRes, logsRes] = await Promise.all([
        supabase
          .from("skills")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("skill_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("logged_at", { ascending: false })
      ]);

      if (skillsRes.error) throw skillsRes.error;
      if (logsRes.error) throw logsRes.error;

      // Group logs by skill_id
      const logsBySkill = (logsRes.data || []).reduce((acc: any, log: any) => {
        if (!acc[log.skill_id]) acc[log.skill_id] = [];
        acc[log.skill_id].push(log);
        return acc;
      }, {});

      // Combine skills with their logs and calculate dynamic total hours
      const combined = (skillsRes.data || []).map((skill: any) => {
        const skillLogs = logsBySkill[skill.id] || [];
        const totalLogged = skillLogs.reduce((sum: number, l: any) => sum + Number(l.hours), 0);
        const progressPercent = Math.min(100, Math.round((totalLogged / skill.target_hours) * 100));
        
        return {
          ...skill,
          logs: skillLogs,
          totalHoursLogged: totalLogged,
          progress: progressPercent
        };
      });

      setSkills(combined);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkillsData();
  }, [fetchSkillsData]);

  async function handleAddSkillLog(skillId: string) {
    if (logHours <= 0) return;
    setSubmittingLog(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("skill_logs").insert({
        skill_id: skillId,
        hours: logHours,
        notes: logNotes.trim() || null,
        user_id: user.id,
        logged_at: new Date().toISOString()
      });

      if (error) throw error;

      // Refresh both state and router stats
      setLogHours(2);
      setLogNotes("");
      setLoggingSkillId(null);
      await fetchSkillsData();
      router.refresh();
    } catch (err) {
      console.error("Failed to add skill log:", err);
      alert("Failed to save log. Please try again.");
    } finally {
      setSubmittingLog(false);
    }
  }

  async function handleDeleteSkill(id: string) {
    if (!confirm("Are you sure you want to delete this skill? All learning logs will be permanently deleted.")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      
      setSkills((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete skill:", err);
      alert("Failed to delete skill. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Skill Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Keep track of learning sessions and skill-building progress.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Hide skill form" : "Add a skill"}
        </Button>
      </div>

      {showForm && (
        <AnimatedCard>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Master a new skill</h2>
          </div>
          <SkillForm onSuccess={() => {
            setShowForm(false);
            fetchSkillsData();
          }} />
        </AnimatedCard>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-card/40" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        !showForm && (
          <AnimatedCard>
            <EmptyState
              title="Master new skills"
              description="Log hours spent learning, set target hours, and track your mastery progress."
              action={<Button onClick={() => setShowForm(true)}>Add a skill</Button>}
            />
          </AnimatedCard>
        )
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {skills.map((skill) => {
            const isExpanded = expandedSkillId === skill.id;
            const isLogging = loggingSkillId === skill.id;

            return (
              <AnimatedCard key={skill.id} className="flex flex-col justify-between p-5 border border-border/40">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {skill.category && (
                        <span className="inline-block rounded-lg bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-400 mb-2">
                          {skill.category}
                        </span>
                      )}
                      <h3 className="text-xl font-black">{skill.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 size-9 rounded-xl hover:bg-card border border-border"
                        onClick={() => setLoggingSkillId(isLogging ? null : skill.id)}
                      >
                        <Plus size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 size-9 rounded-xl text-muted hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {skill.description && (
                    <p className="mt-2 text-sm text-muted line-clamp-2">{skill.description}</p>
                  )}

                  {/* Progress Section */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>{skill.totalHoursLogged} / {skill.target_hours} hours</span>
                      <span className="text-primary">{skill.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/15">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-neutral-800 to-neutral-400 dark:from-neutral-200 dark:to-neutral-600 transition-all duration-500"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Logging Panel */}
                {isLogging && (
                  <div className="mt-4 rounded-2xl bg-card/40 p-4 border border-border/30 space-y-3 animate-fadeIn">
                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                      <Clock size={14} className="text-pink-400" />
                      Log learning hours
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={logHours}
                        onChange={(e) => setLogHours(Number(e.target.value))}
                        className="w-20 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-sm outline-none"
                        disabled={submittingLog}
                      />
                      <input
                        type="text"
                        placeholder="What did you study/practice?"
                        value={logNotes}
                        onChange={(e) => setLogNotes(e.target.value)}
                        className="flex-1 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-sm outline-none"
                        disabled={submittingLog}
                      />
                      <Button
                        size="sm"
                        disabled={submittingLog || logHours <= 0}
                        onClick={() => handleAddSkillLog(skill.id)}
                      >
                        {submittingLog ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* History Section Toggle */}
                <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                  <button
                    className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition font-bold"
                    onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                  >
                    <History size={14} />
                    <span>View Logs ({skill.logs.length})</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Logs History List */}
                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-border/20 pt-3 max-h-40 overflow-y-auto no-scrollbar">
                    {skill.logs.length === 0 ? (
                      <p className="text-xs text-muted/60 italic text-center py-2">No learning logs recorded yet.</p>
                    ) : (
                      skill.logs.map((log: any) => (
                        <div key={log.id} className="flex justify-between items-start gap-2 bg-card/30 p-2.5 rounded-xl border border-border/10 text-xs">
                          <div>
                            <p className="font-semibold text-foreground/80">{log.notes || "Learned/practiced skill"}</p>
                            <p className="text-[10px] text-muted/80 mt-0.5">{format(new Date(log.logged_at), "PP p")}</p>
                          </div>
                          <span className="font-black text-pink-400 bg-pink-500/5 px-2 py-0.5 rounded-lg border border-pink-500/10">+{log.hours}h</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </AnimatedCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
