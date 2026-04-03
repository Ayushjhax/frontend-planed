"use client";

import { useEffect, useMemo, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { useToastStore } from "@/lib/stores/useToastStore";
import { Button } from "@/components/ui/button";
import {
  BUNDLE_APPROVAL_FEE_RECIPIENT,
  BUNDLE_APPROVAL_FEE_SOL,
  approveAssetPoolOnChain,
  declineAssetPoolOnChain,
  fetchSystemConfig,
} from "@/lib/solana/program";
import type { Bundle } from "@/lib/types/bundle";
import {
  Shield,
  Clock3,
  CircleCheckBig,
  TriangleAlert,
  CalendarRange,
  Percent,
  Repeat2,
} from "lucide-react";

const tabs = [
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function AdminReviewPage() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { connected, address } = useWalletStore();
  const bundles = useBundleStore((s) => s.bundles);
  const loading = useBundleStore((s) => s.loading);
  const error = useBundleStore((s) => s.error);
  const refreshBundles = useBundleStore((s) => s.refreshBundles);
  const addToast = useToastStore((s) => s.addToast);
  const [tab, setTab] = useState("pending");
  const [protocolAdmin, setProtocolAdmin] = useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [pendingBundleId, setPendingBundleId] = useState<string | null>(null);
  const [declineModal, setDeclineModal] = useState<Bundle | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoadingConfig(true);

    void fetchSystemConfig(connection)
      .then((config) => {
        if (!cancelled) {
          setProtocolAdmin(config?.superAdmin ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProtocolAdmin(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingConfig(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [connection]);

  const pending = bundles.filter((bundle) => bundle.status === "under_review");
  const approved = bundles.filter((bundle) => bundle.status === "live");
  const declined = bundles.filter((bundle) => bundle.status === "declined");
  const isAdminViewer = connected && Boolean(address) && protocolAdmin === address;
  const isProtocolAdmin = connected && Boolean(address) && protocolAdmin === address;
  const averagePendingGoal = useMemo(() => {
    if (pending.length === 0) return 0;
    return pending.reduce((sum, bundle) => sum + bundle.totalGoal, 0) / pending.length;
  }, [pending]);

  const list =
    tab === "pending" ? pending : tab === "approved" ? approved : declined;

  const handleApprove = async (bundle: Bundle) => {
    if (!anchorWallet) {
      addToast("Connect the configured admin wallet before approving pools.", "error");
      return;
    }

    if (!isProtocolAdmin) {
      addToast(
        "This wallet can view the admin console, but only the on-chain super-admin can approve bundles.",
        "error"
      );
      return;
    }

    setPendingBundleId(bundle.id);

    try {
      const signature = await approveAssetPoolOnChain({
        connection,
        wallet: anchorWallet,
        creator: bundle.createdBy,
        name: bundle.name,
      });

      await refreshBundles(connection);
      addToast(
        `Bundle approved on-chain. Tx: ${signature.slice(0, 8)}...`,
        "success"
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Approval failed on-chain.";
      addToast(message, "error");
    } finally {
      setPendingBundleId(null);
    }
  };

  const handleDecline = async (bundle: Bundle, reason: string) => {
    if (!anchorWallet) {
      addToast("Connect the configured admin wallet before declining pools.", "error");
      return;
    }

    if (!isProtocolAdmin) {
      addToast(
        "This wallet can view the admin console, but only the on-chain super-admin can decline bundles.",
        "error"
      );
      return;
    }

    if (reason.trim().length < 12) {
      addToast(
        "Add a brief internal review note before declining. It will not be stored on-chain yet.",
        "error"
      );
      return;
    }

    setPendingBundleId(bundle.id);

    try {
      const signature = await declineAssetPoolOnChain({
        connection,
        wallet: anchorWallet,
        creator: bundle.createdBy,
        name: bundle.name,
      });

      await refreshBundles(connection);
      setDeclineModal(null);
      setDeclineReason("");
      addToast(
        `Bundle declined on-chain. Tx: ${signature.slice(0, 8)}... Review notes remain off-chain for now.`,
        "info"
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Decline failed on-chain.";
      addToast(message, "error");
    } finally {
      setPendingBundleId(null);
    }
  };

  const reviewStats = [
    {
      label: "Pending Review",
      value: String(pending.length),
      helper: "Pools awaiting admin action",
      icon: Clock3,
      color: "text-[var(--warning)]",
    },
    {
      label: "Approved",
      value: String(approved.length),
      helper: "Pools already live on-chain",
      icon: CircleCheckBig,
      color: "text-[var(--success)]",
    },
    {
      label: "Declined",
      value: String(declined.length),
      helper: "Pools marked cancelled on-chain",
      icon: TriangleAlert,
      color: "text-[var(--error)]",
    },
  ];

  const getReviewSignals = (bundle: Bundle) => {
    const allocationBalanced = bundle.totalGoal === bundle.seniorTarget + bundle.juniorTarget;
    const fundingWindowValid = new Date(bundle.endDate) > new Date(bundle.startDate);
    const repaymentScheduleValid =
      bundle.totalRepaymentCycles > 0 && Boolean(bundle.estimatedFirstRepayment);

    return [
      {
        label: "Capital structure",
        state: allocationBalanced ? "Balanced" : "Check",
        tone: allocationBalanced ? "text-[var(--success)]" : "text-[var(--warning)]",
        icon: Percent,
      },
      {
        label: "Funding window",
        state: fundingWindowValid ? "Defined" : "Invalid",
        tone: fundingWindowValid ? "text-[var(--success)]" : "text-[var(--warning)]",
        icon: CalendarRange,
      },
      {
        label: "Repayment schedule",
        state: repaymentScheduleValid ? "Ready" : "Check",
        tone: repaymentScheduleValid ? "text-[var(--success)]" : "text-[var(--warning)]",
        icon: Repeat2,
      },
    ];
  };

  if (!connected) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
          <Shield className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Admin Access</h2>
        <p className="text-[var(--text-muted)]">Connect your wallet to access the on-chain review console.</p>
      </div>
    );
  }

  if (loadingConfig) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
          <Shield className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Loading Admin Console</h2>
        <p className="text-[var(--text-muted)]">Fetching the protocol system config from devnet...</p>
      </div>
    );
  }

  if (!protocolAdmin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
          <Shield className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Protocol Config Missing</h2>
        <p className="max-w-md text-center text-[var(--text-muted)]">
          The system config account does not exist on this cluster yet, so admin review cannot start.
        </p>
      </div>
    );
  }

  if (!isAdminViewer) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
          <Shield className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Restricted Admin Access</h2>
        <p className="max-w-md text-center text-[var(--text-muted)]">
          The review console is only available to the protocol super-admin wallet recorded on-chain.
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)]">
          Required: {shortAddress(protocolAdmin)}
        </p>
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
          <p className="text-sm text-[var(--text-muted)]">
            Review and action QuillFi asset pools directly against Solana program state
          </p>
        </div>
      </div>

      {(loading || error) && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
          {loading ? "Refreshing asset pools from devnet..." : error}
        </div>
      )}

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
          <p className="mt-1 text-xs text-[var(--text-muted)]">Average queue size in USDC</p>
        </div>
      </div>

     

      <div className="flex gap-2">
        {tabs.map((tabOption) => (
          <button
            key={tabOption.value}
            type="button"
            onClick={() => setTab(tabOption.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              tab === tabOption.value
                ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tabOption.label}
            {tabOption.value === "pending" && pending.length > 0 && (
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
                  Creator: <span className="font-mono">{shortAddress(bundle.createdBy)}</span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {bundle.status === "under_review" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-[var(--success)] text-white hover:opacity-90"
                      onClick={() => void handleApprove(bundle)}
                      disabled={pendingBundleId === bundle.id || !isProtocolAdmin}
                    >
                      {pendingBundleId === bundle.id ? "Submitting..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeclineModal(bundle)}
                      disabled={pendingBundleId === bundle.id || !isProtocolAdmin}
                    >
                      Decline
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
              {getReviewSignals(bundle).map((signal) => {
                const Icon = signal.icon;
                return (
                  <div
                    key={signal.label}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5"
                  >
                    <Icon className={`h-3.5 w-3.5 ${signal.tone}`} />
                    <span className="text-xs text-[var(--text-muted)]">{signal.label}</span>
                    <span className={`text-xs font-medium ${signal.tone}`}>{signal.state}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-10 text-center text-sm text-[var(--text-muted)]">
            No pools in this review state right now.
          </div>
        )}
      </div>

      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Decline: {declineModal.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Add an internal review note before confirming. The pool status will be stored on-chain,
              but this note is not stored on-chain yet.
            </p>
            <label className="block text-sm text-[var(--text-muted)] mt-4 mb-2">Internal review note</label>
            <textarea
              value={declineReason}
              onChange={(event) => setDeclineReason(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
              placeholder="Example: junior support ratio needs revision before committee approval."
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeclineModal(null);
                  setDeclineReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => void handleDecline(declineModal, declineReason)}
                disabled={pendingBundleId === declineModal.id}
              >
                {pendingBundleId === declineModal.id ? "Submitting..." : "Decline On-Chain"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
