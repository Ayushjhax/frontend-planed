import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bundle } from "@/lib/types/bundle";
import { demoBundles } from "@/lib/mock/demoData";

interface BundleStore {
  bundles: Bundle[];
  addBundle: (bundle: Bundle) => void;
  updateBundle: (id: string, updates: Partial<Bundle>) => void;
  invest: (bundleId: string, tranche: "senior" | "junior", amount: number) => void;
  approveBundle: (id: string, reviewer: string) => void;
  declineBundle: (id: string, reason: string, reviewer: string) => void;
  setBundles: (bundles: Bundle[]) => void;
}

export const useBundleStore = create<BundleStore>()(
  persist(
    (set) => ({
      bundles: demoBundles,

      addBundle: (bundle) =>
        set((state) => ({ bundles: [...state.bundles, bundle] })),

      updateBundle: (id, updates) =>
        set((state) => ({
          bundles: state.bundles.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      invest: (bundleId, tranche, amount) =>
        set((state) => ({
          bundles: state.bundles.map((b) => {
            if (b.id !== bundleId) return b;
            if (tranche === "senior")
              return { ...b, seniorRaised: b.seniorRaised + amount };
            return { ...b, juniorRaised: b.juniorRaised + amount };
          }),
        })),

      approveBundle: (id, reviewer) =>
        set((state) => ({
          bundles: state.bundles.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: "live" as const,
                  approvedAt: new Date().toISOString(),
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: reviewer,
                  declineReason: undefined,
                }
              : b
          ),
        })),

      declineBundle: (id, reason, reviewer) =>
        set((state) => ({
          bundles: state.bundles.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: "declined" as const,
                  declineReason: reason,
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: reviewer,
                }
              : b
          ),
        })),

      setBundles: (bundles) => set({ bundles }),
    }),
    { name: "edufi-bundles", version: 1 }
  )
);
