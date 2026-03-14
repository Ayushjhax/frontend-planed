"use client";

import { useToastStore } from "@/lib/stores/useToastStore";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="card-surface px-4 py-3 shadow-lg border-[var(--primary)]/30"
          role="alert"
        >
          <p className="text-sm text-[var(--text-primary)]">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
