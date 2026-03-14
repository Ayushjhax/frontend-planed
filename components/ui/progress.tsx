"use client";

export function Progress({
  value,
  className = "",
  barClassName = "",
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)] ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
