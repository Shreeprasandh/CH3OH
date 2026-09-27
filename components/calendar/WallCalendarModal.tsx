"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Plus, Receipt } from "lucide-react";
import { MONTH_IMAGES, MONTH_NAMES } from "@/lib/monthImages";
import { CalendarExpenseEvent, getLocalCalendarEvents } from "@/lib/calendar-sync";

interface WallCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDateToAddExpense?: (dateStr: string) => void;
}

interface CalendarCell {
  date: Date;
  dateStr: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const WEEKDAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const WallCalendarModal: React.FC<WallCalendarModalProps> = ({
  isOpen,
  onClose,
  onSelectDateToAddExpense,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarExpenseEvent[]>([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{
    dateStr: string;
    events: CalendarExpenseEvent[];
  } | null>(null);

  useEffect(() => {
    const load = () => {
      setEvents(getLocalCalendarEvents());
    };
    load();
    window.addEventListener("ch3oh_calendar_update", load);
    return () => window.removeEventListener("ch3oh_calendar_update", load);
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();
  const monthData = MONTH_IMAGES[currentMonthIdx] || MONTH_IMAGES[0];

  const calendarGrid = useMemo<CalendarCell[]>(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayWeekday = firstDayOfMonth.getDay();
    const leadingDaysCount = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const cells: CalendarCell[] = [];
    const todayStr = new Date().toISOString().split("T")[0];

    // Leading days (previous month)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = leadingDaysCount - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      cells.push({
        date: d,
        dateStr: dStr,
        dayNum: d.getDate(),
        isCurrentMonth: false,
        isToday: dStr === todayStr,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      cells.push({
        date: d,
        dateStr: dStr,
        dayNum: i,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
      });
    }

    // Trailing days to reach 42 cells (6 full weeks)
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      cells.push({
        date: d,
        dateStr: dStr,
        dayNum: i,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
      });
    }

    return cells;
  }, [currentDate]);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIdx - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIdx + 1, 1));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-2xl flex flex-col"
        >
          {/* Top Metallic Binder Bar */}
          <div className="relative h-9 bg-[#E0D7C9] border-b border-[#DDD4C6] flex items-center justify-center px-4 rounded-t-3xl">
            <div className="flex items-center gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-linear-to-b from-[#FFF] to-[#AAA] shadow-inner border border-[#999]"
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="absolute right-3 w-6 h-6 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D] hover:text-[#1C241B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Monthly Artwork Banner */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#8B9A6E]/20">
            <Image
              src={monthData.src}
              alt={monthData.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1C241B]/70 via-transparent to-black/20" />

            {/* Navigation Overlay */}
            <div className="absolute inset-x-4 top-4 flex items-center justify-between text-white">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-[#EAE2D6] font-semibold">
                  {currentYear}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  {MONTH_NAMES[currentMonthIdx]}
                </h2>
              </div>

              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 42-Cell Physical Grid */}
          <div className="p-4 sm:p-6 bg-[#F7F2EB] flex-1">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-bold tracking-wider text-[#535D4D]">
              {WEEKDAY_NAMES.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Day Cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((cell) => {
                const dayEvents = events.filter((e) => e.date === cell.dateStr);
                const hasEvents = dayEvents.length > 0;

                return (
                  <motion.div
                    key={cell.dateStr}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      if (hasEvents) {
                        setSelectedDayEvents({ dateStr: cell.dateStr, events: dayEvents });
                      } else if (onSelectDateToAddExpense) {
                        onSelectDateToAddExpense(cell.dateStr);
                        onClose();
                      }
                    }}
                    className={`min-h-[58px] sm:min-h-[64px] p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      cell.isToday
                        ? "bg-[#8B9A6E]/15 border-[#8B9A6E] shadow-2xs"
                        : cell.isCurrentMonth
                        ? "bg-[#EAE2D6]/40 border-[#DDD4C6]/60 hover:bg-[#EAE2D6]"
                        : "bg-transparent border-transparent opacity-30 text-[#848F7E]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          cell.isToday
                            ? "w-5 h-5 rounded-full bg-[#8B9A6E] text-white flex items-center justify-center"
                            : "text-[#1C241B]"
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {cell.isCurrentMonth && onSelectDateToAddExpense && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDateToAddExpense(cell.dateStr);
                            onClose();
                          }}
                          className="w-4 h-4 rounded-full bg-[#DDD4C6]/60 hover:bg-[#8B9A6E] hover:text-white flex items-center justify-center text-[10px] text-[#535D4D] transition-colors"
                          title="Add expense on this date"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>

                    {/* Day Events Pills */}
                    <div className="flex flex-col gap-0.5 mt-1">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className="px-1 py-0.5 rounded-sm bg-[#8B9A6E] text-white text-[8px] font-semibold truncate"
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[8px] text-[#535D4D] font-bold">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Events Drawer */}
          {selectedDayEvents && (
            <div className="p-4 bg-[#EAE2D6] border-t border-[#DDD4C6] rounded-b-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1C241B]">
                  Expenses on {selectedDayEvents.dateStr}
                </span>
                <button
                  onClick={() => setSelectedDayEvents(null)}
                  className="text-xs text-[#535D4D] hover:underline"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                {selectedDayEvents.events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2 rounded-xl bg-[#F7F2EB] border border-[#DDD4C6]/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-[#8B9A6E]" />
                      <span className="font-semibold text-[#1C241B]">{ev.title}</span>
                    </div>
                    <span className="text-[10px] text-[#535D4D]">Paid by {ev.paidByName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
