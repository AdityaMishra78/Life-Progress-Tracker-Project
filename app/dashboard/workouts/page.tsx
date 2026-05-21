"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { WorkoutForm } from "@/components/forms/WorkoutForm";
import { Dumbbell } from "lucide-react";

export default function WorkoutsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Workout Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Track your fitness sessions, reps, and progress.
          </p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Hide workout form" : "Log a workout"}
        </Button>
      </div>

      <AnimatedCard>
        {showForm ? (
          <WorkoutForm />
        ) : (
          <EmptyState
            title="Log your workouts"
            description="Track exercises, sets, reps, and weight. Monitor your fitness journey."
            action={
              <Button onClick={() => setShowForm(true)}>Log a workout</Button>
            }
          />
        )}
      </AnimatedCard>
    </div>
  );
}
