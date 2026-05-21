"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SkillForm } from "@/components/forms/SkillForm";
import { Sparkles } from "lucide-react";

export default function SkillsPage() {
  const [showForm, setShowForm] = useState(false);

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

      <AnimatedCard>
        {showForm ? (
          <SkillForm />
        ) : (
          <EmptyState
            title="Master new skills"
            description="Log hours spent learning, set target hours, and track your mastery progress."
            action={<Button onClick={() => setShowForm(true)}>Add a skill</Button>}
          />
        )}
      </AnimatedCard>
    </div>
  );
}
