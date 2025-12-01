import React, { useState, useEffect } from "react";
import { FiX, FiClock, FiAlertCircle, FiSave } from "react-icons/fi";
import FormTextArea from "../../../components/FormTextArea";

const EditSLAModal = ({ isOpen, onClose, slaData, onSave }) => {
  const [mttrHours, setMttrHours] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (slaData) {
      setMttrHours(slaData.mttr);
      setDescription(slaData.description);
    }
  }, [slaData]);

  if (!isOpen || !slaData) return null;

  // Logic Simple Simulation (1 Work days = 8 hours)
  const workingDays = parseFloat(mttrHours) / 8;

  // Format teks estimation
  let daysText = "";
  if (!mttrHours || isNaN(workingDays)) {
    daysText = "-";
  } else if (workingDays < 1) {
    daysText = "Kurang dari 1 Hari Kerja";
  } else if (Number.isInteger(workingDays)) {
    daysText = `${workingDays} Hari Kerja Full`;
  } else {
    daysText = `± ${workingDays.toFixed(1)} Hari Kerja`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...slaData,
      mttr: parseInt(mttrHours),
      description: description,
    });
  };

  const getPriorityColor = (prio) => {
    switch (prio) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-slate-200 text-slate-700 border-slate-200";
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
        <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FiClock className="text-[#F7AD19]" /> Edit SLA
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 min-h-11 min-w-11 flex items-center justify-center hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Priority Info */}
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-400">
              Level Prioritas
            </span>
            <span
              className={`px-3 py-1 rounded border text-sm font-bold ${getPriorityColor(
                slaData.priority
              )}`}
            >
              {slaData.priority}
            </span>
          </div>

          {/* MTTR Input */}
          <div>
            <label className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
              Target Waktu Penyelesaian (MTTR)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                className="w-full pl-4 pr-16 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#053F5C] dark:text-white text-lg font-mono font-bold outline-none transition-all"
                value={mttrHours}
                onChange={(e) => setMttrHours(e.target.value)}
                required
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 text-sm font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Jam
              </span>
            </div>

            {/* Helper Text */}
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800 flex items-start gap-2">
              <FiAlertCircle
                size={18}
                className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400"
              />
              <div>
                <p className="font-bold mb-1">Estimasi: {daysText}</p>
                <p className="text-xs md:text-[13px] opacity-90 leading-relaxed">
                  Contoh: Jika tiket masuk <strong>Senin 09:00</strong>, batas
                  waktu penyelesaian adalah
                  <strong>
                    {" "}
                    {workingDays > 1
                      ? `hari ${
                          ["Rabu", "Kamis", "Jumat"][
                            Math.min(Math.floor(workingDays) - 1, 2)
                          ] || "berikutnya"
                        }`
                      : "hari yang sama"}{" "}
                  </strong>
                  (mengikuti jam operasional).
                </p>
              </div>
            </div>
          </div>

          {/* Description Input */}
          <FormTextArea
            id="desc"
            name="desc"
            label="Keterangan / Deskripsi SLA"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Jelaskan kriteria tiket untuk prioritas ini..."
          />

          {/* Footer Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 min-h-11 min-w-11 flex items-center justify-center cursor-pointer rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 font-medium transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 min-h-11 min-w-11 flex items-center justify-center cursor-pointer rounded-lg bg-[#053F5C] text-white font-bold hover:bg-[#075075] transition-transform active:scale-95 shadow-md gap-2 text-sm"
            >
              <FiSave size={18} /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSLAModal;
