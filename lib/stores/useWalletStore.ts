import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEMO_ADDRESS = "7xYz4Kp9mR3qAb2cDe5fGh6Ij7kL8mN9oP0qR1sT2uV";

interface WalletStore {
  connected: boolean;
  address: string;
  balance: number;
  connect: () => void;
  disconnect: () => void;
  setBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      connected: true,
      address: DEMO_ADDRESS,
      balance: 15000,
      connect: () => set({ connected: true, address: DEMO_ADDRESS }),
      disconnect: () => set({ connected: false }),
      setBalance: (balance) => set({ balance }),
    }),
    { name: "edufi-wallet", version: 2 }
  )
);
