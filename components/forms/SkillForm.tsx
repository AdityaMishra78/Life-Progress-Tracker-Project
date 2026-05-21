"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function SkillForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [targetHours, setTargetHours] = useState(100);

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Skill name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., React Development"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Programming"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
          placeholder="What do you want to learn?"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Target hours</label>
        <input
          type="number"
          value={targetHours}
          onChange={(e) => setTargetHours(Number(e.target.value))}
          className="w-full rounded-2xl border border-border bg-card/60 px-4 py-3 outline-none"
        />
      </div>
      <Button className="w-full">Add Skill</Button>
    </form>
  );
}
