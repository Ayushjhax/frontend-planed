"use client";

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "muted";
  className?: string;
}) {
  const variants = {
    default: "bg-[var(--surface-2)] text-[var(--text-primary)]",
    success: "bg-[var(--senior-tranche)]/20 text-[var(--senior-tranche)]",
    warning: "bg-[var(--junior-tranche)]/20 text-[var(--junior-tranche)]",
    error: "bg-[var(--error)]/20 text-[var(--error)]",
    muted: "bg-[var(--border)]/50 text-[var(--text-muted)]",
  };
  return (
    <span
      className={`badge-pill inline-flex ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
