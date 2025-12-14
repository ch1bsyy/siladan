import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiMapPin,
  FiFileText,
  FiSend,
  FiCheckCircle,
  FiCheckSquare,
  FiActivity,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";
import StatusBadge from "../features/tickets/components/StatusBadge";
import FormTextArea from "../components/FormTextArea";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import toast from "react-hot-toast";

import {
  getIncidentDetail,
  getRequestDetail,
  updateTicketProgress,
} from "../features/tickets/services/ticketService";

const AssignedTicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const [ticket, setTicket] = useState(null);
  const [ticketType, setTicketType] = useState("");
  const [newLog, setNewLog] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      // showLoading("Memuat detail tiket...");
      try {
        let data, type;
        try {
          const resInc = await getIncidentDetail(ticketId);
          data = resInc;
          type = "incident";
        } catch (err) {
          console.log(err);
          const resReq = await getRequestDetail(ticketId);
          data = resReq;
          type = "request";
        }

        if (data && data.success) {
          const t = data.ticket;

          const progressLogs = data.progress_updates || [];
          const systemLogs = data.logs || [];

          const allRawLogs = [
            ...progressLogs.map((l) => ({ ...l, type: "progress" })),
            ...systemLogs.map((l) => ({ ...l, type: "system" })),
          ];

          // Mapping Log agar seragam
          const mappedLogs = allRawLogs
            .map((log) => {
              // Tentukan field mana yang dipakai berdasarkan tipe log
              let activityText = "Update status";
              let userName = "Sistem";

              if (log.type === "progress") {
                activityText =
                  log.handling_description ||
                  log.notes ||
                  `Status berubah ke ${log.status_change}`;
                userName = log.updated_by_user?.full_name || "Teknisi";
              } else {
                activityText = log.description || log.action;
                userName = log.user?.full_name || "Sistem";
              }

              return {
                id: log.id,
                date:
                  log.created_at || log.update_time || new Date().toISOString(),
                activity: activityText,
                user: userName,
                type: log.type,
              };
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort terbaru diatas

          // Set State Ticket format UI
          setTicket({
            id: t.id, // DB ID
            ticketNumber: t.ticket_number, // Display ID (INC-xxx)
            type: t.type === "incident" ? "Pengaduan" : "Permintaan",
            title: t.title,
            description: t.description,
            status: t.status,
            stage: t.stage,
            priority: t.priority ? capitalize(t.priority) : "-",
            sla: t.sla_due,
            pelapor: t.reporter?.full_name || "Tanpa Nama",
            lokasi: t.incident_location || "-",
            tglLapor: format(new Date(t.created_at), "dd MMM yyyy, HH:mm", {
              locale: localeId,
            }),
            worklogs: mappedLogs,
            // Flag khusus
            isChangeRequest: false, // Sesuaikan logic jika ada
          });
          setTicketType(type);
        }
      } catch (error) {
        console.error("Gagal load detail:", error);
        toast.error(
          "Gagal memuat detail tiket. Tiket mungkin tidak ditemukan."
        );
        navigate("/dashboard/assigned-tickets");
      } finally {
        hideLoading();
      }
    };

    if (ticketId) fetchDetail();
  }, [ticketId, showLoading, hideLoading, navigate]);

  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

  if (!ticket) return null;

  // --- LOGIC ACTIONS ---

  const confirmStartProgress = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-base">
            Mulai kerjakan tiket ini? <br />
            <span className="font-normal text-sm text-slate-500">
              SLA Response Time akan tercatat.
            </span>
          </p>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleStartProgress(); // Call the actual function
              }}
              className="flex items-center justify-center min-h-11 min-w-11 bg-[#053F5C] text-white px-3 py-1 rounded text-sm font-medium hover:bg-[#075075]"
            >
              Ya, Mulai
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex items-center justify-center min-h-11 min-w-11 bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm font-medium hover:bg-slate-300"
            >
              Batal
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        icon: <FiAlertCircle className="text-[#053F5C] text-xl" />,
      }
    );
  };

  // (Assigned -> Diproses)
  const handleStartProgress = async () => {
    showLoading("Mengupdate status...");
    try {
      const payload = {
        update_number: ticket.worklogs.length + 1,
        status_change: "in_progress",
        stage_change: "execution", // Masuk tahap eksekusi teknisi
        handling_description:
          "Memulai pengerjaan tiket (Status: Sedang Dikerjakan)",
        // Field lain sesuaikan requirement, misal reason kosong
        reason: "",
        notes: "Memulai pengerjaan", // Untuk Request payload
      };

      await updateTicketProgress(ticket.id, ticketType, payload);

      toast.success("Status diperbarui: Sedang Dikerjakan");

      // Update state lokal manual agar responsif tanpa fetch ulang
      setTicket((prev) => ({
        ...prev,
        status: "in_progress",
        stage: "execution",
        worklogs: [
          {
            date: new Date().toISOString(),
            activity: "Memulai pengerjaan tiket (Status: Sedang Dikerjakan)",
            user: "Anda", // Placeholder, idealnya dari user context
          },
          ...prev.worklogs,
        ],
      }));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memulai pengerjaan: " + error.message);
    } finally {
      hideLoading();
    }
  };

  // Add Worklog
  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!newLog.trim()) return;

    showLoading("Menyimpan log...");
    try {
      const payload = {
        update_number: ticket.worklogs.length + 1,
        status_change: ticket.status,
        stage_change: ticket.stage,

        handling_description: newLog, // Incident
        notes: newLog, // Request
      };

      await updateTicketProgress(ticket.id, ticketType, payload);
      toast.success("Catatan aktivitas tersimpan");

      setTicket((prev) => ({
        ...prev,
        worklogs: [
          {
            date: new Date().toISOString(),
            activity: newLog,
            user: "Anda",
          },
          ...prev.worklogs,
        ],
      }));
      setNewLog("");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menyimpan log");
    } finally {
      hideLoading();
    }
  };

  // (Diproses -> Selesai)
  const handleResolve = async () => {
    const defaultNote = "Tiket diselesaikan oleh teknisi.";

    showLoading("Menyelesaikan tiket...");
    try {
      const payload = {
        update_number: ticket.worklogs.length + 1,
        status_change: "resolved", // Atau 'completed' sesuai backend
        stage_change: null, // Stage selesai biasanya null atau 'finished'

        final_solution: defaultNote, // Incident field
        handling_description: defaultNote,
        notes: defaultNote, // Request field
      };

      await updateTicketProgress(ticket.id, ticketType, payload);

      toast.success("Tiket berhasil diselesaikan!");
      navigate("/dashboard/assigned-tickets"); // Kembali ke list
    } catch (error) {
      toast.error("Gagal menyelesaikan tiket: " + error.message);
    } finally {
      hideLoading();
    }
  };

  const isNewAssigned =
    ticket.status === "assigned" ||
    (ticket.status === "open" && ticket.stage === "triase"); // Sesuaikan logic assigned backend

  // Cek apakah tiket "Sedang Dikerjakan"
  const isWorking = ticket.status === "in_progress";

  // Cek Selesai
  const isResolved = ticket.status === "resolved" || ticket.status === "closed";

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
          ID Tiket:{" "}
          <span className="font-mono font-bold">{ticket.ticketNumber}</span>
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
                ticket.priority === "Major"
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
              <StatusBadge status={ticket.status} stage={ticket.stage} />
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
          {isNewAssigned && (
            <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-1">
                  Tiket Ditugaskan
                </h3>
                <p className="text-blue-800 dark:text-blue-400 text-sm">
                  Klik tombol untuk memulai pengerjaan. Status akan berubah
                  menjadi "Sedang Dikerjakan".
                </p>
              </div>
              <button
                onClick={confirmStartProgress}
                className="px-6 py-3 bg-[#053F5C] hover:bg-[#075075] text-white font-semibold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <FiCheckSquare size={20} /> Kerjakan
              </button>
            </div>
          )}

          {/* SKENARIO 2: ON PROGRESS (Worklog) */}
          {isWorking && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FiActivity className="text-[#F7AD19]" /> Aktivitas Pengerjaan
                </h3>
                <button
                  onClick={handleResolve}
                  className="text-sm px-4 min-h-[44px] py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium transition-colors flex gap-2 items-center justify-center cursor-pointer"
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
                  label="Tambah Catatan Progres Harian"
                  placeholder="Contoh: Sedang melakukan scanning virus..."
                  rows={3}
                  value={newLog}
                  onChange={(e) => setNewLog(e.target.value)}
                />
                <div className="flex justify-end items-center mt-3">
                  <button
                    type="submit"
                    disabled={!newLog.trim()}
                    className="px-4 py-2 bg-[#053F5C] text-white rounded-md font-medium text-sm hover:bg-[#064a6b] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
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
                  <div className="pl-8 text-slate-400 text-sm italic">
                    Belum ada aktivitas tercatat.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SKENARIO 3: NEED CHANGE MANAGEMENT */}
          {isResolved && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
              <FiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                Tiket Terselesaikan
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                Tiket telah ditandai selesai.
              </p>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: SIDE INFO --- */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">
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
                {ticket.sla && (
                  <>
                    <p className="text-sm text-slate-500 mt-3">Deadline:</p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {format(new Date(ticket.sla), "dd MMM yyyy, HH:mm")}
                    </p>
                  </>
                )}
              </div>
            </div>
            {isWorking && (
              <div className="mt-4 text-xs bg-orange-100 text-orange-700 p-2 rounded border border-orange-100 flex gap-2 items-center">
                <FiAlertCircle size={14} /> Waktu SLA sedang berjalan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssignedTicketDetailPage;
