"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { BundleCard } from "@/components/bundle/BundleCard";
import { Button } from "@/components/ui/button";
import type { BundleStatus } from "@/lib/types/bundle";

const tabs: { value: BundleStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "under_review", label: "Under Review" },
  { value: "live", label: "Ongoing" },
  { value: "ended", label: "Ended" },
  { value: "declined", label: "Declined" },
];

export default function MyBundlePage() {
  const bundles = useBundleStore((s) => s.bundles);
  const loading = useBundleStore((s) => s.loading);
  const error = useBundleStore((s) => s.error);
  const connected = useWalletStore((s) => s.connected);
  const address = useWalletStore((s) => s.address);
  const [tab, setTab] = useState<BundleStatus | "all">("all");

  const myBundles = useMemo(() => {
    const list = bundles.filter((bundle) => bundle.createdBy === address);
    if (tab === "all") return list;
    return list.filter((b) => b.status === tab);
  }, [address, bundles, tab]);

  if (!connected) {
    return (
      <div className="p-6 space-y-4">
        <h1
          className="text-xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          My Bundles
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Connect your wallet to view the bundles you originated on-chain.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          My Bundles
        </h1>
        <Link href="/my-bundle/create">
          <Button>+ Create Bundle</Button>
        </Link>
      </div>
      <p className="text-sm text-[var(--text-muted)] -mt-4">Create, track, and manage QuillFi bundle submissions across their full lifecycle.</p>
      {loading && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
          Refreshing your on-chain bundles from devnet...
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--text-muted)]">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              tab === t.value
                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myBundles.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            showInvestButtons={false}
          />
        ))}
      </div>
      {myBundles.length === 0 && (
        <p className="text-[var(--text-muted)] text-center py-12">
          No on-chain bundles found in this tab yet.
        </p>
      )}
    </div>
  );
}
