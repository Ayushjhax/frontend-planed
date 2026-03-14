"use client";

import { WalletButton } from "./WalletButton";

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div />
      <WalletButton />
    </header>
  );
}
