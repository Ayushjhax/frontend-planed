import { create } from "zustand";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: number) => void;
}

let id = 0;
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const currentId = ++id;
    set((s) => ({ toasts: [...s.toasts, { id: currentId, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== currentId) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
