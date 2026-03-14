export type BundleStatus =
  | "draft"
  | "under_review"
  | "live"
  | "ended"
  | "declined";

export type RepaymentFrequency = "Monthly" | "Quarterly" | "Bi-Annual";

export interface Bundle {
  id: string;
  name: string;
  oneliner: string;
  description: string;
  contractPdfName?: string;
  status: BundleStatus;
  totalGoal: number;
  seniorTarget: number;
  seniorRaised: number;
  juniorTarget: number;
  juniorRaised: number;
  seniorAPY: number;
  juniorAPY: number;
  subordinationRate: number;
  seniorFixedRate: number;
  juniorFixedRate: number;
  startDate: string;
  endDate: string;
  repaymentFrequency: RepaymentFrequency;
  totalRepaymentCycles: number;
  estimatedFirstRepayment: string;
  redemptionRate: number;
  vaultAddress: string;
  submittedAt?: string;
  approvedAt?: string;
  declineReason?: string;
  createdBy: string;
  daysRemaining?: number;
}

export interface Position {
  bundleId: string;
  bundleName: string;
  tranche: "senior" | "junior";
  invested: number;
  tokens: number;
  status: "Staked" | "Redeemed";
  expectedReturn: number;
}

export type TransactionType = "investment" | "redemption" | "yield" | "other";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  bundle: string;
  tranche: "senior" | "junior";
  amount: number;
  txHash: string;
  status: "confirmed" | "pending" | "failed";
}
