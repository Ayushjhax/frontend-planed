"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TrancheAllocationChartProps {
  seniorRaised: number;
  juniorRaised: number;
  seniorTarget: number;
  juniorTarget: number;
}

const COLORS = ["var(--senior-tranche)", "var(--junior-tranche)"];

export function TrancheAllocationChart({
  seniorRaised,
  juniorRaised,
  seniorTarget,
  juniorTarget,
}: TrancheAllocationChartProps) {
  const withValues = [
    { name: "Senior", value: seniorRaised, target: seniorTarget },
    { name: "Junior", value: juniorRaised, target: juniorTarget },
  ].filter((d) => d.value > 0);

  const data =
    withValues.length > 0
      ? withValues
      : [
          { name: "Senior", value: seniorTarget || 1, target: seniorTarget },
          { name: "Junior", value: juniorTarget || 1, target: juniorTarget },
        ];

  return (
    <div className="h-[280px] min-h-[200px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}k`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
            formatter={(value) => [`$${Number(value).toLocaleString()} USDC`, "Raised"]}
          />
          <Legend
            formatter={(value) => <span className="text-[var(--text-primary)]">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
