import React from "react";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

const schedule = [
  { day: "Senin", start: "08:00", end: "16:00", isOpen: true },
  { day: "Selasa", start: "08:00", end: "16:00", isOpen: true },
  { day: "Rabu", start: "08:00", end: "16:00", isOpen: true },
  { day: "Kamis", start: "08:00", end: "16:00", isOpen: true },
  { day: "Jumat", start: "08:00", end: "16:30", isOpen: true },
  { day: "Sabtu", start: "-", end: "-", isOpen: false },
  { day: "Minggu", start: "-", end: "-", isOpen: false },
];

const ReadOnlyBusinessHoursTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl text-sm md:text-base text-blue-800 dark:text-blue-300">
        <p>
          Tiket yang masuk di luar jam operasional di bawah ini akan mulai
          dihitung SLA-nya pada <strong>jam kerja berikutnya</strong>.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-sm md:text-base font-bold text-slate-600 dark:text-slate-300">
            <tr>
              <th className="px-6 py-4">Hari</th>
              <th className="px-6 py-4">Jam Operasional</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm text-slate-700 dark:text-slate-300">
            {schedule.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
              >
                <td className="px-6 py-4 font-medium text-sm md:text-base">
                  {item.day}
                </td>
                <td className="px-6 py-4 font-mono text-sm md:text-base">
                  {item.isOpen ? `${item.start} - ${item.end}` : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.isOpen ? (
                    <span className="inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs md:text-sm font-bold">
                      <FiCheckCircle size={16} /> BUKA
                    </span>
                  ) : (
                    <span className="inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 rounded text-xs md:text-sm font-bold">
                      <FiXCircle size={16} /> TUTUP
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Break Info */}
        <div className="p-4 hidden md:flex bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 items-center gap-2 text-sm md:text-[15px] text-slate-600 dark:text-slate-400">
          <FiClock size={16} />
          <span>
            <strong>Jam Istirahat:</strong> 12:00 - 13:00 (SLA Paused)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyBusinessHoursTab;
