import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import FormSelect from "../components/FormSelect";
import ExecutiveSummarySection from "../features/reports/components/ExecutiveSummarySection";
import OPDPerformanceSection from "../features/reports/components/OPDPerformanceSection";
import CriticalReportSection from "../features/reports/components/CriticalReportSection";

const CityReportPage = () => {
  const [period, setPeriod] = useState("Bulan Ini");
  const [category, setCategory] = useState("Semua");
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Laporan IT Kota
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Helicopter view kinerja layanan SILADAN tingkat Kota.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-full md:w-36">
            <FormSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="Bulan Ini">Bulan Ini</option>
              <option value="Triwulan 1">Triwulan 1</option>
              <option value="Tahun Ini">Tahun Ini</option>
            </FormSelect>
          </div>
          <div className="w-full md:w-45">
            <FormSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Jaringan">Jaringan</option>
              <option value="Aplikasi">Aplikasi</option>
            </FormSelect>
          </div>
          {/* <button className=" w-full md:w-30 flex min-h-11 min-w-11 items-center justify-center gap-2 px-4 py-2 bg-[#053F5C] text-white rounded-lg hover:bg-[#075075] transition-colors font-bold text-sm md:text-base shadow-md cursor-pointer">
            <FiDownload size={20} /> Export
          </button> */}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto overflow-y-hidden scrollbar-thin">
        <nav className="-mb-px flex gap-6 min-w-max">
          <TabButton
            label="Ringkasan Eksekutif"
            isActive={activeTab === "summary"}
            onClick={() => setActiveTab("summary")}
          />
          <TabButton
            label="Peringkat Kinerja OPD"
            isActive={activeTab === "opd"}
            onClick={() => setActiveTab("opd")}
          />
          <TabButton
            label="Laporan War Room (Insiden)"
            isActive={activeTab === "critical"}
            onClick={() => setActiveTab("critical")}
          />
        </nav>
      </div>

      {/* CONTENT AREA */}
      <div className="mt-6">
        {activeTab === "summary" && <ExecutiveSummarySection />}
        {activeTab === "opd" && <OPDPerformanceSection />}
        {activeTab === "critical" && <CriticalReportSection />}
      </div>
    </div>
  );
};

// Sub Component Tab
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-4 px-2 border-b-2 font-medium text-sm md:text-base transition-colors ${
      isActive
        ? "border-[#F7AD19] text-[#053F5C] dark:text-[#F7AD19]"
        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:text-slate-400"
    }`}
  >
    {label}
  </button>
);

export default CityReportPage;
