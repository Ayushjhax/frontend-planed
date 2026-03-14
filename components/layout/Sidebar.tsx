"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  BarChart2,
  Clock,
  Folder,
  Shield,
  GraduationCap,
} from "lucide-react";
import { useWalletStore } from "@/lib/stores/useWalletStore";

const navItems = [
  { href: "/bundle-pool", label: "Bundle Pool", icon: Layers },
  { href: "/asset-dashboard", label: "Asset Dashboard", icon: BarChart2 },
  { href: "/transaction-history", label: "Transaction History", icon: Clock },
  { href: "/my-bundle", label: "My Bundle", icon: Folder },
  { href: "/admin/review", label: "Admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { connected, address } = useWalletStore();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-[240px] border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
      <div className="p-5 border-b border-[var(--border)]">
        <Link href="/bundle-pool" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/15">
            <GraduationCap className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <span
            className="text-xl tracking-tight text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EduFi
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)]">
          Platform
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                active
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium border-l-[3px] border-[var(--primary)] -ml-[3px] pl-[15px]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-[var(--primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)]">
        <div className="rounded-xl bg-[var(--surface-2)] px-3 py-2.5">
          {connected ? (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="font-mono text-xs text-[var(--text-primary)] truncate">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="inline-flex items-center rounded-md bg-[var(--primary)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                  Devnet
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">Demo Mode</span>
              </div>
            </>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">Not connected</span>
          )}
        </div>
      </div>
    </aside>
  );
}
