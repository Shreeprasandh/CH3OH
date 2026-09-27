"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, Bike, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Fuel } from "lucide-react";
import { formatCurrency } from "@/lib/split-engine";

export type WidgetSize = "small" | "medium" | "large" | "pill";
export type WidgetVariant = "balance" | "bike" | "hybrid";

export interface WidgetData {
  netBalancePaise: number; // positive = owed to you, negative = you owe
  pendingDebtsCount: number;
  bikeName?: string;
  bikeOdometer?: number;
  bikeStatus?: "parked" | "in_ride" | "maintenance";
  bikeMileage?: number;
  nextScheduledPayment?: {
    title: string;
    date: string;
    amountPaise: number;
  };
  onAddExpense?: () => void;
  onStartRide?: () => void;
  onSettleUp?: () => void;
}

interface CH3OHWidgetProps {
  size?: WidgetSize;
  variant?: WidgetVariant;
  data: WidgetData;
  className?: string;
  onClick?: () => void;
}

export const CH3OHWidget: React.FC<CH3OHWidgetProps> = ({
  size = "medium",
  variant = "hybrid",
  data,
  className = "",
  onClick,
}) => {
  const isCreditor = data.netBalancePaise >= 0;
  const balanceColor = isCreditor ? "text-[#3F633B]" : "text-[#984A3B]";
  const balanceDot = isCreditor ? "bg-[#3F633B]" : "bg-[#984A3B]";

  // 1. MINI PILL / DYNAMIC ISLAND WIDGET (Single line, ultra-compact)
  if (size === "pill") {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-xs select-none ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-[#535D4D]" />
          <span className={`text-xs font-semibold tabular-nums ${balanceColor}`}>
            {formatCurrency(data.netBalancePaise)}
          </span>
        </div>
        <div className="w-[1px] h-3 bg-[#DDD4C6]" />
        <div className="flex items-center gap-1.5">
          <Bike className="w-3.5 h-3.5 text-[#8B9A6E]" />
          <span className="text-xs font-medium text-[#1C241B] tabular-nums">
            {data.bikeOdometer ? `${data.bikeOdometer.toLocaleString()} km` : "Ready"}
          </span>
        </div>
      </motion.div>
    );
  }

  // 2. SMALL WIDGET (1x1 Square - 160x160dp)
  if (size === "small") {
    if (variant === "bike") {
      return (
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={`w-[160px] h-[160px] p-4 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-sm flex flex-col justify-between select-none ${className}`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#8B9A6E]/15 flex items-center justify-center">
              <Bike className="w-4 h-4 text-[#8B9A6E]" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F7F2EB] text-[9px] font-bold tracking-wider uppercase text-[#535D4D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F633B] animate-pulse" />
              {data.bikeStatus || "Parked"}
            </span>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-[#535D4D]">
              {data.bikeName || "CH3OH Bike"}
            </div>
            <div className="text-xl font-bold tracking-tight text-[#1C241B] tabular-nums mt-0.5">
              {data.bikeOdometer ? `${data.bikeOdometer.toLocaleString()} km` : "14,285 km"}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#DDD4C6]/60 text-[10px] text-[#535D4D]">
            <span className="flex items-center gap-1">
              <Fuel className="w-3 h-3 text-[#8B9A6E]" />
              {data.bikeMileage ? `${data.bikeMileage} km/L` : "34.8 km/L"}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B9A6E]" />
          </div>
        </motion.div>
      );
    }

    // Default Small: Financial Glance
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={data.onSettleUp}
        className={`w-[160px] h-[160px] p-4 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-sm flex flex-col justify-between cursor-pointer select-none ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-[#F7F2EB] flex items-center justify-center shadow-2xs">
            <Wallet className="w-4 h-4 text-[#8B9A6E]" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F7F2EB] text-[9px] font-bold tracking-wider uppercase text-[#535D4D]">
            <span className={`w-1.5 h-1.5 rounded-full ${balanceDot}`} />
            {isCreditor ? "Credit" : "Debt"}
          </span>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-widest font-semibold text-[#535D4D]">
            {isCreditor ? "Owed to you" : "You owe"}
          </div>
          <div className={`text-xl font-extrabold tracking-tight tabular-nums mt-0.5 ${balanceColor}`}>
            {formatCurrency(data.netBalancePaise)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#DDD4C6]/60 text-[10px] text-[#535D4D]">
          <span>{data.pendingDebtsCount} active</span>
          {isCreditor ? (
            <ArrowDownLeft className="w-3.5 h-3.5 text-[#3F633B]" />
          ) : (
            <ArrowUpRight className="w-3.5 h-3.5 text-[#984A3B]" />
          )}
        </div>
      </motion.div>
    );
  }

  // 3. MEDIUM WIDGET (2x1 Horizontal Banner - 340x160dp)
  if (size === "medium") {
    return (
      <div
        className={`w-full max-w-[360px] h-[160px] p-4 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-sm grid grid-cols-2 gap-3 select-none ${className}`}
      >
        {/* Left Quadrant: Net Financial Position */}
        <div className="flex flex-col justify-between pr-3 border-r border-[#DDD4C6]/70">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-[#F7F2EB] flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-[#8B9A6E]" />
            </div>
            <span className="text-[9px] font-bold tracking-wider uppercase text-[#535D4D] flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${balanceDot}`} />
              {isCreditor ? "Plus" : "Minus"}
            </span>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-widest font-semibold text-[#535D4D]">
              Net Balance
            </div>
            <div className={`text-lg font-black tracking-tight tabular-nums ${balanceColor}`}>
              {formatCurrency(data.netBalancePaise)}
            </div>
          </div>

          <div className="text-[10px] text-[#535D4D] font-medium">
            {data.pendingDebtsCount} group settlements
          </div>
        </div>

        {/* Right Quadrant: Bike Telemetry */}
        <div className="flex flex-col justify-between pl-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-[#8B9A6E]/15 flex items-center justify-center">
              <Bike className="w-3.5 h-3.5 text-[#8B9A6E]" />
            </div>
            <span className="text-[9px] font-bold tracking-wider uppercase text-[#535D4D]">
              {data.bikeStatus || "Parked"}
            </span>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-widest font-semibold text-[#535D4D]">
              Odometer
            </div>
            <div className="text-lg font-bold tracking-tight text-[#1C241B] tabular-nums">
              {data.bikeOdometer ? `${data.bikeOdometer.toLocaleString()} km` : "14,285 km"}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#535D4D]">
            <span>{data.bikeMileage ? `${data.bikeMileage} km/L` : "34.8 km/L"}</span>
            <span className="w-2 h-2 rounded-full bg-[#3F633B]" title="Lock verified" />
          </div>
        </div>
      </div>
    );
  }

  // 4. LARGE WIDGET (2x2 Expanded Hub - 340x340dp)
  return (
    <div
      className={`w-full max-w-[360px] p-5 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-md flex flex-col justify-between gap-4 select-none ${className}`}
    >
      {/* Top Header: Brand & Status Pips */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#8B9A6E] flex items-center justify-center shadow-xs">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1C241B] tracking-tight">CH3OH GLANCE</div>
            <div className="text-[9px] tracking-widest uppercase text-[#535D4D] font-medium">Tactile Hub</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F2EB] text-[10px] font-semibold text-[#535D4D]">
          <span className={`w-1.5 h-1.5 rounded-full ${balanceDot}`} />
          {isCreditor ? "Positive" : "Action Needed"}
        </div>
      </div>

      {/* Main Dual Pulse Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/60">
          <div className="text-[9px] uppercase tracking-widest font-semibold text-[#535D4D]">
            Net Balance
          </div>
          <div className={`text-xl font-black tracking-tight tabular-nums mt-1 ${balanceColor}`}>
            {formatCurrency(data.netBalancePaise)}
          </div>
          <div className="text-[10px] text-[#848F7E] mt-1">
            {data.pendingDebtsCount} balances active
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/60">
          <div className="text-[9px] uppercase tracking-widest font-semibold text-[#535D4D]">
            Bike Status
          </div>
          <div className="text-xl font-black tracking-tight text-[#1C241B] tabular-nums mt-1">
            {data.bikeOdometer ? `${data.bikeOdometer.toLocaleString()}` : "14,285"}
            <span className="text-xs font-normal text-[#535D4D] ml-0.5">km</span>
          </div>
          <div className="text-[10px] text-[#848F7E] mt-1 flex items-center justify-between">
            <span>{data.bikeMileage || 34.8} km/L</span>
            <span className="text-[#3F633B] font-semibold">Ready</span>
          </div>
        </div>
      </div>

      {/* Mini 7-Day Horizon Preview */}
      <div className="px-3 py-2 rounded-2xl bg-[#F2ECE2] flex items-center justify-between text-[10px] text-[#535D4D]">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="font-semibold text-[9px]">{day}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                idx === 2 || idx === 5 ? "bg-[#8B9A6E]" : "bg-[#DDD4C6]"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Footer Quick Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={data.onAddExpense}
          className="py-2.5 px-3 rounded-2xl bg-[#8B9A6E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#647348] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Expense</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={data.onStartRide}
          className="py-2.5 px-3 rounded-2xl bg-[#F7F2EB] text-[#1C241B] border border-[#DDD4C6] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#EAE2D6] transition-colors"
        >
          <Bike className="w-3.5 h-3.5 text-[#8B9A6E]" />
          <span>Ride</span>
        </motion.button>
      </div>
    </div>
  );
};
