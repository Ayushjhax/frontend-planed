"use client";

import { motion } from "framer-motion";
import { demoPositions, portfolioHistoryMonths, monthlyRepaymentSchedule } from "@/lib/mock/demoData";
import { InvestorDistributionChart } from "@/components/charts/InvestorDistributionChart";
import { RepaymentTimeline } from "@/components/charts/RepaymentTimeline";
import { DollarSign, TrendingUp, Coins, Lock } from "lucide-react";

const totalInvested = demoPositions.reduce((s, p) => s + p.invested, 0);
const portfolioValue = 8030;
const accruedYield = 30;
const edufiStaked = 8000;

const stats = [
  { icon: DollarSign, label: "Total Invested", value: `$${totalInvested.toLocaleString()} USDC`, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400" },
  { icon: TrendingUp, label: "Portfolio Value", value: `$${portfolioValue.toLocaleString()} USDC`, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400" },
  { icon: Coins, label: "Accrued Yield", value: `$${accruedYield}`, color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400" },
  { icon: Lock, label: "EDUFI Staked", value: edufiStaked.toLocaleString(), color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400" },
];

export default function AssetDashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1
          className="text-2xl text-[var(--text-primary)] mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Asset Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)]">Your portfolio overview and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-surface p-5 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} pointer-events-none`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-xl font-mono text-[var(--text-primary)] mt-2">{card.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)] ${card.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface p-5">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
            Portfolio Value Over Time
          </h3>
          <InvestorDistributionChart data={portfolioHistoryMonths} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card-surface p-5">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
            Monthly Repayment Schedule
          </h3>
          <RepaymentTimeline data={monthlyRepaymentSchedule} />
        </motion.div>
      </div>

      <div className="card-surface p-5">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
          My Positions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Bundle</th>
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Tranche</th>
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Invested</th>
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Tokens</th>
                <th className="pb-3 pr-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Expected Return</th>
              </tr>
            </thead>
            <tbody>
              {demoPositions.map((pos) => (
                <tr key={`${pos.bundleId}-${pos.tranche}`} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-2)]/50 transition-colors">
                  <td className="py-3.5 pr-4 text-[var(--text-primary)] font-medium">{pos.bundleName}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`badge-pill ${pos.tranche === "senior" ? "bg-[var(--senior-tranche)]/15 text-[var(--senior-tranche)]" : "bg-[var(--junior-tranche)]/15 text-[var(--junior-tranche)]"}`}>
                      {pos.tranche}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-mono">${pos.invested.toLocaleString()}</td>
                  <td className="py-3.5 pr-4 font-mono">{pos.tokens.toLocaleString()} EDUFI</td>
                  <td className="py-3.5 pr-4">
                    <span className="badge-pill bg-[var(--primary)]/15 text-[var(--primary)]">{pos.status}</span>
                  </td>
                  <td className="py-3.5 font-mono text-[var(--success)]">${pos.expectedReturn.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
