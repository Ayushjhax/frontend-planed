import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  demoPositions,
  demoTransactions,
  monthlyRepaymentSchedule,
  portfolioHistoryMonths,
} from "@/lib/mock/demoData";
import type { Position, Transaction } from "@/lib/types/bundle";

type Tranche = "senior" | "junior";

interface PortfolioStore {
  positions: Position[];
  transactions: Transaction[];
  portfolioHistory: { month: string; value: number }[];
  repaymentSchedule: { month: string; amount: number }[];
  recordDemoInvestment: (args: {
    bundleId: string;
    bundleName: string;
    tranche: Tranche;
    amount: number;
    txHash: string;
  }) => void;
}

function estimateReturn(tranche: Tranche, amount: number) {
  const multiplier = tranche === "senior" ? 1.06 : 1.12;
  return Math.round(amount * multiplier);
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      positions: demoPositions,
      transactions: demoTransactions,
      portfolioHistory: portfolioHistoryMonths,
      repaymentSchedule: monthlyRepaymentSchedule,

      recordDemoInvestment: ({ bundleId, bundleName, tranche, amount, txHash }) =>
        set((state) => {
          const existingPosition = state.positions.find(
            (position) =>
              position.bundleId === bundleId && position.tranche === tranche
          );

          const positions = existingPosition
            ? state.positions.map((position) =>
                position.bundleId === bundleId && position.tranche === tranche
                  ? {
                      ...position,
                      invested: position.invested + amount,
                      tokens: position.tokens + amount,
                      expectedReturn: position.expectedReturn + estimateReturn(tranche, amount),
                    }
                  : position
              )
            : [
                {
                  bundleId,
                  bundleName,
                  tranche,
                  invested: amount,
                  tokens: amount,
                  status: "Staked" as const,
                  expectedReturn: estimateReturn(tranche, amount),
                },
                ...state.positions,
              ];

          const totalInvested = positions.reduce(
            (sum, position) => sum + position.invested,
            0
          );
          const totalExpected = positions.reduce(
            (sum, position) => sum + position.expectedReturn,
            0
          );
          const averageReturnRatio =
            totalInvested > 0 ? totalExpected / totalInvested : 1;

          return {
            positions,
            transactions: [
              {
                id: `tx-${Date.now()}`,
                date: new Date().toISOString(),
                type: "investment",
                bundle: bundleName,
                tranche,
                amount,
                txHash,
                status: "confirmed" as const,
              },
              ...state.transactions,
            ],
            portfolioHistory: state.portfolioHistory.map((point, index, list) =>
              index === list.length - 1
                ? {
                    ...point,
                    value: Math.round(totalInvested * averageReturnRatio),
                  }
                : point
            ),
          };
        }),
    }),
    {
      name: "quillfi-portfolio-demo",
    }
  )
);
