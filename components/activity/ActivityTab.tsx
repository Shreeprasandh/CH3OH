"use client";

import React, { useState } from "react";
import {
  Receipt,
  CheckCircle2,
  Bike,
  Fuel,
  AlertCircle,
  Clock,
  Filter,
} from "lucide-react";
import { formatCurrency } from "@/lib/split-engine";

export interface ActivityEvent {
  id: string;
  type: "expense" | "settlement" | "ride" | "fuel" | "adjustment";
  title: string;
  description: string;
  amountPaise?: number;
  currency?: string;
  timestamp: string;
  isAnomaly?: boolean;
}

interface ActivityTabProps {
  events: ActivityEvent[];
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ events }) => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = events.filter((ev) => {
    if (filter === "all") return true;
    return ev.type === filter;
  });

  const getIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "expense":
        return <Receipt className="w-4 h-4 text-[#8B9A6E]" />;
      case "settlement":
        return <CheckCircle2 className="w-4 h-4 text-[#3F633B]" />;
      case "ride":
        return <Bike className="w-4 h-4 text-[#8B9A6E]" />;
      case "fuel":
        return <Fuel className="w-4 h-4 text-[#8B9A6E]" />;
      case "adjustment":
        return <AlertCircle className="w-4 h-4 text-[#984A3B]" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1C241B]">Activity & Audit Feed</h2>
          <p className="text-xs text-[#535D4D]">Chronological transaction events</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]">
          {["all", "expense", "settlement", "ride"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold capitalize transition-all ${
                filter === f
                  ? "bg-[#8B9A6E] text-white shadow-2xs"
                  : "text-[#535D4D] hover:text-[#1C241B]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#EAE2D6] text-center text-xs text-[#848F7E]">
            No activity events recorded yet.
          </div>
        ) : (
          filtered.map((ev) => (
            <div
              key={ev.id}
              className={`p-3.5 rounded-2xl bg-[#EAE2D6] border shadow-2xs flex items-start justify-between gap-3 text-xs ${
                ev.isAnomaly
                  ? "border-[#984A3B]/40 bg-[#984A3B]/5"
                  : "border-[#DDD4C6]/60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F7F2EB] flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                  {getIcon(ev.type)}
                </div>

                <div>
                  <div className="font-bold text-[#1C241B] flex items-center gap-1.5">
                    <span>{ev.title}</span>
                    {ev.isAnomaly && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#984A3B] text-white text-[9px] font-black uppercase">
                        Revision Delta
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#535D4D] mt-0.5">{ev.description}</p>
                  <div className="text-[10px] text-[#848F7E] flex items-center gap-1 mt-1 font-medium">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{ev.timestamp}</span>
                  </div>
                </div>
              </div>

              {ev.amountPaise !== undefined && (
                <div className="text-right shrink-0">
                  <div className="text-sm font-black tabular-nums text-[#1C241B]">
                    {formatCurrency(ev.amountPaise, ev.currency || "INR")}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
