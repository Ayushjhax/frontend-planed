# EduFi Frontend

Web3 student loan funding platform UI — a hackathon demo for tranched student loan pools. Investors deploy stablecoin capital into senior/junior tranches; aggregators create and manage bundles.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** for styling
- **Zustand** for global state (bundles, wallet, toasts) with localStorage persistence
- **Framer Motion** for animations
- **Recharts** for charts (allocation, portfolio, repayments)
- **React Hook Form** for multi-step bundle creation
- **next-themes** + **lucide-react** for dark theme and icons

Wallet connection is **demo-only**: a mock wallet (no Phantom/Solflare required) with a fixed address and balance. No env vars or RPC needed.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/bundle-pool`.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout (sidebar, top nav, providers)
│   ├── page.tsx                # Redirects to /bundle-pool
│   ├── bundle-pool/            # Main pool list + allocation chart
│   ├── asset-dashboard/        # Portfolio, charts, positions table
│   ├── transaction-history/   # Tx list with filters
│   ├── my-bundle/             # Aggregator bundles + tabs
│   ├── my-bundle/create/      # 4-step bundle creation form
│   └── admin/review/          # Admin approve/decline submissions
├── components/
│   ├── layout/                # Sidebar, TopNav, WalletButton
│   ├── bundle/                # BundleCard, TrancheInvestCard, InvestModal, etc.
│   ├── charts/                # TrancheAllocationChart, RepaymentTimeline, etc.
│   ├── forms/                 # Step1–Step4 for create flow
│   ├── providers/             # ThemeProvider, WalletProvider (passthrough)
│   └── ui/                    # Button, Card, Dialog, Input, Toast, etc.
├── lib/
│   ├── types/bundle.ts        # Bundle, Position, Transaction types
│   ├── mock/demoData.ts       # Demo bundles, transactions, positions
│   ├── stores/                # useBundleStore, useWalletStore, useToastStore
│   └── solana/                # Mock tx helper, formatTxUrl (no real RPC)
└── hooks/
    ├── useBundles.ts          # Bundle list, stats, filter by status
    └── useInvestment.ts       # Mock invest + balance
```

## Main Flows

1. **Bundle Pool** — View live/ended/draft bundles, filter, invest (mock) in senior/junior tranches.
2. **Asset Dashboard** — Portfolio value over time, repayment schedule, “My Positions” table.
3. **Transaction History** — Filter by type; tx hashes link to Solscan (devnet).
4. **My Bundle** — Create bundle (4 steps), optional PDF; submit for review. Edit drafts.
5. **Admin** — Pending/Approved/Declined tabs; approve or decline with reason.

## Design

- Dark theme (background `#0A0B0D`, surface, borders).
- Typography: DM Serif Display (headings), IBM Plex Mono (body), JetBrains Mono (data).
- Senior tranche: emerald; junior tranche: amber.
- Cards: 12px radius, 1px border, subtle gradient.

No environment variables are required; the app runs as a full demo with mock data and mock wallet.
