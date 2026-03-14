"use client";

import { useBundleStore } from "@/lib/stores/useBundleStore";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { mockTransaction } from "@/lib/solana/program";

export function useInvestment() {
  const invest = useBundleStore((s) => s.invest);
  const balance = useWalletStore((s) => s.balance);
  const setBalance = useWalletStore((s) => s.setBalance);

  const executeInvestment = async (
    bundleId: string,
    tranche: "senior" | "junior",
    amount: number
  ): Promise<string> => {
    const hash = await mockTransaction();
    invest(bundleId, tranche, amount);
    setBalance(balance - amount);
    return hash;
  };

  return { executeInvestment, balance };
}
