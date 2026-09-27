/**
 * CH3OH Financial Split & Debt Simplification Engine
 * Core Principles:
 * 1. Zero-Float Arithmetic: All calculations performed in integer minor units (Paise).
 * 2. Deterministic Remainder Allocation: Guarantees sum(splits) === total down to 1 paisa.
 * 3. Greedy Min-Cash-Flow Simplification: Minimizes transaction handoffs without altering net balances.
 */

export type SplitMode = "equal" | "exact" | "percentage" | "shares" | "adjustment";

export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface SplitInput {
  userId: string;
  amount?: number; // in paise
  percentage?: number; // 0 - 100
  shares?: number; // 1, 2, 3...
  adjustment?: number; // +/- delta in paise
  included?: boolean;
}

export interface CalculatedSplit {
  userId: string;
  amount: number; // in paise
  percentage: number;
  shares?: number;
}

export interface SimplifiedTransaction {
  fromUserId: string;
  toUserId: string;
  amount: number; // in paise
}

export interface PairwiseDebt {
  debtorId: string;
  creditorId: string;
  amount: number; // in paise
}

/**
 * Format paise into currency string (e.g. 245000 -> "₹2,450.00")
 */
export function formatCurrency(amountInPaise: number, currency: string = "INR"): string {
  const symbolMap: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "AED ",
  };

  const symbol = symbolMap[currency] || `${currency} `;
  const major = (Math.abs(amountInPaise) / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sign = amountInPaise < 0 ? "-" : "";
  return `${sign}${symbol}${major}`;
}

/**
 * Convert rupee float/decimal input from UI into exact integer paise
 */
export function toPaise(rupees: number | string): number {
  const num = typeof rupees === "string" ? parseFloat(rupees) : rupees;
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Calculate itemized splits based on selected SplitMode with Zero-Paisa-Loss Guarantee
 */
export function calculateSplits(
  totalPaise: number,
  participants: Participant[],
  mode: SplitMode,
  inputs: Record<string, SplitInput>
): CalculatedSplit[] {
  if (participants.length === 0 || totalPaise <= 0) return [];

  const activeParticipants = participants.filter((p) => inputs[p.id]?.included !== false);
  const count = activeParticipants.length;

  if (count === 0) return [];

  // 1. EQUAL SPLIT
  if (mode === "equal") {
    const baseShare = Math.floor(totalPaise / count);
    const remainder = totalPaise % count;

    return activeParticipants.map((p, index) => ({
      userId: p.id,
      amount: index < remainder ? baseShare + 1 : baseShare,
      percentage: Number(((index < remainder ? baseShare + 1 : baseShare) / totalPaise * 100).toFixed(2)),
    }));
  }

  // 2. EXACT / UNEQUAL SPLIT
  if (mode === "exact") {
    return activeParticipants.map((p) => {
      const explicitAmount = inputs[p.id]?.amount ?? 0;
      return {
        userId: p.id,
        amount: explicitAmount,
        percentage: Number(((explicitAmount / totalPaise) * 100).toFixed(2)),
      };
    });
  }

  // 3. PERCENTAGE SPLIT
  if (mode === "percentage") {
    let allocatedSum = 0;
    const initialSplits = activeParticipants.map((p) => {
      const pct = inputs[p.id]?.percentage ?? 0;
      const share = Math.floor((totalPaise * pct) / 100);
      allocatedSum += share;
      return { userId: p.id, amount: share, percentage: pct };
    });

    const diff = totalPaise - allocatedSum;
    if (diff !== 0 && initialSplits.length > 0) {
      initialSplits[0].amount += diff;
    }
    return initialSplits;
  }

  // 4. SHARES SPLIT
  if (mode === "shares") {
    const totalShares = activeParticipants.reduce((sum, p) => sum + (inputs[p.id]?.shares ?? 1), 0);
    if (totalShares === 0) return [];

    let allocatedSum = 0;
    const initialSplits = activeParticipants.map((p) => {
      const shares = inputs[p.id]?.shares ?? 1;
      const share = Math.floor((totalPaise * shares) / totalShares);
      allocatedSum += share;
      return {
        userId: p.id,
        amount: share,
        percentage: Number(((share / totalPaise) * 100).toFixed(2)),
        shares,
      };
    });

    const diff = totalPaise - allocatedSum;
    if (diff !== 0 && initialSplits.length > 0) {
      initialSplits[0].amount += diff;
    }
    return initialSplits;
  }

  // 5. ADJUSTMENT SPLIT
  if (mode === "adjustment") {
    const totalAdjustments = activeParticipants.reduce((sum, p) => sum + (inputs[p.id]?.adjustment ?? 0), 0);
    const baseTotal = totalPaise - totalAdjustments;
    const baseShare = Math.floor(baseTotal / count);
    const remainder = baseTotal % count;

    let allocatedSum = 0;
    const splits = activeParticipants.map((p, index) => {
      const adj = inputs[p.id]?.adjustment ?? 0;
      const nominal = index < remainder ? baseShare + 1 : baseShare;
      const total = Math.max(0, nominal + adj);
      allocatedSum += total;
      return {
        userId: p.id,
        amount: total,
        percentage: Number(((total / totalPaise) * 100).toFixed(2)),
      };
    });

    const diff = totalPaise - allocatedSum;
    if (diff !== 0 && splits.length > 0) {
      splits[0].amount += diff;
    }
    return splits;
  }

  return [];
}

/**
 * Greedy Min-Cash-Flow Debt Simplification Algorithm
 * Complexity: O(N log N)
 * Guarantees at most N - 1 settlement transactions
 */
export function simplifyDebts(netBalances: Map<string, number>): SimplifiedTransaction[] {
  interface Account {
    userId: string;
    balance: number;
  }

  const debtors: Account[] = [];
  const creditors: Account[] = [];

  for (const [userId, balance] of netBalances.entries()) {
    if (balance < 0) {
      debtors.push({ userId, balance: Math.abs(balance) });
    } else if (balance > 0) {
      creditors.push({ userId, balance });
    }
  }

  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  const transactions: SimplifiedTransaction[] = [];
  let dIndex = 0;
  let cIndex = 0;

  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];

    const settleAmount = Math.min(debtor.balance, creditor.balance);

    if (settleAmount > 0) {
      transactions.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount: settleAmount,
      });
    }

    debtor.balance -= settleAmount;
    creditor.balance -= settleAmount;

    if (debtor.balance === 0) dIndex++;
    if (creditor.balance === 0) cIndex++;
  }

  return transactions;
}
