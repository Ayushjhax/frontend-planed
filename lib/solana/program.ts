import { AnchorProvider, BN, Program, type Idl } from "@coral-xyz/anchor";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import pencilSolanaIdl from "@/lib/solana/idl/pencil_solana.json";
import { SOLANA_COMMITMENT, SOLSCAN_CLUSTER } from "@/lib/solana/connection";
import type { RepaymentFrequency, Bundle, BundleStatus } from "@/lib/types/bundle";
import type { CreateBundleFormValues } from "@/lib/types/createBundleForm";

const PENCIL_IDL = pencilSolanaIdl as Idl & { address: string };
const PROGRAM_ID = new PublicKey(PENCIL_IDL.address);
const DECIMAL_MULTIPLIER = 1_000_000;
const ONE_DAY_SECONDS = 86_400;
export const BUNDLE_CREATION_FEE_SOL = 0.1;
export const BUNDLE_CREATION_FEE_LAMPORTS = Math.round(
  BUNDLE_CREATION_FEE_SOL * LAMPORTS_PER_SOL
);
export const BUNDLE_CREATION_FEE_RECIPIENT = new PublicKey(
  "JCsFjtj6tem9Dv83Ks4HxsL7p8GhdLtokveqW7uWjGyi"
);
export const BUNDLE_APPROVAL_FEE_SOL = 0.01;
export const BUNDLE_APPROVAL_FEE_LAMPORTS = Math.round(
  BUNDLE_APPROVAL_FEE_SOL * LAMPORTS_PER_SOL
);
export const BUNDLE_APPROVAL_FEE_RECIPIENT = new PublicKey(
  "BkxuGUMYfZe3CEQfLcEG4towJFsXGzXhouM7F8EjSVC2"
);

export const DEVNET_USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

type AssetPoolAccount = {
  name: string;
  status: number;
  assetAddress: PublicKey;
  minJuniorRatio: number;
  repaymentRate: number;
  seniorFixedRate: number;
  repaymentPeriod: BN | number;
  repaymentCount: BN | number;
  totalAmount: BN | number;
  minAmount: BN | number;
  fundingStartTime: BN | number;
  fundingEndTime: BN | number;
  seniorAmount: BN | number;
  juniorAmount: BN | number;
  creator: PublicKey;
  createdAt: BN | number;
};

type SystemConfigAccount = {
  superAdmin: PublicKey;
  treasury: PublicKey;
  platformFeeRate: number;
  seniorEarlyBeforeExitFeeRate: number;
  seniorEarlyAfterExitFeeRate: number;
  juniorEarlyBeforeExitFeeRate: number;
  defaultMinJuniorRatio: number;
};

export type SystemConfigSnapshot = {
  address: string;
  superAdmin: string;
  treasury: string;
  platformFeeRate: number;
  seniorEarlyBeforeExitFeeRate: number;
  seniorEarlyAfterExitFeeRate: number;
  juniorEarlyBeforeExitFeeRate: number;
  defaultMinJuniorRatio: number;
};

function createReadonlyWallet(): AnchorWallet {
  const publicKey = new PublicKey("11111111111111111111111111111111");

  return {
    publicKey,
    signTransaction: async <T extends Transaction | VersionedTransaction>(
      transaction: T
    ) => transaction,
    signAllTransactions: async <T extends Transaction | VersionedTransaction>(
      transactions: T[]
    ) => transactions,
  };
}

function getProvider(connection: Connection, wallet?: AnchorWallet) {
  const options = AnchorProvider.defaultOptions();
  options.commitment = SOLANA_COMMITMENT;
  options.preflightCommitment = SOLANA_COMMITMENT;

  return new AnchorProvider(connection, wallet ?? createReadonlyWallet(), options);
}

function getProgram(connection: Connection, wallet?: AnchorWallet) {
  return new Program(PENCIL_IDL, getProvider(connection, wallet));
}

