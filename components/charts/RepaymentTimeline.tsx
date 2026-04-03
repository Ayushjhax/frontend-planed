"use client";

import { useSyncExternalStore } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RepaymentTimelineProps {
  data: { month: string; amount: number }[];
}

const subscribe = () => () => {};

export function RepaymentTimeline({ data }: RepaymentTimelineProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div className="h-[280px] min-h-[200px] w-full min-w-0">
      {!mounted ? (
        <div className="flex h-full items-center justify-center rounded-xl bg-[var(--surface-2)] text-sm text-[var(--text-muted)]">
          Loading repayment schedule...
        </div>
      ) : (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            stroke="var(--border)"
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            stroke="var(--border)"
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
            formatter={(value) => [`$${Number(value)}`, "Amount"]}
          />
          <Bar
            dataKey="amount"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            name="Repayment"
          />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
