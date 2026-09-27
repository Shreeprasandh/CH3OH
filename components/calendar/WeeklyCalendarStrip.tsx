"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { CalendarExpenseEvent, getLocalCalendarEvents } from "@/lib/calendar-sync";

interface WeeklyCalendarStripProps {
  onOpenFullCalendar: () => void;
  className?: string;
}

interface WeekDay {
  dayName: string;
  dayNum: number;
  dateStr: string;
  isToday: boolean;
}

export const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({
  onOpenFullCalendar,
  className = "",
}) => {
  const [events, setEvents] = useState<CalendarExpenseEvent[]>([]);

  useEffect(() => {
    const load = () => {
      setEvents(getLocalCalendarEvents());
    };
    load();
    window.addEventListener("ch3oh_calendar_update", load);
    return () => window.removeEventListener("ch3oh_calendar_update", load);
  }, []);

  const getWeekDates = (): WeekDay[] => {
    const today = new Date();
    const currentDay = today.getDay();
    const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMon);

    const daysMap = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    const week: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dyYear = d.getFullYear();
      const dyMonth = String(d.getMonth() + 1).padStart(2, "0");
      const dyDay = String(d.getDate()).padStart(2, "0");
      const dateStr = `${dyYear}-${dyMonth}-${dyDay}`;

      week.push({
        dayName: daysMap[i],
        dayNum: d.getDate(),
        dateStr,
        isToday: dateStr === todayStr,
      });
    }
    return week;
  };

  const weekDays = getWeekDates();

  return (
    <div
      onClick={onOpenFullCalendar}
      className={`p-3 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/70 shadow-xs cursor-pointer hover:border-[#8B9A6E]/50 transition-colors select-none ${className}`}
    >
      <div className="flex items-center justify-between px-1 mb-2 text-xs font-semibold text-[#535D4D]">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#8B9A6E]" />
          <span className="tracking-wide">SCHEDULE & EXPENSES</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#8B9A6E] font-bold">
          <span>3D Wall Calendar</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => {
          const dayEvents = events.filter((e) => e.date === day.dateStr);
          const hasEvents = dayEvents.length > 0;

          return (
            <motion.div
              key={day.dateStr}
              whileHover={{ y: -2 }}
              className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                day.isToday
                  ? "bg-[#8B9A6E] text-white shadow-xs font-bold"
                  : "bg-[#F7F2EB] text-[#1C241B] hover:bg-[#F2ECE2]"
              }`}
            >
              <span className={`text-[9px] uppercase tracking-wider ${day.isToday ? "text-white/80" : "text-[#535D4D]"}`}>
                {day.dayName}
              </span>
              <span className="text-sm font-bold tabular-nums mt-0.5">
                {day.dayNum}
              </span>

              {/* Event Indicator Pip */}
              <div className="h-1.5 mt-1 flex items-center justify-center">
                {hasEvents && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      day.isToday ? "bg-white" : "bg-[#8B9A6E]"
                    }`}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