function toNumber(value: BN | number): number {
  if (typeof value === "number") return value;
  return value.toNumber();
}

function fromBaseUnits(value: BN | number) {
  return toNumber(value) / DECIMAL_MULTIPLIER;
}

function toBaseUnits(value: number) {
  return new BN(Math.round(value)).mul(new BN(DECIMAL_MULTIPLIER));
}

function fromBasisPoints(value: number) {
  return value / 100;
}

function toBasisPoints(value: number) {
  return Math.round(value * 100);
}

function toDateInput(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().split("T")[0];
}

function toUnixSeconds(date: string) {
  return Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000);
}

function repaymentFrequencyToDays(frequency: RepaymentFrequency) {
  switch (frequency) {
    case "Quarterly":
      return 90;
    case "Bi-Annual":
      return 180;
    case "Monthly":
    default:
      return 30;
  }
}

function daysToRepaymentFrequency(days: number): RepaymentFrequency {
  if (days >= 150) return "Bi-Annual";
  if (days >= 75) return "Quarterly";
  return "Monthly";
}

function mapStatus(status: number): BundleStatus {
  switch (status) {
    case 0:
      return "under_review";
    case 1:
    case 2:
    case 3:
    case 4:
      return "live";
    case 5:
      return "ended";
    case 6:
      return "declined";
    default:
      return "under_review";
  }
}

function deriveTrancheTargets(totalGoal: number, juniorRatioBasisPoints: number) {
  const juniorTarget = Math.round((totalGoal * juniorRatioBasisPoints) / 10_000);
  const seniorTarget = Math.max(totalGoal - juniorTarget, 0);

  return { seniorTarget, juniorTarget };
}

function buildOneliner(
  juniorRatioPercent: number,
  repaymentFrequency: RepaymentFrequency
) {
  return `On-chain student loan pool with ${juniorRatioPercent.toFixed(0)}% junior support and ${repaymentFrequency.toLowerCase()} repayments.`;
}

function buildDescription(
  name: string,
  juniorRatioPercent: number,
  repaymentCycles: number
) {
  return `${name} is a QuillFi asset pool originated on Solana with a ${juniorRatioPercent.toFixed(
    0
  )}% junior tranche requirement across ${repaymentCycles} scheduled repayment cycles.`;
}

function mapAssetPoolAccount(args: {
  publicKey: PublicKey;
  account: AssetPoolAccount;
}): Bundle {
  const { publicKey, account } = args;
  const totalGoal = fromBaseUnits(account.totalAmount);
  const juniorRatioPercent = fromBasisPoints(account.minJuniorRatio);
  const { seniorTarget, juniorTarget } = deriveTrancheTargets(
    totalGoal,
    account.minJuniorRatio
  );
  const fundingStartTime = toNumber(account.fundingStartTime);
  const fundingEndTime = toNumber(account.fundingEndTime);
  const repaymentPeriod = toNumber(account.repaymentPeriod);
  const repaymentFrequency = daysToRepaymentFrequency(repaymentPeriod);
  const estimatedFirstRepayment = toDateInput(
    fundingEndTime + repaymentPeriod * ONE_DAY_SECONDS
  );

  return {
    id: publicKey.toBase58(),
    name: account.name,
    oneliner: buildOneliner(juniorRatioPercent, repaymentFrequency),
    description: buildDescription(
      account.name,
      juniorRatioPercent,
      toNumber(account.repaymentCount)
    ),
    status: mapStatus(account.status),
    totalGoal,
    seniorTarget,
    seniorRaised: fromBaseUnits(account.seniorAmount),
    juniorTarget,
    juniorRaised: fromBaseUnits(account.juniorAmount),
    seniorAPY: fromBasisPoints(account.seniorFixedRate),
    juniorAPY: fromBasisPoints(account.repaymentRate),
    subordinationRate: juniorRatioPercent,
    seniorFixedRate: fromBasisPoints(account.seniorFixedRate),
    juniorFixedRate: fromBasisPoints(account.repaymentRate),
    startDate: toDateInput(fundingStartTime),
    endDate: toDateInput(fundingEndTime),
    repaymentFrequency,
    totalRepaymentCycles: toNumber(account.repaymentCount),
    estimatedFirstRepayment,
    redemptionRate: 100,
    vaultAddress: publicKey.toBase58(),
    submittedAt: new Date(toNumber(account.createdAt) * 1000).toISOString(),
    createdBy: account.creator.toBase58(),
    daysRemaining: Math.max(
      Math.ceil((fundingEndTime * 1000 - Date.now()) / (ONE_DAY_SECONDS * 1000)),
      0
    ),
  };
}

