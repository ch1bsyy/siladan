import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiMapPin,
  FiFileText,
  FiSend,
  FiPaperclip,
  FiCheckSquare,
  FiExternalLink,
  FiActivity,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";
import StatusBadge from "../features/tickets/components/StatusBadge";
import FormTextArea from "../components/FormTextArea";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const mockTicketsDatabase = [
  {
    id: "TK-0010",
    type: "Pengaduan",
    title: "Server Ruang Rapat Mati",
    status: "Ditugaskan",
    description: "Server tidak bisa diakses ping RTO dari lantai 2.",
    priority: "Critical",
    sla: "2025-11-20T15:00:00",
    pelapor: "Budi Santoso (Keuangan)",
    lokasi: "Gedung A, Lt 2",
    tglLapor: "2025-11-19 08:00",
    worklogs: [],
  },
  {
    id: "TK-0012",
    type: "Pengaduan",
    title: "Printer Macet",
    status: "Diproses",
    description: "Kertas nyangkut terus.",
    priority: "Medium",
    sla: "2025-11-22T17:00:00",
    pelapor: "Siti Aminah (Umum)",
    lokasi: "Gedung B, Lt 1",
    tglLapor: "2025-11-19 09:00",
    worklogs: [
      {
        date: "2025-11-19T10:00:00",
        activity: "Mengecek kondisi printer fisik.",
        user: "Teknisi Anda",
      },
    ],
  },
  {
    id: "REQ-0055",
    type: "Permintaan",
    title: "Permintaan Akses VPN",
    status: "Analisa",
    description: "Butuh akses VPN untuk WFH.",
    priority: "High",
    sla: "2025-11-21T10:00:00",
    pelapor: "Andi (IT)",
    lokasi: "Remote",
    tglLapor: "2025-11-18 14:00",
    isChangeRequest: true,
    worklogs: [],
  },
];

const AssignedTicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const [ticket, setTicket] = useState(null);
  const [newLog, setNewLog] = useState("");

  // Simulasi Fetch Data by ID
  useEffect(() => {
    showLoading("Memuat detail tiket...");
    setTimeout(() => {
      const found = mockTicketsDatabase.find((t) => t.id === ticketId);
      setTicket(found);
      hideLoading();
    }, 600);
  }, [ticketId, showLoading, hideLoading]);

  if (!ticket) return null;

  // --- LOGIC ACTIONS ---

  // (Assigned -> Diproses)
  const handleStartProgress = () => {
    const confirm = window.confirm(
      "Mulai kerjakan tiket ini? SLA Response Time akan tercatat."
    );
    if (confirm) {
      // API Call Update Status here
      setTicket((prev) => ({
        ...prev,
        status: "Diproses",
        worklogs: [
          ...prev.worklogs,
          {
            date: new Date().toISOString(),
            activity: "Memulai pengerjaan tiket (Status: In Progress)",
            user: "Teknisi Anda",
          },
        ],
      }));
    }
  };

  // Add Worklog
  const handleSubmitLog = (e) => {
    e.preventDefault();
    if (!newLog.trim()) return;

    const newEntry = {
      date: new Date().toISOString(),
      activity: newLog,
      user: "Teknisi Anda",
    };

    // API Call Add Log here
    setTicket((prev) => ({
      ...prev,
      worklogs: [newEntry, ...prev.worklogs], // Add to top
    }));
    setNewLog("");
  };

  // (Diproses -> Selesai)
  const handleResolve = () => {
    const note = prompt("Masukkan catatan penyelesaian akhir:");
    if (note) {
      setTicket((prev) => ({
        ...prev,
        status: "Selesai",
        worklogs: [
          {
            date: new Date().toISOString(),
            activity: `Tiket diselesaikan: ${note}`,
            user: "Teknisi Anda",
          },
          ...prev.worklogs,
        ],
      }));
      alert("Tiket berhasil diselesaikan!");
      navigate("/dashboard/assigned-tickets");
    }
  };

  const isChangeReq =
    ticket.isChangeRequest ||
    ticket.status === "Analisa" ||
    ticket.status.includes("Approval");
  const canWork = ticket.status === "Diproses";
  const isNew = ticket.status === "Ditugaskan";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* --- HEADER NAVIGATION --- */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/assigned-tickets"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#053F5C] dark:hover:text-white transition-colors"
        >
          <FiArrowLeft size={20} />
          <span className="font-medium">Kembali ke Daftar Tiket</span>
        </Link>
        <div className="text-sm text-slate-500">
          ID Tiket: <span className="font-mono font-bold">{ticket.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN: MAIN DETAIL --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* CARD HEADER TIKET */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden">
            {/* Status Stripe */}
            <div
              className={`absolute top-0 left-0 w-1 h-full ${
                ticket.priority === "Critical"
                  ? "bg-red-500"
                  : ticket.priority === "High"
                  ? "bg-orange-500"
                  : "bg-blue-500"
              }`}
            ></div>

            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-2 text-xs font-bold rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {ticket.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    {ticket.tglLapor}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {ticket.title}
                </h1>
              </div>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                <FiFileText /> Deskripsi Masalah
              </h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {ticket.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <FiUser className="text-[#053F5C] dark:text-white" />{" "}
                {ticket.pelapor}
              </div>
              <div className="flex items-center gap-1.5">
                <FiMapPin className="text-[#053F5C] dark:text-white" />{" "}
                {ticket.lokasi}
              </div>
            </div>
          </div>

          {/* --- (WORKLOG / ACTION) --- */}

          {/* SKENARIO 1: NEW TICKET (Ditugaskan) */}
          {isNew && !isChangeReq && (
            <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-1">
                  Tiket Baru Ditugaskan
                </h3>
                <p className="text-blue-800 dark:text-blue-400 text-sm">
                  Klik tombol untuk mulai mengerjakan dan menjalankan SLA.
                </p>
              </div>
              <button
                onClick={handleStartProgress}
                className="px-6 py-3 bg-[#053F5C] hover:bg-[#075075] text-white font-semibold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <FiCheckSquare size={20} /> Mulai Kerjakan
              </button>
            </div>
          )}

          {/* SKENARIO 2: ON PROGRESS (Worklog) */}
          {canWork && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FiActivity className="text-[#F7AD19]" /> Aktivitas Pengerjaan
                  (Worklog)
                </h3>
                <button
                  onClick={handleResolve}
                  className="text-sm px-4 min-h-[44px] min-w-[44px] py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium transition-colors flex gap-2 items-center justify-center cursor-pointer"
                >
                  <FiCheck size={20} /> Selesaikan Tiket
                </button>
              </div>

              {/* Form Input Worklog */}
              <form
                onSubmit={handleSubmitLog}
                className="mb-8 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <FormTextArea
                  id="worklog"
                  label="Tambah Catatan Aktivitas"
                  placeholder="Contoh: Mengganti kabel LAN, melakukan testing koneksi..."
                  rows={3}
                  value={newLog}
                  onChange={(e) => setNewLog(e.target.value)}
                />
                <div className="flex justify-between items-center mt-3">
                  <button
                    type="button"
                    className="text-slate-500 hover:text-[#053F5C] dark:hover:text-white text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <FiPaperclip /> Lampirkan Foto
                  </button>
                  <button
                    type="submit"
                    disabled={!newLog.trim()}
                    className="px-4 py-2 min-h-[44px] min-w-[44px] bg-[#053F5C] text-white rounded-md font-medium text-sm hover:bg-[#064a6b] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FiSend size={16} /> Simpan Log
                  </button>
                </div>
              </form>

              {/* Timeline History */}
              <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
                {ticket.worklogs.length > 0 ? (
                  ticket.worklogs.map((log, idx) => (
                    <div key={idx} className="relative pl-8">
                      <span className="absolute -left-[9px] top-0 bg-white dark:bg-slate-800 w-4 h-4 rounded-full border-2 border-[#F7AD19]"></span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base">
                          {log.user}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
                          {format(new Date(log.date), "dd MMM yyyy, HH:mm", {
                            locale: localeId,
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg inline-block">
                        {log.activity}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="pl-8 text-slate-400 text-sm md:text-base italic">
                    Belum ada aktivitas tercatat.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SKENARIO 3: NEED CHANGE MANAGEMENT */}
          {isChangeReq && (
            <div className="bg-gradient-to-r from-[#053F5C] to-[#2b6cb0] rounded-xl shadow-lg p-8 text-white text-center">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <FiExternalLink size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Pengelolaan di Aplikasi Change
              </h2>
              <p className="text-blue-100 mb-6 text-sm max-w-md mx-auto reading-relaxed">
                Tiket ini memerlukan proses Analisa dan Approval. Silakan
                lanjutkan proses di Aplikasi Change & Config Management.
              </p>
              <button
                onClick={() =>
                  window.open("https://change-app.dummy", "_blank")
                }
                className="px-6 py-3 bg-white text-[#053F5C] font-bold rounded-lg shadow hover:bg-blue-50 transition-transform hover:scale-105 flex items-center gap-2 mx-auto cursor-pointer"
              >
                Buka Aplikasi Change <FiExternalLink />
              </button>
              <div className="mt-6 pt-4 border-t border-white/20 flex justify-center gap-8 text-xs text-blue-200">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">
                    Status Saat Ini
                  </span>
                  <span className="text-xs">{ticket.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">Menunggu</span>
                  <span className="text-xs">Approval Atasan</span>
                </div>
              </div>
            </div>
          )}

          {/* SKENARIO 4: FINISH (Read Only) */}
          {ticket.status === "Selesai" && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
              <FiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                Tiket Terselesaikan
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                Menunggu konfirmasi penutupan dari pelapor.
              </p>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: SIDE INFO --- */}
        <div className="space-y-6">
          {/* Card SLA */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text- font-bold text-slate-400 uppercase mb-4 tracking-wider">
              Target SLA
            </h3>
            <div className="flex items-start gap-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-600 dark:text-red-400">
                <FiClock size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white leading-none">
                  {ticket.priority}
                </p>
                <p className="text-sm text-slate-500 mt-3">Batas Waktu:</p>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {format(new Date(ticket.sla), "dd MMM yyyy, HH:mm")}
                </p>
              </div>
            </div>
            {ticket.status === "Diproses" && (
              <div className="mt-4 text-xs bg-orange-100 text-orange-700 p-2 rounded border border-orange-100 flex gap-2 items-center">
                <FiAlertCircle size={14} /> SLA sedang berjalan
              </div>
            )}
          </div>

          {/* Additional Card Info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">
              Info Tiket
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Kategori</span>
                <span className="font-medium dark:text-white">Hardware</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Aset</span>
                <span className="font-medium dark:text-white">
                  Printer HP Laserjet
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">OPD</span>
                <span className="font-medium dark:text-white">
                  Dinas Kominfo
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedTicketDetailPage;
