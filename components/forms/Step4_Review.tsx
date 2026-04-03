"use client";

import { useFormContext } from "react-hook-form";
import { FileText } from "lucide-react";

export function Step4_Review() {
  const values = useFormContext().watch();

  return (
    <div className="space-y-4">
      <div className="card-surface p-5">
        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
          Bundle Details
        </h4>
        <p className="text-lg font-medium text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          {values.name || "Untitled Bundle"}
        </p>
        {values.oneliner && (
          <p className="text-sm text-[var(--text-muted)] mt-1">{values.oneliner}</p>
        )}
        {values.description && (
          <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-3">{values.description}</p>
        )}
      </div>
      <div className="card-surface p-5">
        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
          Financial Metrics
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Total Goal</span>
            <span className="font-mono">${Number(values.totalGoal || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Senior Target</span>
            <span className="font-mono text-[var(--senior-tranche)]">${Number(values.seniorTarget || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Junior Target</span>
            <span className="font-mono text-[var(--junior-tranche)]">${Number(values.juniorTarget || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Fixed Rate (Senior / Junior)</span>
            <span className="font-mono">{values.seniorFixedRate ?? 0}% / {values.juniorFixedRate ?? 1}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Expected Junior APY</span>
            <span className="font-mono">{values.juniorAPY ?? 1}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Repayment</span>
            <span className="font-mono">{values.repaymentFrequency} × {values.totalRepaymentCycles}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Redemption Rate</span>
            <span className="font-mono">{values.redemptionRate}%</span>
          </div>
        </div>
      </div>
      <div className="card-surface p-5">
        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
          Vault & Documents
        </h4>
        <p className="text-sm text-[var(--text-muted)]">
          Vault address: <span className="font-mono text-[var(--text-primary)]">4xK9...mR3q</span>
        </p>
        {values.contractPdfName ? (
          <div className="flex items-center gap-2 mt-2">
            <FileText className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm text-[var(--text-primary)]">{values.contractPdfName}</span>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)] mt-1">No contract PDF attached</p>
        )}
      </div>
    </div>
  );
}
