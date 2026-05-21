"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area
} from "recharts";

export function WeeklyChart({
  data
}: {
  data: { day: string; study: number; workout: number }[];
}) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="study" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,.25)",
              background: "rgba(15,23,42,.92)",
              color: "white"
            }}
          />
          <Area
            type="monotone"
            dataKey="study"
            stroke="#8b5cf6"
            fill="url(#study)"
            strokeWidth={3}
          />
          <Bar dataKey="workout" fill="#22c55e" radius={[10, 10, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
