import React from "react";
import { Link } from "react-router-dom";
import { format, isPast, differenceInHours } from "date-fns";
import { id as localeId } from "date-fns/locale";
import StatusBadge from "./StatusBadge";
import {
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiMinusCircle,
} from "react-icons/fi";

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "High":
      return " bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
    case "Medium":
      return " bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    default:
      return " bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate600";
  }
};

const SLADisplay = ({ sla, status }) => {
  // 1. Status Selesai/Tutup
  if (
    [
      "Selesai",
      "Ditolak",
      "Ditutup",
      "resolved",
      "closed",
      "rejected",
    ].includes(status)
  ) {
    return (
      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
        <FiCheckCircle size={14} />
        <span className="text-xs font-medium">Terselesaikan</span>
      </div>
    );
  }

  // 2. Status "Belum Dimulai" (Logika Anda: SLA baru jalan saat dikerjakan)
  // Masukkan status-status sebelum "Sedang Dikerjakan"
  const preWorkStatuses = [
    "Ditugaskan", // UI Status
    "assigned", // Backend Status
    "Perlu Analisa",
    "Menunggu Approval Atasan",
    "Menunggu Aprv. Seksi",
    "Menunggu Aprv. Bidang",
    "Menunggu",
    "Pending",
    "Disetujui",
    "Baru Masuk",
    "open",
  ];

  if (preWorkStatuses.includes(status)) {
    return (
      <div className="flex flex-col">
        {/* Tampilkan indikator "Belum Dimulai" */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-0.5">
          <FiMinusCircle size={14} />
          <span className="text-xs italic font-medium">Belum Dimulai</span>
        </div>
        {/* Opsional: Tetap tampilkan target SLA jika ada, tapi warnanya abu-abu (tidak mendesak) */}
        {sla && (
          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            Target: {format(new Date(sla), "dd MMM", { locale: localeId })}
          </div>
        )}
      </div>
    );
  }

  // 3. Status "Sedang Dikerjakan" (SLA Aktif / Running)
  if (!sla) return <span className="text-xs text-slate-400">-</span>;

  const slaDate = new Date(sla);
  const isOverdue = isPast(slaDate);
  const hoursLeft = differenceInHours(slaDate, new Date());
  const isUrgent = !isOverdue && hoursLeft < 24;

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-1.5 text-xs font-bold mb-0.5 ${
          isOverdue
            ? "text-red-600 dark:text-red-400"
            : isUrgent
            ? "text-orange-600 dark:text-orange-400"
            : "text-blue-600 dark:text-blue-400"
        }`}
      >
        {isOverdue ? (
          <>
            <FiAlertCircle size={14} />
            <span>Lewat Jatuh Tempo</span>
          </>
        ) : (
          <>
            <FiClock size={14} />
            <span>{isUrgent ? "Segera Habis" : "Sedang Berjalan"}</span>
          </>
        )}
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300 font-mono">
        {format(slaDate, "dd MMM, HH:mm", { locale: localeId })}
      </div>
    </div>
  );
};

const AssignedTicketTable = ({ tickets }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-base font-semibold text-slate-600 dark:text-slate-300">
                No.Tiket
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-slate-600 dark:text-slate-300">
                Judul Tiket
              </th>
              <th className="px-6 py-4 text-center text-base font-semibold text-slate-600 dark:text-slate-300">
                Status
              </th>
              <th className="px-6 py-4 text-center text-base font-semibold text-slate-600 dark:text-slate-300">
                Prioritas
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-slate-600 dark:text-slate-300">
                Status SLA
              </th>
              <th className="px-6 py-4 text-center text-base font-semibold text-slate-600 dark:text-slate-300">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white max-w-[250px] truncate">
                      {ticket.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {ticket.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={ticket.status} stage={ticket.stage} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <SLADisplay
                      sla={ticket.sla}
                      status={ticket.uiStatus || ticket.status}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/dashboard/detail-assigned-ticket/${ticket.dbId}`}
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-black bg-[#F7AD19] hover:bg-yellow-500 rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic"
                >
                  Tidak ditemukan tiket yang perlu dikerjakan saat ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedTicketTable;
