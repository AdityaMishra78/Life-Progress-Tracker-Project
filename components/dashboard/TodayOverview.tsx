"use client";

import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { CheckCircle2, Clock, Dumbbell, Flame } from "lucide-react";

export function TodayOverview() {
  return (
    <AnimatedCard className="col-span-2">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Today&apos;s overview</h2>
          <p className="text-sm text-muted">Your daily progress at a glance</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-orange-400">
          <Flame size={16} />
          <span>3 day streak</span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-card/60 p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-sm text-muted">Study time</p>
            <p className="text-xl font-black">2h 15m</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-card/60 p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Dumbbell size={20} />
          </div>
          <div>
            <p className="text-sm text-muted">Workouts</p>
            <p className="text-xl font-black">1</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-card/60 p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm text-muted">Habits</p>
            <p className="text-xl font-black">5/7</p>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