export function findSystemConfigPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("system_config")],
    PROGRAM_ID
  );
}

export function findAssetPoolPda(creator: PublicKey, name: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("asset_pool"), creator.toBuffer(), Buffer.from(name)],
    PROGRAM_ID
  );
}

export async function fetchSystemConfig(
  connection: Connection
): Promise<SystemConfigSnapshot | null> {
  const program = getProgram(connection);
  const programAccounts = program.account as Record<string, { fetchNullable: (address: PublicKey) => Promise<unknown> }>;
  const [systemConfigPda] = findSystemConfigPda();
  const account = (await programAccounts.systemConfig.fetchNullable(
    systemConfigPda
  )) as SystemConfigAccount | null;

  if (!account) {
    return null;
  }

  return {
    address: systemConfigPda.toBase58(),
    superAdmin: account.superAdmin.toBase58(),
    treasury: account.treasury.toBase58(),
    platformFeeRate: account.platformFeeRate,
    seniorEarlyBeforeExitFeeRate: account.seniorEarlyBeforeExitFeeRate,
    seniorEarlyAfterExitFeeRate: account.seniorEarlyAfterExitFeeRate,
    juniorEarlyBeforeExitFeeRate: account.juniorEarlyBeforeExitFeeRate,
    defaultMinJuniorRatio: account.defaultMinJuniorRatio,
  };
}

export async function fetchAssetPools(connection: Connection): Promise<Bundle[]> {
  const program = getProgram(connection);
  const programAccounts = program.account as Record<string, { all: () => Promise<unknown> }>;
  const assetPools = (await programAccounts.assetPool.all()) as Array<{
    publicKey: PublicKey;
    account: AssetPoolAccount;
  }>;

  return assetPools
    .map(mapAssetPoolAccount)
    .sort((left, right) =>
      (right.submittedAt ?? "").localeCompare(left.submittedAt ?? "")
    );
}

