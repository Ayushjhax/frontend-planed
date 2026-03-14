"use client";

export function Label({
  className = "",
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`text-sm font-medium text-[var(--text-muted)] ${className}`}
      {...props}
    />
  );
}
