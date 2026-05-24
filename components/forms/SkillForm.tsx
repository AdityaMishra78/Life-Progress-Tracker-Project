"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

interface SkillFormProps {
  onSuccess?: () => void;
}

export function SkillForm({ onSuccess }: SkillFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [targetHours, setTargetHours] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a skill name");
      return;
    }
    if (targetHours <= 0) {
      setError("Target hours must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to add a skill");
      }

      const { error: insertError } = await supabase.from("skills").insert({
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        target_hours: targetHours,
        progress: 0,
        user_id: user.id
      });

      if (insertError) throw insertError;

      setName("");
      setCategory("");
      setDescription("");
      setTargetHours(100);

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add skill. Please try again.");
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
        <label className="mb-1 block text-sm font-medium">Skill name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., React Development"
          disabled={loading}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Programming"
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
          placeholder="What do you want to learn? (optional)"
          disabled={loading}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Target hours</label>
        <input
          type="number"
          value={targetHours}
          onChange={(e) => setTargetHours(Number(e.target.value))}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          disabled={loading}
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Skill"}
      </Button>
    </form>
  );
}
