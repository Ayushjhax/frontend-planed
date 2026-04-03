"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePortfolioStore } from "@/lib/stores/usePortfolioStore";
import { formatTxUrl } from "@/lib/solana/program";
import type { TransactionType } from "@/lib/types/bundle";
import { Clock } from "lucide-react";

const typeColors: Record<TransactionType, string> = {
  investment: "bg-[var(--primary)]/15 text-[var(--primary)]",
  redemption: "bg-[var(--senior-tranche)]/15 text-[var(--senior-tranche)]",
  yield: "bg-[var(--junior-tranche)]/15 text-[var(--junior-tranche)]",
  other: "bg-[var(--text-muted)]/15 text-[var(--text-muted)]",
};

const filters: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "investment", label: "Investments" },
  { value: "redemption", label: "Redemptions" },
  { value: "yield", label: "Yield" },
];

function truncateHash(hash: string) {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export default function TransactionHistoryPage() {
  const [filter, setFilter] = useState("all");
  const transactions = usePortfolioStore((s) => s.transactions);

  const list =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
          <Clock className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1
            className="text-2xl text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Transaction History
          </h1>
          <p className="text-sm text-[var(--text-muted)]">Preview portfolio activity while investor settlement wiring is still in progress</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === f.value
                ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Bundle</th>
                <th className="p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Tranche</th>
                <th className="p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Tx Hash</th>
                <th className="p-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((tx) => (
                <tr key={tx.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-2)]/50 transition-colors">
                  <td className="p-4 text-[var(--text-primary)] whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`badge-pill capitalize ${typeColors[tx.type]}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--text-primary)]">{tx.bundle}</td>
                  <td className="p-4">
                    <span className={`badge-pill capitalize ${
                      tx.tranche === "senior"
                        ? "bg-[var(--senior-tranche)]/15 text-[var(--senior-tranche)]"
                        : "bg-[var(--junior-tranche)]/15 text-[var(--junior-tranche)]"
                    }`}>
                      {tx.tranche}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[var(--text-primary)]">
                    ${tx.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <a
                      href={formatTxUrl(tx.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] hover:underline font-mono text-xs"
                    >
                      {truncateHash(tx.txHash)}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="badge-pill bg-[var(--success)]/15 text-[var(--success)]">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
