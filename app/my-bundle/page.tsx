"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBundleStore } from "@/lib/stores/useBundleStore";
import { BundleCard } from "@/components/bundle/BundleCard";
import { Button } from "@/components/ui/button";
import type { BundleStatus } from "@/lib/types/bundle";

const tabs: { value: BundleStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Ongoing" },
  { value: "ended", label: "Ended" },
  { value: "draft", label: "Draft" },
];

export default function MyBundlePage() {
  const bundles = useBundleStore((s) => s.bundles);
  const [tab, setTab] = useState<BundleStatus | "all">("all");

  const myBundles = useMemo(() => {
    const list = bundles.filter(
      (b) =>
        b.status === "draft" ||
        b.status === "under_review" ||
        b.status === "live" ||
        b.status === "ended"
    );
    if (tab === "all") return list;
    return list.filter((b) => b.status === tab);
  }, [bundles, tab]);

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
            extraActions={
              bundle.status === "draft" ? (
                <Link href={`/my-bundle/create?edit=${bundle.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              ) : null
            }
          />
        ))}
      </div>
      {myBundles.length === 0 && (
        <p className="text-[var(--text-muted)] text-center py-12">
          No bundles in this tab. Create one or switch tab.
        </p>
      )}
    </div>
  );
}
