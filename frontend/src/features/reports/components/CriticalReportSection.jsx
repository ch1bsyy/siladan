import React from "react";
import { FiClock, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { LuShieldAlert } from "react-icons/lu";

const incidents = [
  {
    id: "INC-001",
    title: "FO Backbone Putus Area Selatan",
    date: "2025-10-15",
    downtime: "4 Jam 30 Menit",
    impact: 5,
    status: "Resolved",
    cause: "Galian Pipa PDAM",
  },
  {
    id: "INC-002",
    title: "Serangan DDoS pada Portal Pelayanan",
    date: "2025-10-02",
    downtime: "1 Jam 15 Menit",
    impact: 12,
    status: "Resolved",
    cause: "Cyber Attack",
  },
  {
    id: "INC-003",
    title: "Listrik Data Center Padam (UPS Fail)",
    date: "2025-09-20",
    downtime: "0 Jam 45 Menit",
    impact: 50, // Semua OPD
    status: "Post-Mortem",
    cause: "Hardware Failure",
  },
];

const CriticalReportSection = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Alert */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full text-red-600 dark:text-red-200">
          <LuShieldAlert size={24} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
            Ringkasan Stabilitas Sistem
          </h3>
          <p className="text-sm text-red-700 dark:text-red-200 mt-1">
            Terdapat <strong>3 Major Incident</strong> dalam periode ini dengan
            total downtime <strong>6 Jam 30 Menit</strong>. Ketersediaan layanan
            (Uptime) rata-rata berada di angka <strong>99.1%</strong>.
          </p>
        </div>
      </div>

      {/* Timeline / List Incident */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white">
            Riwayat Insiden Kritis (War Room Log)
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono rounded">
                      {inc.id}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        inc.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {inc.title}
                  </h4>
                  <p className="text-sm text-slate-500">
                    Penyebab Utama:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {inc.cause}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-[#F7AD19]" size={18} />
                    <div>
                      <p className="text-xs text-slate-400">Durasi Downtime</p>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {inc.downtime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-red-500" size={18} />
                    <div>
                      <p className="text-xs text-slate-400">Dampak</p>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {inc.impact} OPD
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" size={18} />
                    <div>
                      <p className="text-xs text-slate-400">Tanggal</p>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {inc.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CriticalReportSection;
