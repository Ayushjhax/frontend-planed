"use client";

import { useState } from "react";
import { useWalletStore } from "@/lib/stores/useWalletStore";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Bundle } from "@/lib/types/bundle";

const mockTransaction = (): Promise<string> =>
  new Promise((r) =>
    setTimeout(() => r(`${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`), 1500)
  );

interface InvestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundle: Bundle | null;
  tranche: "senior" | "junior" | null;
  onSuccess: (txHash: string, amount: number) => void;
  onToast: (msg: string) => void;
}

export function InvestModal({
  open,
  onOpenChange,
  bundle,
  tranche,
  onSuccess,
  onToast,
}: InvestModalProps) {
  const { connected } = useWalletStore();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!bundle || !tranche) return;
    const num = Number(amount);
    if (Number.isNaN(num) || num <= 0) return;
    setLoading(true);
    try {
      const txHash = await mockTransaction();
      onSuccess(txHash, num);
      onToast("Investor subscription flows are being connected next.");
      onOpenChange(false);
      setAmount("");
    } finally {
      setLoading(false);
    }
  };

  if (!bundle || !tranche) return null;

  const label = tranche === "senior" ? "Senior" : "Junior";
  const num = Number(amount);
  const tokensDisplay = Number.isNaN(num) || num <= 0 ? "0" : num.toLocaleString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Invest in {bundle.name} — {label} Tranche</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <Label>USDC amount</Label>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Your QuillFi receipt tokens to receive: <strong className="text-[var(--text-primary)]">{tokensDisplay}</strong>
          </p>
          {!connected && (
            <p className="text-sm text-[var(--text-muted)]">Connect your wallet to invest.</p>
          )}
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !amount || num <= 0}
        >
          {loading ? "Checking..." : "Join Waitlist"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
