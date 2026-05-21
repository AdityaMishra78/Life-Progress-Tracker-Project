"use client";

import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { WeeklyChart } from "@/components/analytics/WeeklyChart";
import { BalanceChart } from "@/components/analytics/BalanceChart";
import { Heatmap } from "@/components/analytics/Heatmap";
import { Button } from "@/components/ui/Button";
import { Brain, Dumbbell, CheckSquare, Flame, TrendingUp, Download } from "lucide-react";

const weeklyData = [
  { day: "Mon", study: 120, workout: 1 },
  { day: "Tue", study: 90, workout: 0 },
  { day: "Wed", study: 150, workout: 1 },
  { day: "Thu", study: 60, workout: 0 },
  { day: "Fri", study: 180, workout: 1 },
  { day: "Sat", study: 45, workout: 0 },
  { day: "Sun", study: 0, workout: 0 }
];

const balanceData = [
  { name: "Study", value: 45, color: "#8b5cf6" },
  { name: "Workout", value: 20, color: "#22c55e" },
  { name: "Habits", value: 30, color: "#f59e0b" },
  { name: "Skills", value: 15, color: "#06b6d4" }
];

const heatmapData = Array.from({ length: 7 * 4 }, (_, i) => ({
  date: `Day ${i + 1}`,
  value: Math.floor(Math.random() * 10)
}));

function exportData(table: string) {
  const link = document.createElement("a");
  link.href = `/api/export/csv?table=${table}`;
  link.download = `${table}.csv`;
  link.click();
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black">Analytics</h1>
        <Button variant="secondary" onClick={() => exportData("study_sessions")}>
          <Download className="mr-2 size-4" />
          Export Data
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Study minutes", value: "8.4k", icon: Brain, color: "text-violet-400" },
          { label: "Workouts", value: "47", icon: Dumbbell, color: "text-emerald-400" },
          { label: "Habit streak", value: "23 days", icon: CheckSquare, color: "text-amber-400" },
          { label: "XP gained", value: "2,840", icon: TrendingUp, color: "text-cyan-400" }
        ].map(({ label, value, icon: Icon, color }) => (
          <AnimatedCard key={label} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className={`flex size-12 items-center justify-center rounded-2xl bg-card/80 ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-sm text-muted">{label}</p>
            </div>
          </AnimatedCard>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AnimatedCard>
          <div className="mb-5">
            <h2 className="text-xl font-black">Weekly balance</h2>
            <p className="text-sm text-muted">Study vs workout activity</p>
          </div>
          <WeeklyChart data={weeklyData} />
        </AnimatedCard>

        <AnimatedCard>
          <div className="mb-5">
            <h2 className="text-xl font-black">Activity distribution</h2>
            <p className="text-sm text-muted">How you spend your time</p>
          </div>
          <BalanceChart data={balanceData} />
        </AnimatedCard>
      </section>

      <AnimatedCard>
        <div className="mb-5">
          <h2 className="text-xl font-black">Activity heatmap</h2>
          <p className="text-sm text-muted">Daily consistency over the past month</p>
        </div>
        <Heatmap data={heatmapData} />
      </AnimatedCard>
    </div>
  );
}
