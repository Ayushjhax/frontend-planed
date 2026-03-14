"use client";

import { motion } from "framer-motion";
import { Progress } from "../ui/progress";
import type { Bundle } from "../../lib/types/bundle";

export function FundingProgressBar({ bundle }: { bundle: Bundle }) {
  const totalRaised = bundle.seniorRaised + bundle.juniorRaised;
  const pct = bundle.totalGoal > 0 ? (totalRaised / bundle.totalGoal) * 100 : 0;
  const seniorPct = bundle.totalGoal > 0 ? (bundle.seniorRaised / bundle.totalGoal) * 100 : 0;
  const juniorPct = bundle.totalGoal > 0 ? (bundle.juniorRaised / bundle.totalGoal) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${seniorPct}%` }}
          transition={{ duration: 0.8 }}
          className="bg-[var(--senior-tranche)]"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${juniorPct}%` }}
          transition={{ duration: 0.8 }}
          className="bg-[var(--junior-tranche)]"
        />
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        {totalRaised.toLocaleString()} / {bundle.totalGoal.toLocaleString()} USDC
      </p>
    </div>
  );
}
