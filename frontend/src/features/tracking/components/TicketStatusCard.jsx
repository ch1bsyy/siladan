import React from "react";
import { format, isValid } from "date-fns";
import { Link } from "react-router-dom";
import { id as localeId } from "date-fns/locale";
import {
  FiCheckCircle,
  FiTool,
  FiClock,
  FiXCircle,
  FiChevronRight,
  FiInbox,
  FiClipboard,
  FiRotateCcw,
  FiSearch,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

// --- HELPER DATE FORMATTER (FIX TIMEZONE) ---
const formatDateSafe = (dateString, formatStr = "dd MMMM yyyy, HH:mm") => {
  if (!dateString) return "-";

  // Fix Timezone: If no any Z or +, asumption UTC and add Z
  let safeDateString = dateString;
  if (
    typeof dateString === "string" &&
    !dateString.endsWith("Z") &&
    !dateString.includes("+")
  ) {
    safeDateString += "Z";
  }

  const date = new Date(safeDateString);
  return isValid(date) ? format(date, formatStr, { locale: localeId }) : "-";
};

const getStatusConfig = (ticket) => {
  const safeStatus = ticket.status ? ticket.status.toLowerCase() : "";
  const safeStage = ticket.stage ? ticket.stage.toLowerCase() : "";

  // 1. OPEN -> Baru Masuk
  if (safeStatus === "open") {
    return {
      icon: <FiInbox size={20} />,
      colorClass: "text-slate-600 dark:text-slate-400",
      label: "Baru Masuk",
    };
  }

  // 2. REJECTED -> Ditolak
  if (safeStatus === "rejected") {
    return {
      icon: <FiXCircle size={20} />,
      colorClass: "text-red-600 dark:text-red-400",
      label: "Ditolak",
    };
  }

  // 3. ASSIGNED
  if (safeStatus === "assigned") {
    if (safeStage === "verification") {
      return {
        icon: <FiClipboard size={20} />,
        colorClass: "text-cyan-600 dark:text-cyan-400",
        label: "Ditugaskan (Verifikasi)",
      };
    }
    if (safeStage === "revision") {
      return {
        icon: <FiRotateCcw size={20} />,
        colorClass: "text-orange-600 dark:text-orange-400",
        label: "Revisi / Ditolak Atasan",
      };
    }
    // Fallback assigned
    return {
      icon: <FiClipboard size={20} />,
      colorClass: "text-cyan-600 dark:text-cyan-400",
      label: "Ditugaskan",
    };
  }

  // 4. PENDING_APPROVAL
  if (safeStatus === "pending_approval") {
    return {
      icon: <FiClock size={20} />,
      colorClass: "text-yellow-600 dark:text-yellow-400",
      label:
        safeStage === "approval_seksi"
          ? "Menunggu Aprv. Seksi"
          : safeStage === "approval_bidang"
          ? "Menunggu Aprv. Bidang"
          : "Menunggu Persetujuan",
    };
  }

  // 5. IN_PROGRESS
  if (safeStatus === "in_progress") {
    if (safeStage === "analysis") {
      return {
        icon: <FiSearch size={20} />,
        colorClass: "text-purple-600 dark:text-purple-400",
        label: "Perlu Analisa",
      };
    }
    if (safeStage === "ready_to_execute") {
      return {
        icon: <FiCheck size={20} />,
        colorClass: "text-indigo-600 dark:text-indigo-400",
        label: "Disetujui (Siap Dikerjakan)",
      };
    }
    // Execution / Default Progress
    return {
      icon: <FiTool size={20} />,
      colorClass: "text-[#429EBD] dark:text-[#429EBD]",
      label: "Sedang Dikerjakan",
    };
  }

  // 6. RESOLVED / CLOSED -> Selesai
  if (safeStatus === "resolved" || safeStatus === "closed") {
    return {
      icon: <FiCheckCircle size={20} />,
      colorClass: "text-green-600 dark:text-green-400",
      label: "Selesai",
    };
  }

  // Default / Unknown
  return {
    icon: <FiAlertCircle size={20} />,
    colorClass: "text-slate-500",
    label: `${ticket.status} (${ticket.stage || "-"})`,
  };
};

const TicketStatusCard = ({ ticket }) => {
  const typeLower = ticket.type ? ticket.type.toLowerCase() : "";
  const isComplaint = typeLower === "Pengaduan" || typeLower === "incident";

  const badgeClass = isComplaint
    ? "bg-[#F7AD19]/20 text-[#916610] dark:text-[#F7AD19]"
    : "bg-[#429EBD]/20 text-[#053F5C] dark:text-[#429EBD]";

  const statusInfo = getStatusConfig(ticket);

  const displayId = ticket.ticketNumber || ticket.id;

  return (
    <Link
      to={`/track-ticket/${ticket.id}`}
      state={{ ticketType: ticket.type }}
      className="block bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:border-slate-300 dark:hover:border-[#429EBD] cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <span
            className={`inline-block px-4 py-2 text-xs font-semibold rounded-full ${badgeClass}`}
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
            {displayId}
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
            <span className="font-bold text-lg">{statusInfo.label}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Diperbarui
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {ticket.updatedAt
              ? formatDateSafe(ticket.updatedAt, "dd MMMM yyyy, HH:mm")
              : "-"}
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
