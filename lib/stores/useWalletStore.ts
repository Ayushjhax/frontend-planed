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

type PersistedWalletStore = Partial<
  Pick<WalletStore, "connected" | "address" | "balance">
>;

const walletDefaults: Pick<WalletStore, "connected" | "address" | "balance"> = {
  connected: true,
  address: DEMO_ADDRESS,
  balance: 15000,
};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      connected: walletDefaults.connected,
      address: walletDefaults.address,
      balance: walletDefaults.balance,
      connect: () => set({ connected: true, address: DEMO_ADDRESS }),
      disconnect: () => set({ connected: false }),
      setBalance: (balance) => set({ balance }),
    }),
    {
      name: "edufi-wallet",
      version: 2,
      migrate: (persistedState, version): PersistedWalletStore => {
        const persistedWallet = (persistedState ?? {}) as PersistedWalletStore;

        if (version < 2) {
          return {
            ...walletDefaults,
            ...persistedWallet,
            address: persistedWallet.address || DEMO_ADDRESS,
            balance:
              typeof persistedWallet.balance === "number"
                ? persistedWallet.balance
                : walletDefaults.balance,
            connected:
              typeof persistedWallet.connected === "boolean"
                ? persistedWallet.connected
                : walletDefaults.connected,
          };
        }

        return {
          ...walletDefaults,
          ...persistedWallet,
        };
      },
    }
  )
);
