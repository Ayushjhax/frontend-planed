"use client";

import { useWalletStore } from "@/lib/stores/useWalletStore";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

export function WalletButton() {
  const { connected, address, balance, connect, disconnect } = useWalletStore();
  const [open, setOpen] = useState(false);

  const truncated = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

  if (!connected) {
    return (
      <button
        type="button"
        onClick={connect}
        className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:brightness-110 transition-all"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-[10px] font-bold text-white">
          {address.slice(0, 2).toUpperCase()}
        </span>
        <span className="font-mono text-xs">{truncated}</span>
        <span className="text-xs text-[var(--text-muted)]">
          ${balance.toLocaleString()}
        </span>
        <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 card-surface p-1 shadow-xl">
            <div className="px-3 py-2 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">Demo Wallet</p>
              <p className="text-xs font-mono text-[var(--text-primary)] mt-0.5 truncate">
                {address}
              </p>
            </div>
            <div className="px-3 py-2 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">Balance</p>
              <p className="text-sm font-mono text-[var(--text-primary)]">
                ${balance.toLocaleString()} USDC
              </p>
            </div>
            <button
              type="button"
              onClick={() => { disconnect(); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--error)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
