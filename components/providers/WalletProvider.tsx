"use client";

import { useEffect, useMemo } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { RPC_URL } from "@/lib/solana/connection";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { useBundleStore } from "@/lib/stores/useBundleStore";

function WalletStateBridge() {
  const { connection } = useConnection();
  const { connected, publicKey, wallet } = useWallet();
  const setWalletState = useWalletStore((s) => s.setWalletState);
  const resetWallet = useWalletStore((s) => s.resetWallet);
  const setBalance = useWalletStore((s) => s.setBalance);

  useEffect(() => {
    if (!connected || !publicKey) {
      resetWallet();
      return;
    }

    setWalletState({
      connected: true,
      address: publicKey.toBase58(),
      walletName: wallet?.adapter.name ?? "",
    });
  }, [connected, publicKey, resetWallet, setWalletState, wallet?.adapter.name]);

  useEffect(() => {
    if (!publicKey) {
      setBalance(0);
      return;
    }

    let cancelled = false;

    void connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (!cancelled) {
          setBalance(lamports / LAMPORTS_PER_SOL);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBalance(0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [connection, publicKey, setBalance]);

  return null;
}

function BundleSyncBridge() {
  const { connection } = useConnection();
  const refreshBundles = useBundleStore((s) => s.refreshBundles);

  useEffect(() => {
    void refreshBundles(connection);

    const intervalId = window.setInterval(() => {
      void refreshBundles(connection);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [connection, refreshBundles]);

  return null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletStateBridge />
          <BundleSyncBridge />
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