export async function createAssetPoolOnChain(args: {
  connection: Connection;
  wallet: AnchorWallet;
  values: CreateBundleFormValues;
}) {
  const { connection, wallet, values } = args;
  const program = getProgram(connection, wallet);
  const systemConfig = await fetchSystemConfig(connection);

  if (!systemConfig) {
    throw new Error(
      "System config is not initialized on devnet yet. Initialize the protocol before submitting bundles."
    );
  }

  const totalGoal = Number(values.totalGoal);
  const seniorTarget = Number(values.seniorTarget);
  const juniorTarget = Number(values.juniorTarget);
  const repaymentCycles = Number(values.totalRepaymentCycles);
  const fundingStartTime = toUnixSeconds(values.startDate);
  const fundingEndTime = toUnixSeconds(values.endDate);

  if (!wallet.publicKey) {
    throw new Error("Connect a wallet before creating a bundle.");
  }

  if (!Number.isInteger(totalGoal) || totalGoal < 10_000) {
    throw new Error("The fundraising goal must be a whole number and at least 10,000 USDC.");
  }

  if (!Number.isInteger(seniorTarget) || !Number.isInteger(juniorTarget)) {
    throw new Error("Senior and junior tranche targets must be whole numbers.");
  }

  if (seniorTarget + juniorTarget !== totalGoal) {
    throw new Error("Senior and junior tranche targets must add up to the total fundraising goal.");
  }

  if (!Number.isInteger(repaymentCycles) || repaymentCycles <= 0) {
    throw new Error("Repayment cycles must be a positive whole number.");
  }

  if (!values.name.trim()) {
    throw new Error("Bundle name is required.");
  }

  const provider = getProvider(connection, wallet);
  const bundleName = values.name.trim();
  const juniorApy = Number(values.juniorAPY);
  const seniorFixedRate = Number(values.seniorFixedRate);
  const subordinationRate = Number(values.subordinationRate);
  const fundingDurationSeconds = fundingEndTime - fundingStartTime;

  if (!(juniorApy > 0)) {
    throw new Error("Expected junior APY must be greater than 0%.");
  }

  if (!(seniorFixedRate > 0)) {
    throw new Error("Senior fixed rate must be greater than 0%.");
  }

  if (subordinationRate < 5 || subordinationRate > 50) {
    throw new Error("Subordination rate must stay between 5% and 50%.");
  }

  if (fundingDurationSeconds < ONE_DAY_SECONDS) {
    throw new Error("The fundraising window must be at least 1 full day.");
  }

  if (fundingDurationSeconds > ONE_DAY_SECONDS * 365) {
    throw new Error("The fundraising window cannot be longer than 365 days.");
  }

  const createAssetPoolIx = await program.methods
    .createAssetPool(
      bundleName,
      systemConfig.platformFeeRate,
      systemConfig.seniorEarlyBeforeExitFeeRate,
      systemConfig.seniorEarlyAfterExitFeeRate,
      systemConfig.juniorEarlyBeforeExitFeeRate,
      toBasisPoints(subordinationRate),
      toBasisPoints(juniorApy),
      toBasisPoints(seniorFixedRate),
      new BN(repaymentFrequencyToDays(values.repaymentFrequency)),
      new BN(repaymentCycles),
      toBaseUnits(totalGoal),
      toBaseUnits(totalGoal),
      new BN(fundingStartTime),
      new BN(fundingEndTime)
    )
    .accounts({
      assetAddress: DEVNET_USDC_MINT,
    })
    .instruction();

  const creationFeeIx = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: BUNDLE_CREATION_FEE_RECIPIENT,
    lamports: BUNDLE_CREATION_FEE_LAMPORTS,
  });

  const transaction = new Transaction().add(creationFeeIx, createAssetPoolIx);
  const signature = await provider.sendAndConfirm(transaction, []);

  const [assetPoolPda] = findAssetPoolPda(wallet.publicKey, bundleName);

  return {
    signature,
    assetPoolAddress: assetPoolPda.toBase58(),
  };
}

export async function approveAssetPoolOnChain(args: {
  connection: Connection;
  wallet: AnchorWallet;
  creator: string;
  name: string;
}) {
  const { connection, wallet, creator, name } = args;
  const program = getProgram(connection, wallet);
  const provider = getProvider(connection, wallet);

  const approveAssetPoolIx = await program.methods
    .approveAssetPool(new PublicKey(creator), name)
    .instruction();

  const approvalFeeIx = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: BUNDLE_APPROVAL_FEE_RECIPIENT,
    lamports: BUNDLE_APPROVAL_FEE_LAMPORTS,
  });

  const transaction = new Transaction().add(approvalFeeIx, approveAssetPoolIx);

  return provider.sendAndConfirm(transaction, []);
}

export async function declineAssetPoolOnChain(args: {
  connection: Connection;
  wallet: AnchorWallet;
  creator: string;
  name: string;
}) {
  const { connection, wallet, creator, name } = args;
  const program = getProgram(connection, wallet);

  return program.methods
    .declineAssetPool(new PublicKey(creator), name)
    .rpc();
}

export function formatTxUrl(txHash: string): string {
  return `https://solscan.io/tx/${txHash}?cluster=${SOLSCAN_CLUSTER}`;
}
