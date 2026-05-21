"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StudySessionForm } from "@/components/forms/StudySessionForm";

export default function StudyPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Study Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Log your sessions, track progress, and keep your study momentum going.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Hide session form" : "Log a session"}
        </Button>
      </div>

      <AnimatedCard>
        {showForm ? (
          <StudySessionForm />
        ) : (
          <EmptyState
            title="Track your study sessions"
            description="Log hours, set goals, and watch your knowledge grow over time."
            action={
              <Button onClick={() => setShowForm(true)}>
                Log a session
              </Button>
            }
          />
        )}
      </AnimatedCard>
    </div>
  );
}
