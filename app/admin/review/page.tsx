"use client";

import { useState } from "react";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { useToastStore } from "@/lib/stores/useToastStore";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const tabs = [
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

export default function AdminReviewPage() {
  const { connected } = useWalletStore();
  const bundles = useBundleStore((s) => s.bundles);
  const approveBundle = useBundleStore((s) => s.approveBundle);
  const declineBundle = useBundleStore((s) => s.declineBundle);
  const addToast = useToastStore((s) => s.addToast);
  const [tab, setTab] = useState("pending");
  const [declineModal, setDeclineModal] = useState<{ id: string; name: string } | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const pending = bundles.filter((b) => b.status === "under_review");
  const approved = bundles.filter((b) => b.status === "live");
  const declined = bundles.filter((b) => b.status === "declined");

  const list =
    tab === "pending" ? pending : tab === "approved" ? approved : declined;

  const handleApprove = (id: string) => {
    approveBundle(id);
    addToast("Bundle approved and is now live.");
  };

  const handleDecline = (id: string, reason: string) => {
    declineBundle(id, reason);
    setDeclineModal(null);
    setDeclineReason("");
    addToast("Bundle declined.");
  };

  if (!connected) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
          <Shield className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Admin Access</h2>
        <p className="text-[var(--text-muted)]">Connect your wallet to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
          <Shield className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Admin Review Panel
          </h1>
          <p className="text-sm text-[var(--text-muted)]">Review and manage bundle submissions</p>
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              tab === t.value
                ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
            {t.value === "pending" && pending.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                {pending.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((bundle) => (
          <div key={bundle.id} className="card-surface p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  {bundle.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{bundle.oneliner}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Submitted: {bundle.submittedAt ? new Date(bundle.submittedAt).toLocaleDateString() : "—"}
                  <span className="mx-2">·</span>
                  <span className="font-mono">{bundle.createdBy}</span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm">
                  View PDF
                </Button>
                {bundle.status === "under_review" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-[var(--success)] text-white hover:opacity-90"
                      onClick={() => handleApprove(bundle.id)}
                    >
                      ✓ Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeclineModal({ id: bundle.id, name: bundle.name })}
                    >
                      ✗ Decline
                    </Button>
                  </>
                )}
              </div>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t border-[var(--border)]">
              <div>
                <dt className="text-[var(--text-muted)] text-xs">Goal</dt>
                <dd className="font-mono mt-0.5">${bundle.totalGoal.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)] text-xs">Senior / Junior APY</dt>
                <dd className="font-mono mt-0.5">{bundle.seniorAPY}% / {bundle.juniorAPY}%</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)] text-xs">Tranches (S / J)</dt>
                <dd className="font-mono mt-0.5">
                  ${bundle.seniorTarget.toLocaleString()} / ${bundle.juniorTarget.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)] text-xs">Repayment</dt>
                <dd className="font-mono mt-0.5">{bundle.repaymentFrequency} × {bundle.totalRepaymentCycles}</dd>
              </div>
            </dl>
            {bundle.declineReason && (
              <p className="text-sm text-[var(--error)] mt-3 p-3 bg-[var(--error)]/10 rounded-lg">
                Decline reason: {bundle.declineReason}
              </p>
            )}
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">No items in this tab.</p>
        </div>
      )}

      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeclineModal(null)} aria-hidden />
          <div className="relative z-50 w-full max-w-md card-surface p-6 mx-4 shadow-2xl">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Decline: {declineModal.name}
            </h3>
            <label className="block text-sm text-[var(--text-muted)] mb-2">Reason for decline</label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Provide a reason..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeclineModal(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDecline(declineModal.id, declineReason)}
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
