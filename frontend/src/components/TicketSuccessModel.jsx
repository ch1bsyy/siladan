import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiCopy, FiX, FiCheck } from "react-icons/fi";

const TicketSuccessModel = ({
  isOpen,
  onClose,
  ticketId,
  title = "Laporan Diterima!",
  subTitle = "Terima kasih telah melapor. Laporan Anda telah masuk ke sistem dengan nomor tiket:",
  footerMessage = "* Silakan simpan nomor tiket ini untuk mengecek status penanganan melalui menu Lacak Tiket.",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketId);

      setIsCopied(true);
      toast.success("Nomor tiket berhasil disalin!", { id: "clipboard-toast" });

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Gagal copy:", err);
      toast.error("Gagal menyalin otomatis. Silakan salin manual.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transform transition-all sm:max-w-md w-full p-6 md:p-8 animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <FiX size={24} />
        </button>

        <div className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30">
            <FiCheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="text-2xl font-bold text-[#053F5C] dark:text-white">
            {title}
          </h3>

          <p className="text-slate-600 dark:text-slate-400">{subTitle}</p>

          <div className="mt-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex=1 text-left">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Nomor Tiket
              </p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-[#053F5C] dark:text-[#F7AD19]">
                {ticketId || "Wait..."}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className={`p-3 rounded-lg border shadow-sm transition-all group ${
                isCopied
                  ? "bg-green-100 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-800 dark:text-green-400"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-[#F7AD19] hover:text-[#F7AD19] text-slate-600 dark:text-slate-300"
              }`}
              title="Salin Nomor Tiket"
            >
              {isCopied ? (
                <FiCheck size={20} className="scale-110" />
              ) : (
                <FiCopy
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              )}
            </button>
          </div>

          <p className="text-sm text-slate-400 dark:text-slate-500">
            {footerMessage}
          </p>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-[#053F5C] bg-[#F7AD19] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all shadow-lg"
            >
              Mengerti, Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSuccessModel;
