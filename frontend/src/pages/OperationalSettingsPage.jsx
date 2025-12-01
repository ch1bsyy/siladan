import React, { useState } from "react";
import { FiClock, FiDisc } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";

import BusinessHoursTab from "../features/settings/components/BusinessHoursTab";
import HolidaysTab from "../features/settings/components/HolidaysTab";
import CalenderViewTab from "../features/settings/components/CalenderViewTab";

const OperationalSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("hours");

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Pengaturan Operasional
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Konfigurasi jam kerja dan kalender libur untuk perhitungan SLA
          otomatis.
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-col sm:flex-row gap-4 border-b border-slate-200 dark:border-slate-700 pb-1">
        <button
          onClick={() => setActiveTab("hours")}
          className={`flex items-center gap-2 px-4 py-3 text-sm  md:text-base font-medium border-b-2 transition-colors ${
            activeTab === "hours"
              ? "border-[#053F5C] text-[#053F5C] dark:border-[#F7AD19] dark:text-[#F7AD19]"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <FiClock size={18} />
          Jam Kerja Standar
        </button>
        <button
          onClick={() => setActiveTab("holidays")}
          className={`flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium border-b-2 transition-colors ${
            activeTab === "holidays"
              ? "border-[#053F5C] text-[#053F5C] dark:border-[#F7AD19] dark:text-[#F7AD19]"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <FiDisc size={18} />
          Pengecualian & Libur
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex items-center gap-2 px-4 py-3 text-sm  md:text-base font-medium border-b-2 transition-colors ${
            activeTab === "calendar"
              ? "border-[#053F5C] text-[#053F5C] dark:border-[#F7AD19] dark:text-[#F7AD19]"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <SlCalender size={18} />
          Visualisasi Kalender
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {activeTab === "hours" && <BusinessHoursTab />}
        {activeTab === "holidays" && <HolidaysTab />}
        {activeTab === "calendar" && <CalenderViewTab />}
      </div>
    </div>
  );
};

export default OperationalSettingsPage;
