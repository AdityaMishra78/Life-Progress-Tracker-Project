"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function StudySessionForm() {
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(60);
  const [sessionType, setSessionType] = useState("focus");
  const [notes, setNotes] = useState("");

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Mathematics"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
          <label className="mb-1 block text-sm font-medium">Session type</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none"
          >
            <option value="focus">Focused</option>
            <option value="review">Review</option>
            <option value="practice">Practice</option>
            <option value="reading">Reading</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
          placeholder="What did you study?"
        />
      </div>
      <Button className="w-full">Log Study Session</Button>
    </form>
  );
}
