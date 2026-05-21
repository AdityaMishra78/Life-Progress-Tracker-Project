"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function HabitForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("daily");
  const [routine, setRoutine] = useState("anytime");
  const [color, setColor] = useState("#22c55e");

  const colors = ["#22c55e", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Habit name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Read for 30 minutes"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Optional description..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none"
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
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none"
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
            />
          ))}
        </div>
      </div>
      <Button className="w-full">Add Habit</Button>
    </form>
  );
}
