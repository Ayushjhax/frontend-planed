import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Connection } from "@solana/web3.js";
import type { Bundle } from "@/lib/types/bundle";
import { fetchAssetPools } from "@/lib/solana/program";

type Tranche = "senior" | "junior";

type BundleCommitments = Record<
  string,
  {
    seniorRaised: number;
    juniorRaised: number;
  }
>;

interface BundleStore {
  bundles: Bundle[];
  loading: boolean;
  error: string | null;
  localCommitments: BundleCommitments;
  updateBundle: (id: string, updates: Partial<Bundle>) => void;
  setBundles: (bundles: Bundle[]) => void;
  refreshBundles: (connection: Connection) => Promise<void>;
  investDemo: (bundleId: string, tranche: Tranche, amount: number) => void;
  clearError: () => void;
}

function mergeBundlesWithCommitments(
  bundles: Bundle[],
  localCommitments: BundleCommitments
) {
  return bundles.map((bundle) => {
    const commitment = localCommitments[bundle.id];
    if (!commitment) return bundle;

    return {
      ...bundle,
      seniorRaised: bundle.seniorRaised + commitment.seniorRaised,
      juniorRaised: bundle.juniorRaised + commitment.juniorRaised,
    };
  });
}

export const useBundleStore = create<BundleStore>()(
  persist(
    (set) => ({
      bundles: [],
      loading: false,
      error: null,
      localCommitments: {},

      updateBundle: (id, updates) =>
        set((state) => ({
          bundles: state.bundles.map((bundle) =>
            bundle.id === id ? { ...bundle, ...updates } : bundle
          ),
        })),

      setBundles: (bundles) =>
        set((state) => ({
          bundles: mergeBundlesWithCommitments(bundles, state.localCommitments),
        })),

      refreshBundles: async (connection) => {
        set({ loading: true, error: null });

        try {
          const bundles = await fetchAssetPools(connection);
          set((state) => ({
            bundles: mergeBundlesWithCommitments(bundles, state.localCommitments),
            loading: false,
          }));
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to load on-chain bundles right now.";

          set({ loading: false, error: message });
        }
      },

      investDemo: (bundleId, tranche, amount) =>
        set((state) => {
          const existing = state.localCommitments[bundleId] ?? {
            seniorRaised: 0,
            juniorRaised: 0,
          };
          const nextCommitment = {
            seniorRaised:
              existing.seniorRaised + (tranche === "senior" ? amount : 0),
            juniorRaised:
              existing.juniorRaised + (tranche === "junior" ? amount : 0),
          };

          return {
            localCommitments: {
              ...state.localCommitments,
              [bundleId]: nextCommitment,
            },
            bundles: state.bundles.map((bundle) => {
              if (bundle.id !== bundleId) return bundle;

              return {
                ...bundle,
                seniorRaised:
                  bundle.seniorRaised + (tranche === "senior" ? amount : 0),
                juniorRaised:
                  bundle.juniorRaised + (tranche === "junior" ? amount : 0),
              };
            }),
          };
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "quillfi-bundle-commitments",
      partialize: (state) => ({
        localCommitments: state.localCommitments,
      }),
    }
  )
);
