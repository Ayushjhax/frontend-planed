"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useBundles } from "@/hooks/useBundles";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { BundleCard } from "@/components/bundle/BundleCard";
import { BundleFilters } from "@/components/bundle/BundleFilters";
import { TrancheAllocationChart } from "@/components/charts/TrancheAllocationChart";
import type { BundleStatus } from "@/lib/types/bundle";
import { DollarSign, TrendingUp, Activity, Clock3, Target, ShieldCheck } from "lucide-react";

const statCards = [
  {
    icon: DollarSign,
    label: "Total Capital Deployed",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
    suffix: " USDC",
  },
  {
    icon: Activity,
    label: "Active Bundles",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
    suffix: "",
  },
  {
    icon: TrendingUp,
    label: "Average APY",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
    suffix: "%",
  },
];

export default function BundlePoolPage() {
  const { bundles, totalDeployed, activeCount, averageApy, byStatus, liveBundles } = useBundles();
  const invest = useBundleStore((s) => s.invest);
  const [filter, setFilter] = useState<BundleStatus | "all">("all");

  const filtered = useMemo(() => byStatus(filter), [byStatus, filter]);

  const chartData = useMemo(() => {
    const senior = bundles.reduce((s, b) => s + b.seniorRaised, 0);
    const junior = bundles.reduce((s, b) => s + b.juniorRaised, 0);
    const sTarget = bundles.reduce((s, b) => s + b.seniorTarget, 0);
    const jTarget = bundles.reduce((s, b) => s + b.juniorTarget, 0);
    return { seniorRaised: senior, juniorRaised: junior, seniorTarget: sTarget, juniorTarget: jTarget };
  }, [bundles]);

  const liveMetrics = useMemo(() => {
    const liveTarget = liveBundles.reduce((sum, bundle) => sum + bundle.totalGoal, 0);
    const liveRaised = liveBundles.reduce(
      (sum, bundle) => sum + bundle.seniorRaised + bundle.juniorRaised,
      0
    );
    const seniorFill = chartData.seniorTarget
      ? (chartData.seniorRaised / chartData.seniorTarget) * 100
      : 0;
    const juniorFill = chartData.juniorTarget
      ? (chartData.juniorRaised / chartData.juniorTarget) * 100
      : 0;
    const overallFill = liveTarget ? (liveRaised / liveTarget) * 100 : 0;
    const capitalRemaining = Math.max(liveTarget - liveRaised, 0);
    const closingSoon = liveBundles.filter((bundle) => (bundle.daysRemaining ?? Infinity) <= 14).length;
    const fullyFunded = liveBundles.filter(
      (bundle) => bundle.seniorRaised + bundle.juniorRaised >= bundle.totalGoal
    ).length;

    return [
      {
        icon: Target,
        label: "Live Funding Progress",
        value: `${overallFill.toFixed(1)}%`,
        detail: `$${liveRaised.toLocaleString()} of $${liveTarget.toLocaleString()} raised`,
      },
      {
        icon: DollarSign,
        label: "Capital Remaining",
        value: `$${capitalRemaining.toLocaleString()}`,
        detail: "Still needed across live bundles",
      },
      {
        icon: ShieldCheck,
        label: "Senior Fill Rate",
        value: `${seniorFill.toFixed(1)}%`,
        detail: `$${chartData.seniorRaised.toLocaleString()} committed`,
      },
      {
        icon: TrendingUp,
        label: "Junior Fill Rate",
        value: `${juniorFill.toFixed(1)}%`,
        detail: `$${chartData.juniorRaised.toLocaleString()} committed`,
      },
      {
        icon: Clock3,
        label: "Closing Soon",
        value: String(closingSoon),
        detail: "Live bundles with 14 days or less remaining",
      },
      {
        icon: Activity,
        label: "Fully Funded",
        value: String(fullyFunded),
        detail: "Live bundles already at 100% of target",
      },
    ];
  }, [chartData.juniorRaised, chartData.juniorTarget, chartData.seniorRaised, chartData.seniorTarget, liveBundles]);

  const statValues = [
    `$${totalDeployed.toLocaleString()}`,
    String(activeCount),
    averageApy.toFixed(1),
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1
          className="text-2xl text-[var(--text-primary)] mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          QuillFi
        </h1>
        <p className="max-w-4xl text-sm leading-6 text-[var(--text-muted)]">
          QuillFi is a decentralized lending protocol designed to bring real-world
          student loan financing on-chain. By linking global investors with verified
          student loan originators, it turns education debt into a transparent,
          investable, and impact-focused asset class. The protocol uses blockchain
          infrastructure, a dual-tranche capital structure, and smart contracts to
          create a more efficient and equitable flow of capital into education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card-surface p-5 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} pointer-events-none`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-2xl font-mono text-[var(--text-primary)] mt-2">
                    {statValues[i]}{card.suffix}
                  </p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)] ${card.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <BundleFilters value={filter} onChange={(v) => setFilter(v as BundleStatus | "all")} />
          <div className="space-y-4">
            {filtered.map((bundle) => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                onInvest={invest}
                showInvestButtons
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[var(--text-muted)]">
                No bundles match this filter.
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="card-surface p-5 sticky top-24">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
              Tranche Allocation
            </h3>
            <TrancheAllocationChart
              seniorRaised={chartData.seniorRaised}
              juniorRaised={chartData.juniorRaised}
              seniorTarget={chartData.seniorTarget}
              juniorTarget={chartData.juniorTarget}
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-[var(--surface-2)] p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--senior-tranche)]" />
                  <span className="text-[var(--text-muted)] text-xs">Senior</span>
                </div>
                <p className="font-mono mt-1">${chartData.seniorRaised.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-[var(--surface-2)] p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--junior-tranche)]" />
                  <span className="text-[var(--text-muted)] text-xs">Junior</span>
                </div>
                <p className="font-mono mt-1">${chartData.juniorRaised.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                Live Bundle Metrics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {liveMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-lg bg-[var(--surface-2)] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                            {metric.label}
                          </p>
                          <p className="mt-1 font-mono text-base text-[var(--text-primary)]">
                            {metric.value}
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--primary)]">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                        {metric.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
