import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useLoading } from "../context/LoadingContext";
import { getTicketStatusByNumber } from "../features/tracking/services/trackService";
import {
  FiCheckCircle,
  FiTool,
  FiClock,
  FiCheck,
  FiXCircle,
  FiArrowLeft,
  FiMessageSquare,
} from "react-icons/fi";

const getStatusInfo = (status) => {
  const safeStatus = status ? status.toLowerCase() : "";

  if (safeStatus.includes("selesai") || safeStatus === "closed") {
    return {
      icon: <FiCheckCircle size={20} />,
      colorClass: "text-green-500",
    };
  }
  if (safeStatus.includes("teknisi") || safeStatus.includes("progress")) {
    return {
      icon: <FiTool size={20} />,
      colorClass: "text-[#429EBD] dark:text-[#9FE7F5]",
    };
  }
  if (safeStatus.includes("setuju") || safeStatus.includes("diverifikasi")) {
    return {
      icon: <FiCheck size={20} />,
      colorClass: "text-blue-500",
    };
  }
  if (safeStatus.includes("tolak")) {
    return {
      icon: <FiXCircle size={20} />,
      colorClass: "text-red-500",
    };
  }
  // Default
  return {
    icon: <FiClock size={20} />,
    colorClass: "text-slate-500",
  };
};

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const { isLoading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchTicketDetail = async () => {
      if (!ticketId) return;

      showLoading("Memuat detail tiket");
      setError(null);

      try {
        const response = await getTicketStatusByNumber(ticketId);

        if (response.success && response.data) {
          const { ticket_info, timeline } = response.data;

          const mappedTicket = {
            id: ticket_info.ticket_number,
            title: ticket_info.title,
            type: "Pengaduan",
            status: ticket_info.status,
            isRequest: false,
            createdAt: ticket_info.created_at,
            updatedAt: ticket_info.last_updated || ticket_info.created_at,
            description: ticket_info.description,
            pelapor: {
              name: ticket_info.reporter_name || "Anonim",
              email: ticket_info.reporter_email || "-",
            },
            history: timeline
              ? timeline.map((item) => ({
                  status: item.status_change,
                  date: item.update_time,
                  by: "Sistem/Admin",
                  description: item.handling_description,
                }))
              : [],
          };

          setTicket(mappedTicket);
        } else {
          setError("Data tiket tidak ditemukan atau format salah.");
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(err.message || "Gagal memuat data tiket");
      } finally {
        hideLoading();
      }
    };

    fetchTicketDetail();
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

  if (error || !ticket) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center dark:text-white px-4 text-center">
        <FiXCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
          {error || "Tiket tidak ditemukan"}
        </h2>
        <p className="text-slate-500 mt-2 mb-6">
          Pastikan nomor tiket yang Anda masukkan sudah benar.
        </p>
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

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
          {/* Header Detail Ticket */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700  bg-slate-50/50 dark:bg-slate-800">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded mb-2">
                  {ticket.type} #{ticket.id}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-[#053F5C] dark:text-white">
                  {ticket.title}
                </h1>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusInfo.colorClass} bg-white dark:bg-slate-700 shadow-sm`}
              >
                {statusInfo.icon}
                <span className="font-bold">{ticket.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Main Column {history and Desc} */}
            <div className="md:col-span-2 p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <FiMessageSquare className="text-[#F7AD19]" />
                  Deskripsi
                </h2>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
              </div>

              <hr className="my-8 border-slate-200 dark:border-slate-700" />

              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                Riwayat Tiket
              </h2>

              {ticket.history && ticket.history.length > 0 ? (
                <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
                  {ticket.history.map((item, index) => (
                    <li key={index} className="ml-6">
                      <div className="absolute w-4 h-4 bg-white dark:bg-slate-800 rounded-full -left-[9px] border-2 border-[#429EBD] ring-4 ring-white dark:ring-slate-800"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {item.status}
                        </h3>
                        <time className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {format(new Date(item.date), "dd MMMM yyyy, HH:mm", {
                            locale: localeId,
                          })}
                        </time>
                      </div>

                      {item.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic bg-slate-50 dark:bg-slate-700/30 p-2 rounded border-l-2 border-slate-300 dark:border-slate-600">
                          "{item.description}"
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        Diupdate oleh: {item.by}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-slate-500 italic">
                  Belum ada riwayat status.
                </p>
              )}
            </div>

            {/* Side Column (Info) */}
            <div className="md:col-span-1 bg-slate-50 dark:bg-slate-800/50 md:border-l border-slate-200 dark:border-slate-700 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 pb-2 border-b border-slate-200 dark:border-slate-700">
                Informasi Lainnya
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nama {applicantLabel}
                  </p>
                  <p className="font-medium text-slate-700 dark:text-slate-200 text-lg">
                    {ticket.pelapor.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="font-medium text-slate-700 dark:text-slate-200 break-all">
                    {ticket.pelapor.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Tanggal Dibuat
                  </p>
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {format(new Date(ticket.createdAt), "dd MMMM yyyy, HH:mm", {
                      locale: localeId,
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Terakhir Diupdate
                  </p>
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {format(new Date(ticket.updatedAt), "dd MMMM yyyy, HH:mm", {
                      locale: localeId,
                    })}
                  </p>
                </div>

                {/* Section Finished Ticket */}
                {ticket.status.toLowerCase().includes("selesai") && (
                  <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white bg-[#F7AD19] hover:bg-yellow-500 text-sm shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer">
                      <FiMessageSquare size={18} />
                      <span>Beri Ulasan</span>
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
