"use client";

import type { BundleStatus } from "@/lib/types/bundle";

const statusConfig: Record<
  BundleStatus,
  { label: string; dotColor: string; variant: "default" | "success" | "warning" | "error" | "muted" }
> = {
  live: { label: "Live", dotColor: "var(--success)", variant: "success" },
  ended: { label: "Ended", dotColor: "var(--text-muted)", variant: "muted" },
  draft: { label: "Draft", dotColor: "var(--warning)", variant: "warning" },
  under_review: { label: "Under Review", dotColor: "var(--primary)", variant: "default" },
  declined: { label: "Declined", dotColor: "var(--error)", variant: "error" },
};

export function BundleStatusBadge({ status }: { status: BundleStatus }) {
  const config = statusConfig[status];
  if (!config) return null;
  return (
    <span className="badge-pill inline-flex items-center gap-1.5 bg-[var(--surface-2)] text-[var(--text-primary)]">
      <span
        className="badge-dot shrink-0"
        style={{ backgroundColor: config.dotColor }}
      />
      {config.label}
    </span>
  );
}
