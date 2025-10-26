import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { useLoading } from "../context/LoadingContext";
import {
  FiCheckCircle,
  FiTool,
  FiClock,
  FiCheck,
  FiXCircle,
  FiArrowLeft,
  FiMessageSquare,
} from "react-icons/fi";

// Mock Ticket Data
const mockAllTickets = [
  {
    id: "REQ-001",
    title: "Permintaan Instalasi Microsoft Office",
    type: "Permintaan",
    status: "Selesai",
    createdAt: "2025-10-19T09:00:00Z",
    updatedAt: "2025-10-20T14:00:00Z",
    pelapor: { name: "Pegawai A", email: "pegawai.a@opd.go.id" },
    deskripsi: "Butuh instalasi Office 365 di komputer baru ruang arsip.",
    history: [
      { status: "Diajukan", date: "2025-10-19T09:00:00Z", by: "Pegawai A" },
      { status: "Disetujui", date: "2025-10-19T11:00:00Z", by: "Seksi" },
      { status: "Selesai", date: "2025-10-20T14:00:00Z", by: "Teknisi Budi" },
    ],
  },
  {
    id: "SILADAN-123",
    title: "Printer di Ruang A Rusak",
    type: "Pengaduan",
    status: "Sedang Diproses",
    createdAt: "2025-10-24T09:00:00Z",
    updatedAt: "2025-10-25T10:30:00Z",
    pelapor: { name: "Warga B", email: "user@mail.com" },
    deskripsi: "Printer tidak bisa mencetak, lampu indikator berkedip merah.",
    history: [
      { status: "Diajukan", date: "2025-10-24T09:00:00Z", by: "Warga B" },
      {
        status: "Diverifikasi Seksi",
        date: "2025-10-24T11:00:00Z",
        by: "Seksi",
      },
      {
        status: "Sedang Diproses",
        date: "2025-10-25T10:30:00Z",
        by: "Teknisi Budi",
      },
    ],
  },
];

// Helper for icon and Status {move to Utility}
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

const TicketDetailPage = () => {
  const { ticketId } = useParams(); // Take ID From URL
  const [ticket, setTicket] = useState(null);
  const { isLoading, showLoading, hideLoading } = useLoading();

  // Fetch Data Simulation
  useEffect(() => {
    showLoading("Memuat detail tiket...");
    const foundTicket = mockAllTickets.find((t) => t.id === ticketId);

    setTimeout(() => {
      setTicket(foundTicket);
      hideLoading();
    }, 500);

    // Cleanup function
    return () => hideLoading();
  }, [ticketId, showLoading, hideLoading]);

  if (isLoading) {
    return null;
  }

  if (!ticket) {
    return (
      <div className="text-center py-20 dark:text-white">
        Tiket tidak ditemukan.
      </div>
    );
  }

  const statusInfo = getStatusInfo(ticket.status);

  const isRequest = ticket.type === "Permintaan";
  const applicantLabel = isRequest ? "Pemohon" : "Pelapor";

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/track-ticket"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#053F5C] dark:hover:text-white mb-6"
        >
          <FiArrowLeft />
          <span>Kembali ke Daftar Tiket</span>
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header Detail Ticket */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {ticket.type} #{ticket.id}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#053F5C] dark:text-white mt-1">
              {ticket.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Main Column {history and Desc} */}
            <div className="md:col-span-2 p-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Riwayat Status
              </h2>
              <ol className="relative border-l border-slate-200 dark:border-slate-700 ml-2">
                {ticket.history.map((item, index) => (
                  <li key={index} className="mb-6 ml-4">
                    <div className="absolute w-3 h-3 bg-slate-200 rounded-full -left-1.5 border border-white dark:border-slate-800 dark:bg-slate-600"></div>
                    <time className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {format(new Date(item.date), "dd MMMM yyyy, HH:mm")}
                    </time>
                    <h3 className="text-lg font-semibold texxt-slate-900 dark:text-white">
                      {item.status}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Oleh: {item.by}
                    </p>
                  </li>
                ))}
              </ol>

              <hr className="my-6 border-slate-200 dark:border-slate-700" />

              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Deskripsi
              </h2>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {ticket.deskripsi}
              </p>
            </div>

            {/* Side Column (Info) */}
            <div className="md:col-span-1 p-6 bg-slate-50 dark:bg-slate-800/50 md:border-l border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Informasi Tiket
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Status Terkini
                  </p>
                  <div
                    className={`flex items-center gap-2 mt-1 ${statusInfo.colorClass}`}
                  >
                    {statusInfo.icon}
                    <span className="font-bold text-lg">{ticket.status}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {applicantLabel}
                  </p>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {ticket.pelapor.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Email {applicantLabel}
                  </p>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {ticket.pelapor.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Dibuat Tanggal
                  </p>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {format(new Date(ticket.createdAt), "dd MMMM yyyy")}
                  </p>
                </div>

                {/* Section Finished Ticket */}
                {ticket.status === "Selesai" && (
                  <div className="pt-4">
                    <button className="w-full min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C] transition-colors">
                      <FiMessageSquare size={18} />
                      <span>Beri Ulasan Kepuasan</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
