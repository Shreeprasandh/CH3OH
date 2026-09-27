"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  PieChart,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, SimplifiedTransaction, PairwiseDebt } from "@/lib/split-engine";

export interface MemberBalance {
  userId: string;
  name: string;
  amountPaise: number; // positive = owes you, negative = you owe them
}

interface BalanceSummaryProps {
  totalOwedToYouPaise: number;
  totalYouOwePaise: number;
  memberBalances: MemberBalance[];
  simplifiedTransactions: SimplifiedTransaction[];
  memberNames: Record<string, string>;
  currentUserId: string;
  onOpenSettleModal: (targetUserId?: string, amountPaise?: number) => void;
  onToggleChartView: () => void;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  totalOwedToYouPaise,
  totalYouOwePaise,
  memberBalances,
  simplifiedTransactions,
  memberNames,
  currentUserId,
  onOpenSettleModal,
  onToggleChartView,
}) => {
  const [viewMode, setViewMode] = useState<"direct" | "simplified">("direct");

  const netTotalPaise = totalOwedToYouPaise - totalYouOwePaise;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Top Total Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Owed To You */}
        <div className="p-4 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D]">
              Owed To You
            </span>
            <div className="w-6 h-6 rounded-full bg-[#3F633B]/10 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#3F633B]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#3F633B] tabular-nums mt-2">
            {formatCurrency(totalOwedToYouPaise)}
          </div>
          <span className="text-[10px] text-[#535D4D] mt-1 font-medium">
            From {memberBalances.filter((m) => m.amountPaise > 0).length} members
          </span>
        </div>

        {/* Total You Owe */}
        <div className="p-4 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D]">
              You Owe
            </span>
            <div className="w-6 h-6 rounded-full bg-[#984A3B]/10 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#984A3B]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#984A3B] tabular-nums mt-2">
            {formatCurrency(totalYouOwePaise)}
          </div>
          <span className="text-[10px] text-[#535D4D] mt-1 font-medium">
            To {memberBalances.filter((m) => m.amountPaise < 0).length} members
          </span>
        </div>
      </div>

      {/* Action Bar: Settle Up, Chart View & Simplification Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-[#EAE2D6]/60 border border-[#DDD4C6]/60">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenSettleModal()}
            className="px-3.5 py-1.5 rounded-xl bg-[#8B9A6E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#647348] transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settle Up</span>
          </button>

          <button
            onClick={onToggleChartView}
            className="px-3 py-1.5 rounded-xl bg-[#F7F2EB] text-[#1C241B] text-xs font-semibold flex items-center gap-1.5 border border-[#DDD4C6] hover:bg-[#EAE2D6] transition-colors"
          >
            <PieChart className="w-3.5 h-3.5 text-[#8B9A6E]" />
            <span>Charts</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex rounded-xl bg-[#F7F2EB] p-0.5 border border-[#DDD4C6] text-xs">
          <button
            onClick={() => setViewMode("direct")}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
              viewMode === "direct"
                ? "bg-[#8B9A6E] text-white shadow-2xs"
                : "text-[#535D4D] hover:text-[#1C241B]"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setViewMode("simplified")}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all ${
              viewMode === "simplified"
                ? "bg-[#8B9A6E] text-white shadow-2xs"
                : "text-[#535D4D] hover:text-[#1C241B]"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Simplified</span>
          </button>
        </div>
      </div>

      {/* Member Debts Breakdown */}
      <div className="p-4 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/70 shadow-xs flex flex-col gap-2.5">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D]">
          {viewMode === "simplified" ? "Simplified Settlement Handoffs" : "Individual Member Balances"}
        </div>

        {viewMode === "direct" ? (
          <div className="flex flex-col gap-2">
            {memberBalances.length === 0 ? (
              <div className="text-xs text-[#848F7E] py-2 text-center">
                All balances are settled in this group.
              </div>
            ) : (
              memberBalances.map((mb) => {
                const owesYou = mb.amountPaise > 0;
                return (
                  <div
                    key={mb.userId}
                    className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#EAE2D6] text-[#1C241B] font-bold flex items-center justify-center text-xs">
                        {mb.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[#1C241B]">{mb.name}</div>
                        <div className="text-[10px] text-[#535D4D]">
                          {owesYou ? "owes you" : "you owe"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black tabular-nums ${
                          owesYou ? "text-[#3F633B]" : "text-[#984A3B]"
                        }`}
                      >
                        {formatCurrency(Math.abs(mb.amountPaise))}
                      </span>
                      <button
                        onClick={() => onOpenSettleModal(mb.userId, Math.abs(mb.amountPaise))}
                        className="px-2 py-1 rounded-lg bg-[#EAE2D6] text-[10px] font-bold text-[#535D4D] hover:bg-[#8B9A6E] hover:text-white transition-colors"
                      >
                        Settle
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {simplifiedTransactions.length === 0 ? (
              <div className="text-xs text-[#848F7E] py-2 text-center">
                No simplified payments required.
              </div>
            ) : (
              simplifiedTransactions.map((tx, idx) => {
                const fromName = memberNames[tx.fromUserId] || "Unknown";
                const toName = memberNames[tx.toUserId] || "Unknown";
                const isYouPaying = tx.fromUserId === currentUserId;
                const isYouReceiving = tx.toUserId === currentUserId;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1C241B]">{fromName}</span>
                      <span className="text-[#848F7E]">pays</span>
                      <span className="font-bold text-[#1C241B]">{toName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black tabular-nums text-[#1C241B]">
                        {formatCurrency(tx.amount)}
                      </span>
                      {(isYouPaying || isYouReceiving) && (
                        <button
                          onClick={() =>
                            onOpenSettleModal(
                              isYouPaying ? tx.toUserId : tx.fromUserId,
                              tx.amount
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-[#8B9A6E] text-white text-[10px] font-bold shadow-2xs hover:bg-[#647348]"
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
