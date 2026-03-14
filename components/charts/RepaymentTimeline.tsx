"use client";

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

export function RepaymentTimeline({ data }: RepaymentTimelineProps) {
  return (
    <div className="h-[280px] min-h-[200px] w-full min-w-0">
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
    </div>
  );
}
