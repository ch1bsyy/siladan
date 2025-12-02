import React from "react";
import { FiPauseCircle, FiPlayCircle, FiAlertCircle } from "react-icons/fi";

const OperationalStatusWidget = () => {
  // Simulasi Status Real-time (Di real app, ini dari backend/helper logic)
  // status: 'active' | 'break' | 'off'
  const currentStatus = "active";

  const statusConfig = {
    active: {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: FiPlayCircle,
      title: "OPERASIONAL AKTIF",
      desc: "SLA Tiket sedang berjalan (ticking).",
    },
    break: {
      color:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: FiPauseCircle,
      title: "JAM ISTIRAHAT",
      desc: "SLA dijeda sementara hingga pukul 13:00.",
    },
    off: {
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: FiAlertCircle,
      title: "DILUAR JAM KERJA",
      desc: "Perhitungan SLA sedang dijeda (Pause).",
    },
  };

  const { color, icon: Icon, title, desc } = statusConfig[currentStatus];

  return (
    <div
      className={`p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 shadow-sm ${color}`}
    >
      <div className="p-3 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm">
        <Icon size={32} />
      </div>
      <div className="text-center md:text-left">
        <h3 className="font-black text-lg tracking-wider">{title}</h3>
        <p className="text-sm font-medium opacity-90">{desc}</p>
      </div>
      <div className="ml-auto hidden sm:block text-right">
        <p className="text-xs uppercase font-bold opacity-70">Waktu Server</p>
        <p className="text-xl font-mono font-bold">
          {new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          WIB
        </p>
      </div>
    </div>
  );
};

export default OperationalStatusWidget;
