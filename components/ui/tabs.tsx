"use client";

export function Tabs({
  value,
  onValueChange,
  children,
  className = "",
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function TabsList({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-0.5 ${className}`}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  active,
  onClick,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--surface)] text-[var(--text-primary)] shadow"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      } ${className}`}
      {...props}
    />
  );
}
