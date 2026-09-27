"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  X,
  Receipt,
  User,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { matchCategoryFromTitle } from "@/lib/category-icons";
import { formatCurrency } from "@/lib/split-engine";

export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amountPaise: number;
  currency: string;
  paidByName: string;
  expenseDate: string;
  splitMode: string;
  splits: Array<{
    userId: string;
    userName: string;
    amountPaise: number;
  }>;
  createdAt: string;
}

interface ExpenseLogProps {
  expenses: ExpenseItem[];
}

export const ExpenseLog: React.FC<ExpenseLogProps> = ({ expenses }) => {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/70 text-center select-none">
        <Receipt className="w-8 h-8 text-[#848F7E] mx-auto mb-2" />
        <h4 className="text-sm font-bold text-[#1C241B]">No Expenses Recorded</h4>
        <p className="text-xs text-[#535D4D] mt-0.5">
          Tap "+ Add Expense" to start logging shared group bills.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5 select-none">
      <div className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] px-1">
        Recent Activity & Expense Log
      </div>

      <div className="flex flex-col gap-2">
        {expenses.map((expense) => {
          const match = matchCategoryFromTitle(expense.title);
          const IconComp = match.IconComponent;

          return (
            <motion.div
              key={expense.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedExpense(expense)}
              className="p-3.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 shadow-2xs hover:border-[#8B9A6E]/50 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F7F2EB] flex items-center justify-center text-[#8B9A6E] shadow-2xs">
                  <IconComp className="w-5 h-5" />
                </div>

                <div>
                  <div className="text-sm font-bold text-[#1C241B]">{expense.title}</div>
                  <div className="text-[11px] text-[#535D4D] flex items-center gap-2 mt-0.5">
                    <span>Paid by {expense.paidByName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-3 h-3 text-[#8B9A6E]" />
                      {expense.expenseDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black tabular-nums text-[#1C241B]">
                  {formatCurrency(expense.amountPaise, expense.currency)}
                </div>
                <div className="text-[10px] font-semibold text-[#848F7E] capitalize">
                  {expense.splitMode} split
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expense Detail Modal */}
      <AnimatePresence>
        {selectedExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-xl flex flex-col gap-5 select-none"
            >
              <div className="flex items-center justify-between border-b border-[#DDD4C6]/60 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C241B]">{selectedExpense.title}</h3>
                  <p className="text-xs text-[#535D4D]">Expense Audit Details</p>
                </div>
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="w-8 h-8 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D] hover:text-[#1C241B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Amount Banner */}
              <div className="p-4 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 text-center">
                <div className="text-[10px] uppercase tracking-widest font-semibold text-[#535D4D]">
                  Total Transaction Amount
                </div>
                <div className="text-2xl font-black tabular-nums text-[#1C241B] mt-1">
                  {formatCurrency(selectedExpense.amountPaise, selectedExpense.currency)}
                </div>
                <div className="text-xs text-[#535D4D] mt-1">
                  Paid by <span className="font-bold text-[#1C241B]">{selectedExpense.paidByName}</span> on {selectedExpense.expenseDate}
                </div>
              </div>

              {/* Itemized Splits */}
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-2">
                  Itemized Member Shares
                </label>
                <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto">
                  {selectedExpense.splits.map((split, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#EAE2D6]/60 border border-[#DDD4C6]/50 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#1C241B]">{split.userName}</span>
                      <span className="font-bold tabular-nums text-[#1C241B]">
                        {formatCurrency(split.amountPaise, selectedExpense.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification & Meta */}
              <div className="flex items-center justify-between pt-2 border-t border-[#DDD4C6]/60 text-[10px] text-[#848F7E]">
                <div className="flex items-center gap-1 text-[#3F633B]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ledger Recorded</span>
                </div>
                <div>Recorded: {new Date(selectedExpense.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
