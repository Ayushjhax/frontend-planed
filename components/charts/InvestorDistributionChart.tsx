"use client";

import { useSyncExternalStore } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface InvestorDistributionChartProps {
  data: { month: string; value: number }[];
}

const subscribe = () => () => {};

export function InvestorDistributionChart({ data }: InvestorDistributionChartProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div className="h-[280px] min-h-[200px] w-full min-w-0">
      {!mounted ? (
        <div className="flex h-full items-center justify-center rounded-xl bg-[var(--surface-2)] text-sm text-[var(--text-muted)]">
          Loading portfolio chart...
        </div>
      ) : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            formatter={(value) => [`$${Number(value)}`, "Portfolio value"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#portfolioGrad)"
            name="Portfolio value"
          />
        </AreaChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
