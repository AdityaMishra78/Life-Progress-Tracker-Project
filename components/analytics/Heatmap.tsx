"use client";

import { cn } from "@/lib/utils";

interface HeatmapProps {
  data: { date: string; value: number }[];
  className?: string;
}

export function Heatmap({ data, className }: HeatmapProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("grid grid-cols-7 gap-1", className)}>
      {data.map((day, i) => {
        const intensity = day.value / max;
        return (
          <div
            key={i}
            className={cn(
              "aspect-square rounded-sm transition",
              intensity === 0 && "bg-muted/10",
              intensity > 0 && intensity <= 0.25 && "bg-emerald-500/20",
              intensity > 0.25 && intensity <= 0.5 && "bg-emerald-500/40",
              intensity > 0.5 && intensity <= 0.75 && "bg-emerald-500/60",
              intensity > 0.75 && "bg-emerald-500/80"
            )}
            title={`${day.date}: ${day.value}`}
          />
        );
      })}
    </div>
  );
}
