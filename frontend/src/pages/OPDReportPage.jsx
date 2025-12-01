import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import FormSelect from "../components/FormSelect";
import ServiceHealthSection from "../features/reports/components/ServiceHealthSection";
import TechPerformanceSection from "../features/reports/components/TechPerformanceSection";

const OPDReportPage = () => {
  const [period, setPeriod] = useState("Bulan Ini");
  const [activeTab, setActiveTab] = useState("health");

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Laporan Kinerja OPD
          </h1>
          <p className="mt-1 text-base text-slate-600 dark:text-slate-400">
            Evaluasi kesehatan layanan dan produktivitas tim teknisi di OPD
            terkait.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-40">
            <FormSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="Bulan Ini">Bulan Ini</option>
              <option value="Bulan Lalu">Bulan Lalu</option>
              <option value="Tahun Ini">Tahun Ini</option>
            </FormSelect>
          </div>
          <button className="flex items-center min-h-11 min-w-11 gap-2 px-4 py-2 bg-[#053F5C] text-white rounded-lg hover:bg-[#075075] transition-colors shadow-sm font-medium cursor-pointer">
            <FiDownload size={18} />
            <span className="hidden sm:inline">Unduh Laporan (PDF)</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex gap-4">
          <button
            onClick={() => setActiveTab("health")}
            className={`py-4 px-1 border-b-2 font-medium text-sm md:text-base transition-colors ${
              activeTab === "health"
                ? "border-[#F7AD19] text-[#053F5C] dark:text-[#F7AD19]"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Kesehatan Layanan
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`py-4 px-1 border-b-2 font-medium text-sm md:text-base transition-colors ${
              activeTab === "performance"
                ? "border-[#F7AD19] text-[#053F5C] dark:text-[#F7AD19]"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Kinerja SDM (Teknisi)
          </button>
        </nav>
      </div>

      {/* CONTENT SECTIONS */}
      <div>
        {activeTab === "health" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Overview Layanan
              </h2>
              <p className="text-sm md:text-[15px] text-slate-500">
                Metrik utama kesehatan operasional IT di OPD Anda.
              </p>
            </div>
            <ServiceHealthSection />
          </div>
        )}

        {activeTab === "performance" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Produktivitas Tim
              </h2>
              <p className="text-sm md:text-[15px] text-slate-500">
                Analisis beban kerja dan performa individu teknisi.
              </p>
            </div>
            <TechPerformanceSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default OPDReportPage;
