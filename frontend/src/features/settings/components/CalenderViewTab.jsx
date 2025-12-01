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
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";

// Mock Data Holiday (Take from same API with HolidaysTab)
const holidays = [
  { date: new Date(2025, 0, 1), name: "Tahun Baru Masehi" },
  { date: new Date(2025, 2, 31), name: "Idul Fitri 1446 H" },
  { date: new Date(2025, 3, 1), name: "Cuti Bersama Idul Fitri" },
  { date: new Date(), name: "Hari Ini (Demo)" },
];

const CalendarViewTab = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Logic Generate Calendar Grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // MOnday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Generate array of days
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 md:p-6 animate-fade-in">
      {/* --- Calendar Header --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-[#053F5C] dark:text-blue-400 rounded-lg">
            <FiCalendar size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: localeId })}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Visualisasi hari kerja & libur
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          <button
            onClick={prevMonth}
            className="p-2 flex items-center justify-center hover:bg-white min-h-11 min-w-11 cursor-pointer dark:hover:bg-slate-600 rounded-md text-slate-600 dark:text-white transition-all shadow-sm"
            aria-label="Bulan Sebelumnya"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-xs min-h-11 min-w-11 cursor-pointer md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all"
          >
            Hari Ini
          </button>
          <button
            onClick={nextMonth}
            className="p-2 flex items-center justify-center hover:bg-white min-h-11 min-w-11 cursor-pointer dark:hover:bg-slate-600 rounded-md text-slate-600 dark:text-white transition-all shadow-sm"
            aria-label="Bulan Selanjutnya"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* --- Days Header (Day Name) --- */}
      <div className="grid grid-cols-7 mb-2 text-center border-b border-slate-200 dark:border-slate-700 pb-2">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
          (dayName, idx) => (
            <div
              key={dayName}
              className={`text-xs md:text-sm font-bold uppercase tracking-wider py-1 ${
                idx >= 5 ? "text-red-400" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {dayName}
            </div>
          )
        )}
      </div>

      {/* --- Calendar Grid (Fill date) --- */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 auto-rows-fr">
        {allDays.map((dayItem, index) => {
          const isCurrentMonth = isSameMonth(dayItem, monthStart);
          const isToday = isSameDay(dayItem, new Date());
          const isHoliday = holidays.find((h) => isSameDay(h.date, dayItem));
          const isWknd = isWeekend(dayItem);

          // Logic Styling Cell
          // Default: Day Work
          let containerClass =
            "bg-white dark:bg-slate-800 hover:border-[#053F5C] dark:hover:border-[#429EBD]";
          let textDateClass = "text-slate-700 dark:text-slate-300";

          // 1.Not This Month
          if (!isCurrentMonth) {
            containerClass = "bg-slate-50/50 dark:bg-slate-900/50 opacity-60";
            textDateClass = "text-slate-400 dark:text-slate-600";
          }
          // 2. National Holidays (Red) -> High Priority
          else if (isHoliday) {
            containerClass =
              "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900";
            textDateClass = "text-red-600 dark:text-red-200 font-bold";
          }
          // 3. Weekend
          else if (isWknd) {
            containerClass = "bg-slate-100 dark:bg-slate-800/80";
            textDateClass = "text-slate-500 dark:text-slate-500";
          }

          // 4. Today
          const todayClass = isToday
            ? "ring-2 ring-[#053F5C] dark:ring-[#429EBD] z-10"
            : "";

          return (
            <div
              key={index}
              className={`
                relative flex flex-col justify-between
                min-h-[80px] md:min-h-[120px] 
                p-2 rounded-lg border border-slate-100 dark:border-slate-700 
                transition-all duration-200 group
                ${containerClass} ${todayClass}
              `}
            >
              {/* Date */}
              <div className="flex justify-between items-start">
                <span
                  className={`text-sm md:text-base font-medium ${textDateClass}`}
                >
                  {format(dayItem, "d")}
                </span>

                {/* Dot Indicator on Mobile */}
                {isHoliday && (
                  <span className="md:hidden w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>

              {/* Status Text */}
              <div className="mt-1 flex-1 flex flex-col justify-end gap-1">
                {isHoliday ? (
                  <span className="text-[10px] md:text-sm font-semibold text-red-600 dark:text-red-400 leading-tight line-clamp-2 md:line-clamp-3 bg-red-100/50 dark:bg-red-900/40 px-1.5 py-1 rounded">
                    {isHoliday.name}
                  </span>
                ) : isWknd && isCurrentMonth ? (
                  <span className="hidden md:block text-[10px] md:text-sm text-slate-400 italic">
                    Akhir Pekan
                  </span>
                ) : null}
              </div>

              {/* Tooltip Hover (Optional Visual Feedback) */}
              {isHoliday && (
                <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* --- Legend --- */}
      <div className="mt-6 flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start border-t border-slate-100 dark:border-slate-700 pt-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-white border dark:bg border-slate-300 rounded shadow-sm"></div>
          <span>Hari Kerja (SLA Aktif)</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-200 border border-blue-200 rounded shadow-sm"></div>
          <span>Akhir Pekan (SLA Pause)</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-100 border border-red-300 dark:border-red-600 rounded shadow-sm"></div>
          <span className="font-medium text-red-600">
            Hari Libur (SLA Pause)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
          <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-[#053F5C] dark:border-blue-400 rounded shadow-sm"></div>
          <span>Hari Ini</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewTab;
