// src/features/tickets/components/StatusBadge.jsx
import React from "react";
import {
  FiCheckCircle,
  FiTool,
  FiClock,
  FiCheck,
  FiXCircle,
  FiInbox,
  FiSearch,
  FiClipboard,
  FiRotateCcw,
  FiAlertCircle,
} from "react-icons/fi";

const getStatusInfo = (status, stage) => {
  const safeStatus = status ? status.toLowerCase() : "";
  const safeStage = stage ? stage.toLowerCase() : "";

  // 1. OPEN / TRIASE -> "Baru Masuk"
  if (safeStatus === "open") {
    return {
      icon: FiInbox,
      label: "Baru Masuk",
      className:
        "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    };
  }

  // 2. REJECTED -> "Ditolak"
  if (safeStatus === "rejected") {
    return {
      icon: FiXCircle,
      label: "Ditolak",
      className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };
  }

  // 3. ASSIGNED
  if (safeStatus === "assigned") {
    // stage: verification -> "Ditugaskan"
    if (safeStage === "verification") {
      return {
        icon: FiClipboard,
        label: "Ditugaskan",
        className:
          "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
      };
    }
    // stage: revision -> "Revisi / Ditolak Atasan"
    if (safeStage === "revision") {
      return {
        icon: FiRotateCcw,
        label: "Revisi / Ditolak Atasan",
        className:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
      };
    }
  }

  // 4. PENDING_APPROVAL
  if (safeStatus === "pending_approval") {
    // stage: approval_seksi -> "Menunggu Aprv. Seksi"
    if (safeStage === "approval_seksi") {
      return {
        icon: FiClock,
        label: "Menunggu Aprv. Seksi",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      };
    }
    // stage: approval_bidang -> "Menunggu Aprv. Bidang"
    if (safeStage === "approval_bidang") {
      return {
        icon: FiClock,
        label: "Menunggu Aprv. Bidang",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      };
    }
  }

  // 5. IN_PROGRESS
  if (safeStatus === "in_progress") {
    // stage: analysis -> "Perlu Analisa"
    if (safeStage === "analysis") {
      return {
        icon: FiSearch,
        label: "Perlu Analisa",
        className:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      };
    }
    // stage: ready_to_execute -> "Disetujui"
    if (safeStage === "ready_to_execute") {
      return {
        icon: FiCheck,
        label: "Disetujui",
        className:
          "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
      };
    }
    // stage: execution -> "Sedang Dikerjakan"
    if (safeStage === "execution") {
      return {
        icon: FiTool,
        label: "Sedang Dikerjakan",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      };
    }
  }

  // 6. RESOLVED -> "Selesai"
  if (safeStatus === "resolved" || safeStatus === "closed") {
    return {
      icon: FiCheckCircle,
      label: "Selesai",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    };
  }

  return {
    icon: FiAlertCircle,
    label: `${status} (${stage || "-"})`,
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
};

const StatusBadge = ({
  status,
  stage,
  isFullWidth = false,
  isIncreaseFont = false,
}) => {
  const { icon: Icon, label, className } = getStatusInfo(status, stage);

  return (
    <span
      className={`inline-flex items-center gap-2 px-6 py-2 ${
        isFullWidth ? "w-full" : ""
      } ${
        isIncreaseFont ? "text-base" : "text-sm"
      } justify-center rounded-full font-medium ${className}`}
    >
      <Icon size={isIncreaseFont ? 20 : 16} />
      {label}
    </span>
  );
};

export default StatusBadge;
