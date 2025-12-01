import React, { useState } from "react";
import { FiCheckSquare, FiUserPlus } from "react-icons/fi";
import { LuShieldAlert } from "react-icons/lu";
import ChatPanel from "./ChatPanel";

const affectedOpds = [
  { name: "Dispendukcapil", status: "down" },
  { name: "Dinas Kominfo", status: "safe" },
  { name: "Bappeda", status: "impacted" },
  { name: "Dinas Kesehatan", status: "safe" },
  { name: "Kecamatan Rungkut", status: "down" },
];

const sopChecklist = [
  { id: 1, task: "Verifikasi laporan awal (Minimal 5 OPD)", done: true },
  { id: 2, task: "Kontak Vendor ISP / Tim Infra", done: true },
  { id: 3, task: "Identifikasi titik putus kabel", done: false },
  { id: 4, task: "Buat Pengumuman Publik (Status Page)", done: false },
  { id: 5, task: "Update Estimasi Waktu (ETA) ke OPD", done: false },
];

const CommanderView = () => {
  const [checklist, setChecklist] = useState(sopChecklist);

  const toggleCheck = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const getStatusColor = (status) => {
    if (status === "down") return "bg-red-500";
    if (status === "impacted") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
      {/* LEFT COLUMN: COMMAND CENTER */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <LuShieldAlert className="text-red-600" /> Dampak Insiden
        </h3>

        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg mb-4">
          <p className="text-xs text-slate-500 mb-1">Tiket Induk</p>
          <p className="font-mono font-bold text-[#053F5C] dark:text-white">
            #INC-MASTER-001
          </p>
          <p className="text-sm font-medium mt-1">
            Kabel FO Putus Area Selatan
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {affectedOpds.map((opd, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded border border-slate-100 dark:border-slate-700"
            >
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {opd.name}
              </span>
              <span
                className={`w-3 h-3 rounded-full ${getStatusColor(
                  opd.status
                )} shadow-sm`}
              ></span>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 hover:text-[#053F5C] hover:border-[#053F5C] transition-colors text-sm font-bold flex items-center justify-center gap-2">
          <FiUserPlus size={16} /> Panggil OPD Lain
        </button>
      </div>

      {/* MIDDLE COLUMN: CHAT */}
      <div className="lg:col-span-2">
        <ChatPanel role="admin_kota" />
      </div>

      {/* RIGHT COLUMN: SOP */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <FiCheckSquare className="text-[#F7AD19]" /> Prosedur SOP
        </h3>
        <div className="space-y-3">
          {checklist.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                item.done
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20"
                  : "bg-slate-50 border-slate-100 hover:bg-white dark:bg-slate-900/30"
              }`}
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleCheck(item.id)}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span
                className={`text-sm ${
                  item.done
                    ? "text-green-800 line-through decoration-green-500"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {item.task}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-xs text-yellow-800 dark:text-yellow-200 mb-2">
            *Pastikan semua SOP krusial terpenuhi sebelum menutup insiden.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommanderView;
