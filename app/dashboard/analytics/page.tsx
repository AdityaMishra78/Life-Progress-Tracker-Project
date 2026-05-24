"use client";

import { useState, useEffect } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { WeeklyChart } from "@/components/analytics/WeeklyChart";
import { BalanceChart } from "@/components/analytics/BalanceChart";
import { Heatmap } from "@/components/analytics/Heatmap";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Brain, Dumbbell, CheckSquare, TrendingUp, Download } from "lucide-react";

function exportData(table: string) {
  const link = document.createElement("a");
  link.href = `/api/export/csv?table=${table}`;
  link.download = `${table}.csv`;
  link.click();
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const studyMinutesVal = analytics?.studyMinutes ?? 0;
  const formattedStudy = studyMinutesVal >= 1000 
    ? (studyMinutesVal / 1000).toFixed(1) + "k" 
    : studyMinutesVal.toString();

  const xpVal = analytics?.xpGained ?? 0;
  const formattedXp = xpVal >= 1000 
    ? (xpVal / 1000).toFixed(1) + "k" 
    : xpVal.toLocaleString();

  const statCards = [
    { label: "Study minutes", value: formattedStudy, icon: Brain, color: "text-neutral-500" },
    { label: "Workouts", value: (analytics?.workouts ?? 0).toString(), icon: Dumbbell, color: "text-neutral-400" },
    { label: "Habit streak", value: `${analytics?.habitStreak ?? 0} days`, icon: CheckSquare, color: "text-neutral-600" },
    { label: "XP gained", value: formattedXp, icon: TrendingUp, color: "text-foreground" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black">Analytics</h1>
        <Button variant="secondary" onClick={() => exportData("study_sessions")}>
          <Download className="mr-2 size-4" />
          Export Data
        </Button>
      </div>

      {loading ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-card/40 border border-border/10" />
            ))}
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-card/40 border border-border/10" />
            ))}
          </section>
          <div className="h-60 animate-pulse rounded-2xl bg-card/40 border border-border/10" />
        </>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
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
              <WeeklyChart data={analytics.weeklyData} />
            </AnimatedCard>

            <AnimatedCard>
              <div className="mb-5">
                <h2 className="text-xl font-black">Activity distribution</h2>
                <p className="text-sm text-muted">How you spend your time</p>
              </div>
              <BalanceChart data={analytics.balanceData} />
            </AnimatedCard>
          </section>

          <AnimatedCard>
            <div className="mb-5">
              <h2 className="text-xl font-black">Activity consistency</h2>
              <p className="text-sm text-muted">Daily consistency over the past month</p>
            </div>
            <Heatmap data={analytics.heatmapData} />
          </AnimatedCard>
        </>
      )}
    </div>
  );
}
