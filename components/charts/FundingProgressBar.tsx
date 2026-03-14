"use client";

import { motion } from "framer-motion";

interface FundingProgressBarProps {
  seniorRaised: number;
  juniorRaised: number;
  totalGoal: number;
  className?: string;
}

export function FundingProgressBar({
  seniorRaised,
  juniorRaised,
  totalGoal,
  className = "",
}: FundingProgressBarProps) {
  const total = seniorRaised + juniorRaised;
  const pct = totalGoal > 0 ? (total / totalGoal) * 100 : 0;
  const seniorPct = total > 0 ? (seniorRaised / total) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full flex"
        >
          <div
            className="h-full"
            style={{
              width: `${seniorPct}%`,
              backgroundColor: "var(--senior-tranche)",
            }}
          />
          <div
            className="h-full flex-1"
            style={{ backgroundColor: "var(--junior-tranche)" }}
          />
        </motion.div>
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-1">
        ${total.toLocaleString()} / ${totalGoal.toLocaleString()} USDC
      </p>
    </div>
  );
}
