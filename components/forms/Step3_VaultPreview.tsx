"use client";

import { useFormContext } from "react-hook-form";

const VAULT_ADDRESS = "4xK9mR3qAb2cDe5fGh6Ij7kL8mN9oP0qR1sT2uV3wX4yZ";

export function Step3_VaultPreview() {
  const { watch } = useFormContext();
  const name = watch("name") ?? "My Bundle";
  const vaultPda = name
    ? `${VAULT_ADDRESS.slice(0, 4)}...${VAULT_ADDRESS.slice(-4)}`
    : "—";

  const copyAddress = () => {
    navigator.clipboard.writeText(VAULT_ADDRESS);
  };

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Student Loan Provider Aggregator Vault
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-mono text-[var(--text-primary)]">Wallet: {vaultPda}</span>
          <button
            type="button"
            onClick={copyAddress}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            Copy
          </button>
          <a
            href={`https://solscan.io/account/${VAULT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--primary)] hover:underline"
          >
            View on Solscan
          </a>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          This is the destination treasury vault where all pooled USDC capital will be
          deposited and managed by the Revenue Manager smart contract.
        </p>
      </div>

      <div className="card-surface p-6">
        <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
          Capital Flow Diagram
        </h4>
        <div className="overflow-x-auto py-4">
          <svg
            viewBox="0 0 520 200"
            className="w-full max-w-full h-auto"
            style={{ minHeight: 200 }}
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="var(--primary)" />
              </marker>
            </defs>
            <rect
              x="20"
              y="40"
              width="100"
              height="40"
              rx="8"
              fill="var(--surface-2)"
              stroke="var(--border)"
            />
            <text x="70" y="65" textAnchor="middle" fill="var(--text-primary)" fontSize="12">
              Investors
            </text>
            <rect
              x="210"
              y="40"
              width="100"
              height="40"
              rx="8"
              fill="var(--surface-2)"
              stroke="var(--border)"
            />
            <text x="260" y="65" textAnchor="middle" fill="var(--text-primary)" fontSize="12">
              Treasury Vault
            </text>
            <rect
              x="400"
              y="40"
              width="100"
              height="40"
              rx="8"
              fill="var(--surface-2)"
              stroke="var(--border)"
            />
            <text x="450" y="65" textAnchor="middle" fill="var(--text-primary)" fontSize="12">
              Revenue Manager
            </text>
            <line
              x1="120"
              y1="60"
              x2="210"
              y2="60"
              stroke="var(--primary)"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <line
              x1="310"
              y1="60"
              x2="400"
              y2="60"
              stroke="var(--primary)"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <rect
              x="20"
              y="120"
              width="100"
              height="40"
              rx="8"
              fill="var(--surface-2)"
              stroke="var(--senior-tranche)"
            />
            <text x="70" y="145" textAnchor="middle" fill="var(--text-primary)" fontSize="11">
              QuillFi Receipts
            </text>
            <rect
              x="210"
              y="120"
              width="100"
              height="40"
              rx="8"
              fill="var(--surface-2)"
              stroke="var(--border)"
            />
            <text x="260" y="145" textAnchor="middle" fill="var(--text-primary)" fontSize="11">
              Credit Originators
            </text>
            <rect
              x="400"
              y="120"
              width="100"
              height="40"
              rx="8"
              fill="var(--surface-2)"
              stroke="var(--border)"
            />
            <text x="450" y="145" textAnchor="middle" fill="var(--text-primary)" fontSize="11">
              Student Borrowers
            </text>
            <line
              x1="70"
              y1="80"
              x2="70"
              y2="120"
              stroke="var(--primary)"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <line
              x1="310"
              y1="80"
              x2="310"
              y2="120"
              stroke="var(--primary)"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <line
              x1="450"
              y1="160"
              x2="260"
              y2="160"
              stroke="var(--junior-tranche)"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <text x="355" y="155" fill="var(--text-muted)" fontSize="10">
              Fiat Repayment + Interest
            </text>
            <rect
              x="110"
              y="170"
              width="80"
              height="28"
              rx="6"
              fill="var(--surface-2)"
              stroke="var(--border)"
            />
            <text x="150" y="188" textAnchor="middle" fill="var(--text-primary)" fontSize="10">
              Staking Pool
            </text>
            <text x="260" y="195" textAnchor="middle" fill="var(--text-muted)" fontSize="10">
              Yield Distributed
            </text>
          </svg>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-[var(--text-muted)]">
        <span>Mock vault balance: 0 USDC</span>
        <span>Vault PDA: derived from bundle</span>
      </div>
    </div>
  );
}
