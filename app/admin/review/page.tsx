"use client";

import { useMemo, useState } from "react";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { useToastStore } from "@/lib/stores/useToastStore";
import { Button } from "@/components/ui/button";
import { ADMIN_WALLET } from "@/lib/mock/demoData";
import { Shield, FileText, Clock3, CircleCheckBig, TriangleAlert } from "lucide-react";

const tabs = [
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

export default function AdminReviewPage() {
  const { connected, address } = useWalletStore();
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
  const isAdmin = connected && address === ADMIN_WALLET;
  const averagePendingGoal = useMemo(() => {
    if (pending.length === 0) return 0;
    return pending.reduce((sum, bundle) => sum + bundle.totalGoal, 0) / pending.length;
  }, [pending]);

  const list =
    tab === "pending" ? pending : tab === "approved" ? approved : declined;

  const handleApprove = (id: string) => {
    approveBundle(id, address);
    addToast("Bundle approved and promoted to live.", "success");
  };

  const handleDecline = (id: string, reason: string) => {
    if (reason.trim().length < 12) {
      addToast("Add a more specific decline reason so the originator can act on it.", "error");
      return;
    }
    declineBundle(id, reason.trim(), address);
    setDeclineModal(null);
    setDeclineReason("");
    addToast("Bundle declined and feedback has been recorded.", "info");
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

  if (!isAdmin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
          <Shield className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Restricted Admin Access</h2>
        <p className="max-w-md text-center text-[var(--text-muted)]">
          The review console is only available to the configured QuillFi admin wallet.
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)]">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    );
  }

  const reviewStats = [
    {
      label: "Pending Review",
      value: String(pending.length),
      helper: "Bundles awaiting decision",
      icon: Clock3,
      color: "text-[var(--warning)]",
    },
    {
      label: "Approved",
      value: String(approved.length),
      helper: "Bundles currently live",
      icon: CircleCheckBig,
      color: "text-[var(--success)]",
    },
    {
      label: "Declined",
      value: String(declined.length),
      helper: "Returned with feedback",
      icon: TriangleAlert,
      color: "text-[var(--error)]",
    },
  ];

  const getReviewSignals = (bundle: (typeof bundles)[number]) => {
    const allocationBalanced = bundle.totalGoal === bundle.seniorTarget + bundle.juniorTarget;
    const hasDocumentation = Boolean(bundle.contractPdfName);
    const hasSchedule = Boolean(bundle.estimatedFirstRepayment && bundle.endDate);

    return [
      {
        label: "Capital structure",
        state: allocationBalanced ? "Ready" : "Check",
        tone: allocationBalanced ? "text-[var(--success)]" : "text-[var(--warning)]",
      },
      {
        label: "Documents",
        state: hasDocumentation ? "Attached" : "Missing",
        tone: hasDocumentation ? "text-[var(--success)]" : "text-[var(--warning)]",
      },
      {
        label: "Repayment schedule",
        state: hasSchedule ? "Defined" : "Incomplete",
        tone: hasSchedule ? "text-[var(--success)]" : "text-[var(--warning)]",
      },
    ];
  };

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
          <p className="text-sm text-[var(--text-muted)]">Review, approve, and return bundle submissions with documented feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</p>
                  <p className="mt-2 font-mono text-2xl text-[var(--text-primary)]">{stat.value}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{stat.helper}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-2)] ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
        <div className="card-surface p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Avg Pending Goal</p>
          <p className="mt-2 font-mono text-2xl text-[var(--text-primary)]">${averagePendingGoal.toLocaleString()}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Average size of queued submissions</p>
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
                  {bundle.reviewedBy && (
                    <>
                      <span className="mx-2">·</span>
                      Reviewed by <span className="font-mono">{bundle.reviewedBy.slice(0, 6)}...{bundle.reviewedBy.slice(-4)}</span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" disabled={!bundle.contractPdfName}>
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  {bundle.contractPdfName ? "View PDF" : "No PDF"}
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
            <div className="mt-4 flex flex-wrap gap-2">
              {getReviewSignals(bundle).map((signal) => (
                <div key={signal.label} className="rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs">
                  <span className="text-[var(--text-muted)]">{signal.label}:</span>{" "}
                  <span className={signal.tone}>{signal.state}</span>
                </div>
              ))}
            </div>
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
              placeholder="Provide specific feedback for the originator..."
            />
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Include the issue, what needs to change, and any required supporting material. Minimum 12 characters.
            </p>
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
