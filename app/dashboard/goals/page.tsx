"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { GoalForm } from "@/components/forms/GoalForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Target } from "lucide-react";

export default function GoalsPage() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Goals</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Create new goals and manage your progress with confidence.
          </p>
        </div>
        <Button onClick={() => setShowGuide((value) => !value)}>
          {showGuide ? "Hide goal ideas" : "View goal ideas"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnimatedCard>
          <h2 className="mb-4 text-lg font-bold">Add a new goal</h2>
          <GoalForm />
        </AnimatedCard>
        <div className="space-y-4">
          <EmptyState
            title={showGuide ? "Goal ideas" : "Set your goals"}
            description="Break down big ambitions into actionable goals and track your progress."
            action={
              <Button onClick={() => setShowGuide((value) => !value)}>
                {showGuide ? "Hide goal ideas" : "View goal ideas"}
              </Button>
            }
          />
          {showGuide && (
            <AnimatedCard>
              <div className="space-y-3">
                <p className="font-semibold">Try goal ideas like:</p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
                  <li>Read 20 pages every day</li>
                  <li>Run three times per week</li>
                  <li>Finish a course in one month</li>
                </ul>
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  );
}
