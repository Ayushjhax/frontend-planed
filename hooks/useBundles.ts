"use client";

import { useBundleStore } from "@/lib/stores/useBundleStore";
import type { BundleStatus } from "@/lib/types/bundle";

export function useBundles() {
  const bundles = useBundleStore((s) => s.bundles);
  const updateBundle = useBundleStore((s) => s.updateBundle);
  const addBundle = useBundleStore((s) => s.addBundle);

  const byStatus = (status: BundleStatus | "all") => {
    if (status === "all") return bundles;
    return bundles.filter((b) => b.status === status);
  };

  const liveBundles = bundles.filter((b) => b.status === "live");
  const totalDeployed = liveBundles.reduce(
    (sum, b) => sum + b.seniorRaised + b.juniorRaised,
    0
  );
  const avgApy =
    liveBundles.length > 0
      ? liveBundles.reduce((s, b) => s + b.juniorAPY, 0) / liveBundles.length
      : 0;

  return {
    bundles,
    liveBundles,
    totalDeployed,
    activeCount: liveBundles.length,
    averageApy: avgApy,
    byStatus,
    updateBundle,
    addBundle,
  };
}
