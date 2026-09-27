"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Check,
  ChevronDown,
  DollarSign,
  Receipt,
  Users,
} from "lucide-react";
import { matchCategoryFromTitle } from "@/lib/category-icons";
import {
  SplitMode,
  Participant,
  SplitInput,
  calculateSplits,
  formatCurrency,
  toPaise,
} from "@/lib/split-engine";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  members: Participant[];
  currentUserId: string;
  initialDate?: string;
  onAddExpense: (expense: {
    groupId: string;
    title: string;
    category: string;
    amountPaise: number;
    currency: string;
    paidById: string;
    expenseDate: string;
    splitMode: SplitMode;
    splits: Array<{ userId: string; amount: number }>;
  }) => void;
}

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "AED",
};

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  groupId,
  members,
  currentUserId,
  initialDate,
  onAddExpense,
}) => {
  const [title, setTitle] = useState("");
  const [amountRupees, setAmountRupees] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [paidById, setPaidById] = useState(currentUserId);
  const [expenseDate, setExpenseDate] = useState(
    initialDate || new Date().toISOString().split("T")[0]
  );
  const [splitMode, setSplitMode] = useState<SplitMode>("equal");
  const [splitInputs, setSplitInputs] = useState<Record<string, SplitInput>>({});

  useEffect(() => {
    if (initialDate) {
      setExpenseDate(initialDate);
    }
  }, [initialDate]);

  // Dynamic icon based on expense title
  const categoryMatch = useMemo(() => matchCategoryFromTitle(title), [title]);
  const IconComponent = categoryMatch.IconComponent;

  // Initialize split inputs when members change
  useEffect(() => {
    const initial: Record<string, SplitInput> = {};
    members.forEach((m) => {
      initial[m.id] = {
        userId: m.id,
        included: true,
        shares: 1,
        percentage: Number((100 / (members.length || 1)).toFixed(2)),
        amount: 0,
        adjustment: 0,
      };
    });
    setSplitInputs(initial);
  }, [members]);

  const totalPaise = useMemo(() => toPaise(amountRupees), [amountRupees]);

  const computedSplits = useMemo(() => {
    return calculateSplits(totalPaise, members, splitMode, splitInputs);
  }, [totalPaise, members, splitMode, splitInputs]);

  const totalAllocatedPaise = useMemo(() => {
    return computedSplits.reduce((sum, s) => sum + s.amount, 0);
  }, [computedSplits]);

  const isValid = totalPaise > 0 && title.trim().length > 0 && totalAllocatedPaise === totalPaise;

  if (!isOpen) return null;

  const cycleCurrency = () => {
    const idx = CURRENCIES.indexOf(currency);
    const next = CURRENCIES[(idx + 1) % CURRENCIES.length];
    setCurrency(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onAddExpense({
      groupId,
      title: title.trim(),
      category: categoryMatch.category,
      amountPaise: totalPaise,
      currency,
      paidById,
      expenseDate,
      splitMode,
      splits: computedSplits.map((s) => ({ userId: s.userId, amount: s.amount })),
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-2xl flex flex-col gap-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DDD4C6]/60 pb-3">
            <div className="flex items-center gap-2.5">
              {/* Dynamic Auto-Category Icon */}
              <motion.div
                key={categoryMatch.category}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-10 h-10 rounded-2xl bg-[#8B9A6E]/15 border border-[#8B9A6E]/30 flex items-center justify-center text-[#8B9A6E] shadow-2xs"
              >
                <IconComponent className="w-5 h-5" />
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-[#1C241B]">Add Group Expense</h3>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#535D4D]">
                  Category: {categoryMatch.category}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D] hover:text-[#1C241B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Expense Name Input */}
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1.5">
                Expense Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Shell Petrol, Weekend Dinner, WiFi bill"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-sm font-medium text-[#1C241B] placeholder-[#848F7E] focus:outline-none focus:border-[#8B9A6E]"
              />
            </div>

            {/* Amount & Currency Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1.5">
                  Total Amount
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-[#535D4D]">
                    {CURRENCY_SYMBOLS[currency]}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amountRupees}
                    onChange={(e) => setAmountRupees(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-base font-bold text-[#1C241B] placeholder-[#848F7E] focus:outline-none focus:border-[#8B9A6E] tabular-nums"
                  />
                </div>
              </div>

              {/* Currency Selector (Clickable Rupee / Currency Icon) */}
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1.5">
                  Currency
                </label>
                <button
                  type="button"
                  onClick={cycleCurrency}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-sm font-bold text-[#1C241B] flex items-center justify-between hover:bg-[#DDD4C6]/60 transition-colors"
                  title="Click to change currency"
                >
                  <span>{currency}</span>
                  <span className="w-5 h-5 rounded-full bg-[#8B9A6E] text-white text-[10px] flex items-center justify-center">
                    {CURRENCY_SYMBOLS[currency]}
                  </span>
                </button>
              </div>
            </div>

            {/* Backdatable Payment Date & Paid By Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Payment Date */}
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#8B9A6E]" />
                  <span>Date Paid (Calendar)</span>
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-xs font-semibold text-[#1C241B] focus:outline-none focus:border-[#8B9A6E]"
                />
              </div>

              {/* Paid By Dropdown */}
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#8B9A6E]" />
                  <span>Paid By</span>
                </label>
                <select
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-xs font-semibold text-[#1C241B] focus:outline-none focus:border-[#8B9A6E]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id === currentUserId ? `You (${m.name})` : m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Split Modes Selector */}
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1.5">
                Split Strategy
              </label>
              <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]">
                {(["equal", "exact", "percentage", "shares", "adjustment"] as SplitMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSplitMode(mode)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all ${
                      splitMode === mode
                        ? "bg-[#8B9A6E] text-white shadow-2xs"
                        : "text-[#535D4D] hover:text-[#1C241B]"
                    }`}
                  >
                    {mode === "equal" ? "Equally" : mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Configuration per Member */}
            <div className="p-3 rounded-2xl bg-[#EAE2D6]/60 border border-[#DDD4C6] flex flex-col gap-2 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#535D4D] uppercase tracking-wider px-1">
                <span>Member</span>
                <span>Owed Share</span>
              </div>

              {members.map((member) => {
                const input = splitInputs[member.id] || {};
                const split = computedSplits.find((s) => s.userId === member.id);

                return (
                  <div
                    key={member.id}
                    className="p-2 rounded-xl bg-[#F7F2EB] border border-[#DDD4C6]/60 flex items-center justify-between text-xs"
                  >
                    {/* Member & Include Checkbox (For Equal Split) */}
                    <div className="flex items-center gap-2">
                      {splitMode === "equal" && (
                        <input
                          type="checkbox"
                          checked={input.included !== false}
                          onChange={(e) =>
                            setSplitInputs((prev) => ({
                              ...prev,
                              [member.id]: { ...prev[member.id], included: e.target.checked },
                            }))
                          }
                          className="accent-[#8B9A6E] rounded-md cursor-pointer"
                        />
                      )}
                      <span className="font-semibold text-[#1C241B]">{member.name}</span>
                    </div>

                    {/* Mode Inputs */}
                    <div className="flex items-center gap-2">
                      {splitMode === "exact" && (
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={input.amount ? input.amount / 100 : ""}
                          onChange={(e) =>
                            setSplitInputs((prev) => ({
                              ...prev,
                              [member.id]: {
                                ...prev[member.id],
                                amount: toPaise(e.target.value),
                              },
                            }))
                          }
                          className="w-20 px-2 py-1 rounded-lg bg-[#EAE2D6] border border-[#DDD4C6] text-right font-bold text-xs"
                        />
                      )}

                      {splitMode === "percentage" && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="1"
                            value={input.percentage ?? 0}
                            onChange={(e) =>
                              setSplitInputs((prev) => ({
                                ...prev,
                                [member.id]: {
                                  ...prev[member.id],
                                  percentage: parseFloat(e.target.value) || 0,
                                },
                              }))
                            }
                            className="w-14 px-2 py-1 rounded-lg bg-[#EAE2D6] border border-[#DDD4C6] text-right font-bold text-xs"
                          />
                          <span className="text-[10px] text-[#535D4D]">%</span>
                        </div>
                      )}

                      {splitMode === "shares" && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            value={input.shares ?? 1}
                            onChange={(e) =>
                              setSplitInputs((prev) => ({
                                ...prev,
                                [member.id]: {
                                  ...prev[member.id],
                                  shares: parseInt(e.target.value) || 1,
                                },
                              }))
                            }
                            className="w-12 px-2 py-1 rounded-lg bg-[#EAE2D6] border border-[#DDD4C6] text-right font-bold text-xs"
                          />
                          <span className="text-[10px] text-[#535D4D]">parts</span>
                        </div>
                      )}

                      {/* Computed Amount Display */}
                      <span className="font-bold tabular-nums text-[#1C241B]">
                        {formatCurrency(split?.amount || 0, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validation Balance Indicator */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#535D4D]">Total Allocated:</span>
              <span
                className={`font-black tabular-nums ${
                  totalAllocatedPaise === totalPaise ? "text-[#3F633B]" : "text-[#984A3B]"
                }`}
              >
                {formatCurrency(totalAllocatedPaise, currency)} / {formatCurrency(totalPaise, currency)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 rounded-2xl text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                isValid
                  ? "bg-[#8B9A6E] hover:bg-[#647348] cursor-pointer"
                  : "bg-[#DDD4C6] text-[#848F7E] cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Add Expense to Group</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
