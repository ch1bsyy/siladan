import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiHelpCircle, FiEye } from "react-icons/fi";
import Input from "../../../components/Input";
import FormTextArea from "../../../components/FormTextArea";

const FAQModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Umum",
    status: "published",
  });

  // Load data if edit mode
  useEffect(() => {
    if (data) {
      // Hapus properti extra yang tidak perlu
      setFormData({
        question: data.question,
        answer: data.answer,
        status: data.status,
      });
    } else {
      setFormData({
        question: "",
        answer: "",
        status: "published",
      });
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        {/* Header */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FiHelpCircle size={18} className="text-[#F7AD19]" />{" "}
            {data ? "Edit FAQ" : "Tambah FAQ Baru"}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center min-h-11 min-w-11 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            id="question"
            label="Pertanyaan (Judul)"
            placeholder="Contoh: Bagaimana cara reset password?"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            required
          />

          <FormTextArea
            id="answer"
            label="Jawaban / Solusi"
            placeholder="Jelaskan langkah penyelesaian secara singkat..."
            rows={5}
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            required
          />

          {/* Status Switch */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <FiEye size={18} className="text-slate-500 dark:text-slate-400" />
              <span className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300">
                Status Publikasi
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.status === "published"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked ? "published" : "draft",
                  })
                }
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
              <span className="ml-3 text-xs font-bold text-slate-600 dark:text-slate-400 min-w-[60px]">
                {formData.status === "published" ? "TAYANG" : "DRAFT"}
              </span>
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 flex items-center justify-center min-h-11 min-w-11 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 font-medium text-sm md:text-base transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#053F5C] text-white font-bold text-sm md:text-base hover:bg-[#075075] transition-transform active:scale-95 shadow-md flex justify-center items-center gap-2 cursor-pointer"
            >
              <FiSave size={18} /> Simpan FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQModal;
