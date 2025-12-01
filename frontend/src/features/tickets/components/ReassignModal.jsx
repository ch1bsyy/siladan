import React, { useState } from "react";
import { FiX, FiUserCheck, FiBriefcase } from "react-icons/fi";
import FormSelect from "../../../components/FormSelect";
import FormTextArea from "../../../components/FormTextArea";

// Mock Data Teknisi with workload status (smart feature)
const mockTechnicians = [
  {
    id: 1,
    name: "Teknisi Budi",
    workload: 2,
    status: "available",
    role: "Jaringan",
  },
  { id: 2, name: "Teknisi Ani", workload: 8, status: "busy", role: "Hardware" },
  {
    id: 3,
    name: "Teknisi Charlie",
    workload: 5,
    status: "moderate",
    role: "Software",
  },
  {
    id: 4,
    name: "Teknisi Dedi",
    workload: 0,
    status: "available",
    role: "Jaringan",
  },
];

const ReassignModal = ({ isOpen, onClose, currentTechName, onConfirm }) => {
  const [selectedTech, setSelectedTech] = useState("");
  const [reason, setReason] = useState("");
  const [changePriority, setChangePriority] = useState(false);
  const [newPriority, setNewPriority] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      newTechnicianId: selectedTech,
      reason: reason,
      newPriority: changePriority ? newPriority : null,
    });

    setSelectedTech("");
    setReason("");
    setChangePriority(false);
  };

  // Helper for color workload teknisi
  const getWorkloadColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FiUserCheck className="text-[#F7AD19]" /> Eskalasi / Alihkan Tugas
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {/* Info Prev Teknisi */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              Teknisi Saat Ini:
            </p>
            <p className="font-semibold text-slate-800 dark:text-white">
              {currentTechName || "Belum Ditentukan"}
            </p>
          </div>

          {/* Choose New Teknisi */}
          <div>
            <label className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
              Pilih Teknisi Baru <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 max-h-30 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2 scrollbar-thin">
              {mockTechnicians.map((tech) => (
                <label
                  key={tech.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    selectedTech == tech.id
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="tech"
                      value={tech.id}
                      onChange={(e) => setSelectedTech(e.target.value)}
                      className="accent-[#053F5C]"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {tech.name}
                      </p>
                      <p className="text-xs text-slate-500">{tech.role}</p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    title={`${tech.workload} Tiket Aktif`}
                  >
                    <span className="text-xs font-mono text-slate-500">
                      {tech.workload} Task
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${getWorkloadColor(
                        tech.status
                      )}`}
                    ></span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Opsi Change Priority */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="changePrio"
              checked={changePriority}
              onChange={(e) => setChangePriority(e.target.checked)}
              className="rounded border-slate-300 text-[#053F5C] focus:ring-[#053F5C]"
            />
            <label
              htmlFor="changePrio"
              className="text-sm text-slate-700 dark:text-slate-300 select-none"
            >
              Ubah Prioritas (Eskalasi Urgency)
            </label>
          </div>

          {changePriority && (
            <div>
              <FormSelect
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                required={changePriority}
              >
                <option value="">-- Pilih Prioritas Baru --</option>
                <option value="Critical">Critical (Sangat Tinggi)</option>
                <option value="High">High (Tinggi)</option>
                <option value="Medium">Medium (Sedang)</option>
              </FormSelect>
            </div>
          )}

          {/* Reason (Mandatory) */}
          <FormTextArea
            label="Alasan Pengalihan"
            placeholder="Contoh: Teknisi sebelumnya sakit, Eskalasi manajerial, dll."
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 min-h-11 min-w-11 cursor-pointer rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 font-medium text-sm md:text-base transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedTech || !reason}
              className="px-6 py-2 min-h-11 min-w-11 cursor-pointer rounded-lg bg-[#F7AD19] text-[#053F5C] font-bold text-sm md:text-base hover:bg-yellow-400 transition-transform active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiBriefcase size={18} /> Alihkan Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReassignModal;
