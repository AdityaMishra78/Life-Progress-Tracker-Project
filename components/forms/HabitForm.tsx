"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

interface HabitFormProps {
  onSuccess?: () => void;
}

export function HabitForm({ onSuccess }: HabitFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("daily");
  const [routine, setRoutine] = useState("anytime");
  const [color, setColor] = useState("#22c55e");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = ["#22c55e", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a habit name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to add a habit");
      }

      const { error: insertError } = await supabase.from("habits").insert({
        name: name.trim(),
        description: description.trim(),
        period,
        routine,
        color,
        user_id: user.id,
        active: true
      });

      if (insertError) throw insertError;

      setName("");
      setDescription("");
      setPeriod("daily");
      setRoutine("anytime");
      setColor("#22c55e");

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add habit. Please try again.");
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
        <label className="mb-1 block text-sm font-medium">Habit name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Read for 30 minutes"
          disabled={loading}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Optional description..."
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Routine</label>
          <select
            value={routine}
            onChange={(e) => setRoutine(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          >
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="anytime">Anytime</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Color</label>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`size-8 rounded-full border-2 transition ${
                color === c ? "border-foreground" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              disabled={loading}
            />
          ))}
        </div>
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Habit"}
      </Button>
    </form>
  );
}
