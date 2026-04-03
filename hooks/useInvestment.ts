"use client";

import { useWalletStore } from "@/lib/stores/useWalletStore";

export function useInvestment() {
  const balance = useWalletStore((s) => s.balance);

  const executeInvestment = async (
    bundleId: string,
    tranche: "senior" | "junior",
    amount: number
  ): Promise<string> => {
    void bundleId;
    void tranche;
    void amount;

    throw new Error(
      "Investor subscription flows are not enabled on-chain yet. Bundle origination and admin review are live."
    );
  };

  return { executeInvestment, balance };
}
