import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiTool,
  FiClock,
  FiCheck,
  FiXCircle,
  FiChevronRight,
} from "react-icons/fi";

// Helper for icon and Status
const getStatusInfo = (status) => {
  switch (status) {
    case "Selesai":
      return {
        icon: <FiCheckCircle size={20} />,
        colorClass: "text-green-500",
      };
    case "Dikerjakan Teknisi":
      return {
        icon: <FiTool size={20} />,
        colorClass: "text-[#429EBD] dark:text-[#9FE7F5]",
      };
    case "Disetujui":
      return {
        icon: <FiCheck size={20} />,
        colorClass: "text-blue-500",
      };
    case "Ditolak":
      return {
        icon: <FiXCircle size={20} />,
        colorClass: "text-red-500",
      };
    case "Pending":
    default:
      return {
        icon: <FiClock size={20} />,
        colorClass: "text-slate-500",
      };
  }
};

const TicketStatusCard = ({ ticket }) => {
  const isComplaint = ticket.type === "Pengaduan";
  const badgeClass = isComplaint
    ? "bg-[#F7AD19]/20 text-[#F7AD19]"
    : "bg-[#429EBD]/20 text-[#429EBD]";

  const statusInfo = getStatusInfo(ticket.status);

  return (
    <Link
      to={`/track-ticket/${ticket.id}`}
      className="block bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:border-slate-300 dark:hover:border-[#429EBD] cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
          >
            {ticket.type}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {ticket.title}
          </h3>
        </div>

        <div className="mt-3 sm:mt-0 sm:text-right flex-shrink-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nomor Tiket
          </p>
          <p className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            {ticket.id}
          </p>
        </div>
      </div>

      <hr className="my-4 border-slate-200 dark:border-slate-700" />

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:justify-between sm:items-center">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Status Terkini
          </p>
          <div
            className={`flex items-center gap-3 mt-1 ${statusInfo.colorClass}`}
          >
            {statusInfo.icon}
            <span className="font-bold text-lg">{ticket.status}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Diperbarui
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {format(new Date(ticket.updatedAt), "dd MMMM yyyy, HH:mm")}
          </p>
        </div>

        <div className="self-end">
          <FiChevronRight
            size={24}
            className="text-slate-400 dark:text-slate-600"
          />
        </div>
      </div>
    </Link>
  );
};

export default TicketStatusCard;
