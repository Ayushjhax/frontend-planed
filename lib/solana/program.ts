export async function mockTransaction(): Promise<string> {
  await new Promise((r) => setTimeout(r, 1500));
  return `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

export function formatTxUrl(txHash: string): string {
  return `https://solscan.io/tx/${txHash}?cluster=devnet`;
}
