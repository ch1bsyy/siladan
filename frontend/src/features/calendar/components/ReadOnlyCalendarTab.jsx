import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWeekend,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";

// Mock Holidays Data (Read Only)
const holidays = [
  { date: new Date(2025, 0, 1), name: "Tahun Baru Masehi" },
  { date: new Date(2025, 2, 31), name: "Idul Fitri 1446 H" },
  { date: new Date(2025, 3, 1), name: "Cuti Bersama" },
  { date: new Date(), name: "Cuti Bersama (Demo)" },
];

const ReadOnlyCalendarTab = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <SlCalender size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: localeId })}
          </h2>
        </div>
        <div className="flex gap-1 mt-2 md:mt-0 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          <button
            onClick={prevMonth}
            className="p-1.5 min-h-11 min-w-11 flex items-center justify-center hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-shadow cursor-pointer"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 min-h-11 min-w-11 flex items-center justify-center hover:bg-white dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-shadow cursor-pointer"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 mb-2 text-center border-b border-slate-200 dark:border-slate-700 pb-2">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, i) => (
          <div
            key={day}
            className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
              i >= 5 ? "text-red-500" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {allDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const isHoliday = holidays.find((h) => isSameDay(h.date, day));
          const isWknd = isWeekend(day);

          let bgClass = "bg-white dark:bg-slate-800";
          let textClass = "text-slate-700 dark:text-slate-300";

          if (!isCurrentMonth) {
            bgClass = "bg-slate-50/50 dark:bg-slate-900/50 opacity-50";
          } else if (isHoliday) {
            bgClass =
              "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800";
            textClass = "text-red-700 dark:text-red-400 font-bold";
          } else if (isWknd) {
            bgClass = "bg-slate-100 dark:bg-slate-800/80";
            textClass = "text-slate-500 dark:text-slate-500";
          }

          return (
            <div
              key={idx}
              className={`
                relative flex flex-col justify-between min-h-[80px] md:min-h-[100px] p-2 rounded-lg 
                ${bgClass} ${
                isToday
                  ? "ring-2 ring-[#053F5C] dark:ring-[#429EBD] z-10"
                  : "border border-slate-100 dark:border-slate-700"
              }
              `}
              title={isHoliday ? isHoliday.name : ""}
            >
              <span className={`text-sm ${textClass}`}>{format(day, "d")}</span>

              {/* Holiday Label */}
              {isHoliday && (
                <div className="mt-1">
                  <span className="hidden md:inline-block text-xs md:text-sm leading-tight bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded">
                    {isHoliday.name}
                  </span>
                  <span className="md:hidden w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></span>
                </div>
              )}
              {/* Weekend Label (Desktop Only) */}
              {isWknd && isCurrentMonth && !isHoliday && (
                <span className="hidden md:block text-xs md:text-sm text-slate-400 mt-auto">
                  Libur
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white border border-slate-300 rounded"></div>{" "}
          Hari Kerja (SLA ON)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-100 border border-slate-300 rounded"></div>{" "}
          Akhir Pekan (SLA OFF)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>{" "}
          Hari Libur (SLA OFF)
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyCalendarTab;
