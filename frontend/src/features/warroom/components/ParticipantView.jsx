import React, { useState } from "react";
import { FiActivity, FiAlertTriangle } from "react-icons/fi";
import ChatPanel from "./ChatPanel";

const ParticipantView = () => {
  const [myStatus, setMyStatus] = useState("impacted");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
      {/* LEFT COLUMN: MY STATUS */}
      <div className="lg:col-span-1 space-y-4">
        {/* Status Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <FiActivity className="text-blue-500" /> Status Unit Saya
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Kondisi Dinas Anda Saat Ini:
            </label>
            <select
              value={myStatus}
              onChange={(e) => setMyStatus(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="down">🔴 Lumpuh Total (Down)</option>
              <option value="impacted">🟡 Terganggu (Lambat)</option>
              <option value="safe">🟢 Sudah Normal (Recovered)</option>
            </select>
            <button className="mt-3 w-full py-2 bg-[#053F5C] hover:bg-[#075075] text-white rounded-lg text-sm font-bold transition-transform active:scale-95">
              Update Status ke Pusat
            </button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-sm mb-1">
              <FiAlertTriangle size={16} /> Laporan Masuk
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              50{" "}
              <span className="text-sm font-normal text-slate-500">Tiket</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Pegawai Anda melaporkan gangguan ini.
            </p>
          </div>
        </div>

        {/* Commander Instruction */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r-xl">
          <h4 className="font-bold text-orange-800 dark:text-orange-300 text-sm mb-1">
            Pesan Komandan Insiden:
          </h4>
          <p className="text-sm text-orange-700 dark:text-orange-200 italic">
            "Mohon jangan buat tiket baru. Teknisi sedang meluncur. ETA 2 Jam."
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: CHAT */}
      <div className="lg:col-span-2">
        <ChatPanel role="admin_opd" />
      </div>
    </div>
  );
};

export default ParticipantView;
