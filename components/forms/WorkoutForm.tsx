"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function WorkoutForm() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState("");

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Workout title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Upper body workout"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Duration (min)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
          placeholder="What exercises did you do?"
        />
      </div>
      <Button className="w-full">Log Workout</Button>
    </form>
  );
}
