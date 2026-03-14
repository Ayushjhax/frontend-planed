"use client";

export function BundleFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "all", label: "All" },
    { value: "live", label: "Live" },
    { value: "ended", label: "Ended" },
    { value: "draft", label: "Draft" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
            value === opt.value
              ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
              : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
