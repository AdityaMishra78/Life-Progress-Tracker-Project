"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { HabitForm } from "@/components/forms/HabitForm";
import { CheckSquare } from "lucide-react";

export default function HabitsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Habit Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Create and track daily habits with streaks and reminders.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Hide habit form" : "Add a habit"}
        </Button>
      </div>

      <AnimatedCard>
        {showForm ? (
          <HabitForm />
        ) : (
          <EmptyState
            title="Build lasting habits"
            description="Create daily or weekly habits, track check-ins, and build streaks."
            action={<Button onClick={() => setShowForm(true)}>Add a habit</Button>}
          />
        )}
      </AnimatedCard>
    </div>
  );
}
