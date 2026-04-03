import { create } from "zustand";

interface WalletStore {
  connected: boolean;
  address: string;
  balance: number;
  walletName: string;
  setWalletState: (wallet: {
    connected: boolean;
    address?: string;
    walletName?: string;
  }) => void;
  resetWallet: () => void;
  setBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletStore>()((set) => ({
  connected: false,
  address: "",
  balance: 0,
  walletName: "",
  setWalletState: ({ connected, address, walletName }) =>
    set({
      connected,
      address: connected ? address ?? "" : "",
      walletName: connected ? walletName ?? "" : "",
    }),
  resetWallet: () =>
    set({
      connected: false,
      address: "",
      balance: 0,
      walletName: "",
    }),
  setBalance: (balance) => set({ balance }),
}));
