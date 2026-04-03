"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { useToastStore } from "@/lib/stores/useToastStore";
import type { Bundle } from "@/lib/types/bundle";
import { BundleStatusBadge } from "./BundleStatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrancheInvestCard } from "./TrancheInvestCard";

interface BundleCardProps {
  bundle: Bundle;
  onInvest?: (bundleId: string, tranche: "senior" | "junior", amount: number) => void;
  showInvestButtons?: boolean;
  extraActions?: React.ReactNode;
}

export function BundleCard({
  bundle,
  onInvest,
  showInvestButtons = true,
  extraActions,
}: BundleCardProps) {
  const [investModal, setInvestModal] = useState<"senior" | "junior" | null>(null);

  const totalRaised = bundle.seniorRaised + bundle.juniorRaised;
  const progressPct = bundle.totalGoal > 0 ? (totalRaised / bundle.totalGoal) * 100 : 0;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {bundle.name}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{bundle.oneliner}</p>
          </div>
          <BundleStatusBadge status={bundle.status} />
        </div>

        <Progress
          value={progressPct}
          barClassName="bg-[var(--primary)]"
          className="mb-4"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <TrancheInvestCard
            label="Senior Tranche"
            raised={bundle.seniorRaised}
            target={bundle.seniorTarget}
            apy={bundle.seniorAPY}
            color="var(--senior-tranche)"
          />
          <TrancheInvestCard
            label="Junior Tranche"
            raised={bundle.juniorRaised}
            target={bundle.juniorTarget}
            apy={bundle.juniorAPY}
            color="var(--junior-tranche)"
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-[var(--text-muted)]">
            {bundle.daysRemaining != null && bundle.daysRemaining > 0
              ? `${bundle.daysRemaining} days remaining`
              : bundle.status === "ended"
                ? "Funding ended"
                : "—"}
          </div>
          <div className="flex items-center gap-2">
            {extraActions}
            {showInvestButtons &&
              (bundle.status === "live") &&
              onInvest && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="border-[var(--senior-tranche)] text-[var(--senior-tranche)]"
                    onClick={() => setInvestModal("senior")}
                  >
                    Invest Senior
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="border-[var(--junior-tranche)] text-[var(--junior-tranche)]"
                    onClick={() => setInvestModal("junior")}
                  >
                    Invest Junior
                  </Button>
                </>
              )}
          </div>
        </div>
      </motion.div>

      {investModal && (
        <InvestModal
          bundle={bundle}
          tranche={investModal}
          onClose={() => setInvestModal(null)}
          onConfirm={(amount) => {
            onInvest?.(bundle.id, investModal, amount);
            setInvestModal(null);
          }}
        />
      )}
    </>
  );
}

function InvestModal({
  bundle,
  tranche,
  onClose,
  onConfirm,
}: {
  bundle: Bundle;
  tranche: "senior" | "junior";
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const num = Number(amount) || 0;
  const addToast = useToastStore((s) => s.addToast);
  const connected = useWalletStore((s) => s.connected);
  const remaining =
    tranche === "senior"
      ? Math.max(bundle.seniorTarget - bundle.seniorRaised, 0)
      : Math.max(bundle.juniorTarget - bundle.juniorRaised, 0);

  const handleSubmit = async () => {
    if (!connected) {
      addToast("Connect your wallet to place a demo investment.", "error");
      return;
    }

    if (!Number.isFinite(num) || num <= 0) return;

    if (!Number.isInteger(num)) {
      addToast("Use whole-number USDC amounts for demo investments.", "error");
      return;
    }

    if (num > remaining) {
      addToast(
        `That exceeds the remaining ${tranche} capacity of $${remaining.toLocaleString()}.`,
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      onConfirm(num);
      addToast(
        `Demo commitment added: $${num.toLocaleString()} to the ${tranche} tranche.`,
        "success"
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="relative z-50 w-full max-w-md card-surface p-6 mx-4 shadow-xl">
        <h2
          className="text-lg font-semibold text-[var(--text-primary)] mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Invest in {bundle.name}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          {tranche === "senior" ? "Senior" : "Junior"} tranche
        </p>
       
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">
              USDC amount
            </label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-primary)]"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Remaining capacity: ${remaining.toLocaleString()}
          </p>
          {num > 0 && (
            <p className="text-sm text-[var(--text-muted)]">
              Your QuillFi receipt tokens to receive: <strong className="text-[var(--text-primary)]">{num}</strong>
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={num <= 0 || loading || remaining <= 0}
          >
            {loading ? "Saving..." : remaining > 0 ? "Confirm Demo Investment" : "Fully Allocated"}
          </Button>
        </div>
      </div>
    </div>
  );
}
