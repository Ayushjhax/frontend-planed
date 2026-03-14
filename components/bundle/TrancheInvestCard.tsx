"use client";

interface TrancheInvestCardProps {
  label: string;
  raised: number;
  target: number;
  apy: number;
  color: string;
}

export function TrancheInvestCard({
  label,
  raised,
  target,
  apy,
  color,
}: TrancheInvestCardProps) {
  const pct = target > 0 ? (raised / target) * 100 : 0;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-sm font-mono text-[var(--text-primary)]">
        {raised.toLocaleString()} / {target.toLocaleString()} USDC
      </p>
      <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-1">APY {apy}%</p>
    </div>
  );
}
