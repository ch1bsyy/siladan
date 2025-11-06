// src/features/tickets/components/StatusBadge.jsx
import React from "react";
import {
  FiCheckCircle,
  FiTool,
  FiClock,
  FiCheck,
  FiXCircle,
} from "react-icons/fi";

const getStatusInfo = (status) => {
  switch (status) {
    case "Selesai":
      return {
        icon: FiCheckCircle,
        label: "Selesai",
        className:
          "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300",
      };
    case "Diproses":
    case "Dikerjakan Teknisi":
      return {
        icon: FiTool,
        label: "Diproses",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
      };
    case "Disetujui":
      return {
        icon: FiCheck,
        label: "Disetujui",
        className:
          "bg-cyan-100 text-cyan-700 dark:bg-cyan-700/30 dark:text-cyan-300",
      };
    case "Ditolak":
      return {
        icon: FiXCircle,
        label: "Ditolak",
        className:
          "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300",
      };
    case "Menunggu":
    case "Pending":
    default:
      return {
        icon: FiClock,
        label: "Menunggu",
        className:
          "bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300",
      };
  }
};

const StatusBadge = ({ status }) => {
  const { icon: Icon, label, className } = getStatusInfo(status);

  return (
    <span
      className={`inline-flex items-center gap-2 px-6 py-2 w-full justify-center rounded-full text-sm font-medium ${className}`}
    >
      <Icon size={16} />
      {label}
    </span>
  );
};

export default StatusBadge;
