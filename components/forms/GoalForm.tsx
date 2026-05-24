"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { QuickAuth } from "@/components/dashboard/QuickAuth";

interface GoalFormProps {
  onSuccess?: () => void;
}

export function GoalForm({ onSuccess }: GoalFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  const checkUser = useCallback(async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    setUser(authUser);
    setUserLoading(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a goal title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to add a goal");
      }

      const { error: insertError } = await supabase.from("goals").insert({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        deadline: deadline || null,
        progress: 0,
        completed: false,
        user_id: user.id
      });

      if (insertError) throw insertError;

      setTitle("");
      setDescription("");
      setCategory("personal");
      setPriority("medium");
      setDeadline("");

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add goal. Please try again.");
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
        title="Activate Goal Tracker"
        description="Verify your workspace to set milestones and log target-oriented goals."
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
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Learn TypeScript"
          disabled={loading}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
          placeholder="Details about the goal... (optional)"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          >
            <option value="personal">Personal</option>
            <option value="career">Career</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          disabled={loading}
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Goal"}
      </Button>
    </form>
  );
}
