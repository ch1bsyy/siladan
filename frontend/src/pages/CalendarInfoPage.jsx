import React, { useState } from "react";
import { FiClock, FiList, FiCalendar } from "react-icons/fi";

import OperationalStatusWidget from "../features/calendar/components/OperationalStatusWidget";
import ReadOnlyCalendarTab from "../features/calendar/components/ReadOnlyCalendarTab";
import ReadOnlyBusinessHoursTab from "../features/calendar/components/ReadOnlyBusinessHoursTab";
import UpcomingHolidaysTab from "../features/calendar/components/UpcomingHolidaysTab";

const CalendarInfoPage = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER & WIDGET */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Kalender & Jadwal
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Informasi waktu operasional untuk acuan perhitungan SLA Tiket.
          </p>
        </div>

        <OperationalStatusWidget />
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-thin overflow-y-hidden">
        <nav className="-mb-px flex gap-6 min-w-max">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`py-4 px-2 min-h-11 min-w-11 border-b-2 font-medium text-sm md:text-base flex items-center gap-2 transition-colors ${
              activeTab === "calendar"
                ? "border-[#053F5C] text-[#053F5C] dark:border-[#F7AD19] dark:text-[#F7AD19]"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <FiCalendar size={20} /> Visualisasi Kalender
          </button>
          <button
            onClick={() => setActiveTab("hours")}
            className={`py-4 px-2 min-h-11 min-w-11 border-b-2 font-medium text-sm md:text-base flex items-center gap-2 transition-colors ${
              activeTab === "hours"
                ? "border-[#053F5C] text-[#053F5C] dark:border-[#F7AD19] dark:text-[#F7AD19]"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <FiClock size={20} /> Jam Kerja Standar
          </button>
          <button
            onClick={() => setActiveTab("holidays")}
            className={`py-4 px-2 min-h-11 min-w-11 border-b-2 font-medium text-sm md:text-base flex items-center gap-2 transition-colors ${
              activeTab === "holidays"
                ? "border-[#053F5C] text-[#053F5C] dark:border-[#F7AD19] dark:text-[#F7AD19]"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <FiList size={20} /> Libur Mendatang
          </button>
        </nav>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-2">
        {activeTab === "calendar" && <ReadOnlyCalendarTab />}
        {activeTab === "hours" && <ReadOnlyBusinessHoursTab />}
        {activeTab === "holidays" && <UpcomingHolidaysTab />}
      </div>
    </div>
  );
};

export default CalendarInfoPage;
