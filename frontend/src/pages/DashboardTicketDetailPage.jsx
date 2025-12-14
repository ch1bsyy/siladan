/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { format, isValid } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useLoading } from "../context/LoadingContext";
import {
  FiArrowLeft,
  FiSend,
  FiTrash2,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";

import StatusBadge from "../features/tickets/components/StatusBadge";
// import Input from "../components/Input";
import FormSelect from "../components/FormSelect";
// import FormTextArea from "../components/FormTextArea";
import ReassignModal from "../features/tickets/components/ReassignModal";
import { useAuth } from "../context/AuthContext";

import {
  getIncidentDetail,
  getRequestDetail,
  getTechniciansByOpd,
  classifyTicket,
  updateTicket,
} from "../features/tickets/services/ticketService";

// Helper Date Formatter (Handle null/invalid date)
const formatDateSafe = (dateString, formatStr = "dd MMMM yyyy, HH:mm") => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return isValid(date) ? format(date, formatStr, { locale: localeId }) : "-";
};

// Helper Parse JSON String Safe
const parseServiceDetail = (jsonString) => {
  try {
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (e) {
    return { detail: jsonString }; // Fallback jika bukan JSON valid
  }
};

const DashboardTicketDetailPage = () => {
  const { ticketId } = useParams();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const { isLoading, showLoading, hideLoading } = useLoading();

  const [ticket, setTicket] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);

  // state for assignment form (new ticket)
  const [formData, setFormData] = useState({
    urgency: "",
    impact: "",
    teknisiId: "",
    // catatanInternal: "",
  });

  // Fetch Data
  const fetchDetail = async () => {
    if (!ticketId || isNaN(ticketId)) {
      setLoadingComplete(true);
      return;
    }

    showLoading("Memuat detail tiket...");
    try {
      let response;
      const type = location.state?.ticketType;

      if (type === "Permintaan") {
        response = await getRequestDetail(ticketId);
      } else if (type === "Pengaduan") {
        response = await getIncidentDetail(ticketId);
      } else {
        // fallback
        try {
          response = await getIncidentDetail(ticketId);
        } catch (err) {
          response = await getRequestDetail(ticketId);
        }
      }

      const ticketData = response.ticket || response.data || response || {};
      const attachmentsData = response.attachments || [];
      const historyData = response.progress_updates || [];

      let lampiranList = [];

      if (ticketData.reporter_attachment_url) {
        lampiranList.push({
          name: "Bukti Lampiran",
          url: ticketData.reporter_attachment_url,
        });
      }

      if (attachmentsData.length > 0) {
        const mappedAttachments = attachmentsData.map((att) => ({
          name: att.file_name || "Lampiran Tambahan",
          url: att.file_url || "#",
        }));
        lampiranList = [...lampiranList, ...mappedAttachments];
      }

      const serviceDetailObj = parseServiceDetail(ticketData.service_detail);
      const detailLayananString = serviceDetailObj
        ? Object.entries(serviceDetailObj)
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ")
        : "-";

      // Mapping API Data into State Component
      const mappedTicket = {
        id: ticketData.ticket_number,
        dbId: ticketData.id,
        type:
          ticketData.type === "incident" || ticketData.type === "Pengaduan"
            ? "Pengaduan"
            : "Permintaan",
        status: ticketData.status,
        stage: ticketData.stage,
        priority: ticketData.priority,
        category: ticketData.category,
        createdAt: ticketData.created_at,
        updatedAt: ticketData.updated_at,

        pelapor: {
          name:
            ticketData.reporter?.full_name ||
            ticketData.reporter_name ||
            "Tidak diketahui",
          nik: ticketData.reporter?.nip || ticketData.reporter_nip || "-",
          email: ticketData.reporter?.email || ticketData.reporter_email || "-",
          phone: ticketData.reporter?.phone || ticketData.reporter_phone || "-",
          address:
            ticketData.reporter?.address || ticketData.reporter_address || "-",

          opd_name:
            ticketData.reporter?.opd?.name || ticketData.opd?.name || "-",
        },

        opd: ticketData.opd,

        details: {
          judul: ticketData.title,
          deskripsi: ticketData.description,
          lampiran: lampiranList,
          lokasiKejadian: ticketData.incident_location || "-",
          tanggalKejadian: formatDateSafe(
            ticketData.incident_date,
            "dd MMMM yyyy"
          ),
          namaAset:
            ticketData.asset_name_reported ||
            ticketData.asset_identifier ||
            "-",

          tanggalPermintaan: formatDateSafe(
            ticketData.requested_date,
            "dd MMMM yyyy"
          ),
          katalogLayanan: ticketData.service_catalog?.catalog_name || "-",
          subLayanan: ticketData.service_item?.item_name || "-",
          detailLayanan: detailLayananString,
        },

        assignment: {
          assignedTo: ticketData.technician?.full_name,
          slaDue: ticketData.sla_due,
          priority: ticketData.priority,
        },

        history: historyData.map((h) => ({
          status: h.status_change,
          date: h.update_time,
          by: h.updated_by_user?.full_name || "System",
          note: h.handling_description,
        })),
      };

      setTicket(mappedTicket);
    } catch (error) {
      console.error("Fetch Detail Error:", error);
      toast.error("Gagal memuat detail tiket. Tiket mungkin tidak ditemukan.");
    } finally {
      hideLoading();
      setLoadingComplete(true);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [ticketId, location.state]);

  // fetch technicians
  useEffect(() => {
    if (ticket?.opd?.id) {
      const loadTechnicians = async () => {
        const techs = await getTechniciansByOpd(ticket.opd.id);
        setTechnicians(techs || []);
      };
      loadTechnicians();
    }
  }, [ticket]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();

    if (!formData.urgency || !formData.impact || !formData.teknisiId) {
      toast.error("Harap lengkapi Urgency, Impact, dan Pilih Teknisi.");
      return;
    }

    showLoading("Memproses Verifikasi...");

    try {
      // classify
      const classifyPayload = {
        urgency: parseInt(formData.urgency),
        impact: parseInt(formData.impact),
      };

      await classifyTicket(ticket.dbId, ticket.type, classifyPayload);

      //update ticket
      const updatePayload = {
        status: "assigned",
        stage: "verification",
        assigned_to: parseInt(formData.teknisiId),
      };

      console.log("Mengirim Payload Update:", updatePayload);
      await updateTicket(ticket.dbId, ticket.type, updatePayload);

      toast.success("Tiket berhasil diverifikasi & ditugaskan!");

      // Refresh Data
      await fetchDetail();
    } catch (error) {
      console.error("Assign Error:", error);
      toast.error(
        `Gagal menugaskan: ${error.response?.data?.message || error.message}`
      );
    } finally {
      hideLoading();
    }
  };

  // Handle Reassign
  const handleReassignConfirm = (data) => {
    console.log("Reassign Data:", data);

    // Simulasi Update State
    setTicket((prev) => ({
      ...prev,
      assignment: {
        ...prev.assignment,
        assignedTo: "Teknisi Baru (ID: " + data.newTechnicianId + ")",
      },
      priority: data.newPriority || prev.priority,
      history: [
        {
          status: "Dialihkan",
          date: new Date().toISOString(),
          by: "Admin OPD (System)",
          note: `Dialihkan karena: ${data.reason}`,
        },
        ...prev.history,
      ],
    }));

    setIsReassignOpen(false);
    toast.success("Tugas berhasil dialihkan ke teknisi baru!");
  };

  const handleReject = () => {
    const reason = prompt("Masukkan alasan penolakan tiket:");
    if (reason) {
      console.log("Menolak Tiket:", reason);
      // API Logic: PATCH /api/tickets/:id/reject { alasan: alasan }
      alert("Tiket Ditolak.");
    }
  };

  if (isLoading) return null;

  if (!ticket && loadingComplete) {
    return (
      <div className="text-center py-20 dark:text-white">
        <h2 className="text-xl font-bold">Tiket Tidak Ditemukan</h2>
        <p className="text-slate-500">
          Mohon periksa kembali link atau ID tiket Anda.
        </p>
        <Link
          to="/dashboard/manage-tickets"
          className="text-blue-500 hover:underline mt-4 block"
        >
          Kembali ke List
        </Link>
      </div>
    );
  }

  if (!ticket) return null;

  const isRequest = ticket.type === "Permintaan";
  const applicantLabel = isRequest ? "Pemohon" : "Pelapor";

  // Logic UI Status
  const isNewTicket =
    ticket.status === "open" || ticket.status === "pending_approval";
  const isOngoing = ["assigned", "in_progress"].includes(ticket.status);

  return (
    <div className="space-y-6 pb-20">
      <Link
        to="/dashboard/manage-tickets"
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#053F5C] dark:hover:text-white"
      >
        <FiArrowLeft />
        <span>Kembali ke Manajemen Tiket</span>
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white ">
              {ticket.details.judul}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
              <span>
                No:{" "}
                <strong className="font-mono text-slate-800 dark:text-slate-200">
                  {ticket.id}
                </strong>
              </span>
              <span>
                Tipe:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {ticket.type}
                </strong>
              </span>
              <span>
                Dibuat:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {formatDateSafe(ticket.createdAt, "dd MMM yyyy, HH:mm")}
                </strong>
              </span>
            </div>
          </div>
          {/* Badge Status */}
          <div className="flex flex-col items-end gap-3">
            <StatusBadge status={ticket.status} isFullWidth isIncreaseFont />

            {hasPermission(["reassign", "ticket"]) && isOngoing && (
              <button
                onClick={() => setIsReassignOpen(true)}
                className="flex items-center min-h-11 min-w-11 gap-2 px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50 rounded-lg text-sm md:text-base font-bold transition-colors shadow-sm cursor-pointer"
              >
                <FiRefreshCw size={18} /> Alihkan Teknisi
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            {/* User Report Details */}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
              Detail Laporan {applicantLabel}
            </h3>

            {/* Data {applicantLabel} */}
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label={applicantLabel} value={ticket.pelapor.name} />
              <InfoRow
                label={isRequest ? "NIP" : "NIK"}
                value={ticket.pelapor.nik}
              />
              <InfoRow label="Email" value={ticket.pelapor.email} />
              <InfoRow label="No. Telepon" value={ticket.pelapor.phone} />
              <InfoRow
                label={`OPD ${applicantLabel}`}
                value={ticket.opd?.name}
              />
              <InfoRow
                label={`Alamat ${applicantLabel}`}
                value={ticket.pelapor.address}
              />
            </dl>

            <hr className="my-6 border-slate-200 dark:border-slate-700" />

            {/* Ticket Detail */}
            {isRequest ? (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InfoRow
                  label="Tanggal Permintaan"
                  value={ticket.details.tanggalPermintaan}
                />
                <InfoRow
                  label="Katalog Layanan"
                  value={ticket.details.katalogLayanan}
                />
                <InfoRow
                  label="Sub Layanan"
                  value={ticket.details.subLayanan}
                />
                <InfoRow
                  label="Detail Layanan"
                  value={ticket.details.detailLayanan}
                />
              </dl>
            ) : (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InfoRow
                  label="Tanggal Kejadian"
                  value={ticket.details.tanggalKejadian}
                />
                <InfoRow
                  label="Lokasi Kejadian"
                  value={ticket.details.lokasiKejadian}
                />
                <InfoRow label="OPD Aset" value={ticket.details.namaOpdAset} />
                <InfoRow label="Nama Aset" value={ticket.details.namaAset} />
              </dl>
            )}

            <hr className="my-6 border-slate-200 dark:border-slate-700" />

            {/* Description & Lampiran */}
            <dl className="space-y-4">
              <InfoRow
                label="Deskripsi Lengkap"
                value={ticket.details.deskripsi}
                isFullWidth
              />
              <InfoRow label="Lampiran" isFullWidth>
                {ticket.details.lampiran?.length > 0 ? (
                  ticket.details.lampiran.map((file, i) => (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-[#429EBD] hover:underline"
                    >
                      <FiDownload size={16} /> {file.name}
                    </a>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    - Tidak ada lampiran -
                  </span>
                )}
              </InfoRow>
            </dl>
          </div>

          {/* History & Activity Log */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
              Riwayat Status
            </h2>
            {ticket.history.length > 0 ? (
              <ol className="relative border-l border-slate-200 dark:border-slate-700 ml-2">
                {ticket.history.map((item, index) => (
                  <li key={index} className="mb-6 ml-4">
                    <div className="absolute w-3 h-3 bg-slate-200 rounded-full -left-1.5 border border-white dark:border-slate-800 dark:bg-slate-600"></div>
                    <time className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {formatDateSafe(item.date)}
                    </time>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.status.replace(/_/g, " ")}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Oleh: {item.by}
                    </p>
                    {item.note && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 italic mt-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded border-l-2 border-slate-300 dark:border-slate-600">
                        "{item.note}"
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-slate-500 italic text-center py-4">
                Belum ada riwayat status.
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {ticket.assignment?.assignedTo ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sticky top-24 border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
                Informasi Penugasan
              </h3>
              <dl className="space-y-4">
                <InfoRow label="Teknisi" value={ticket.assignment.assignedTo} />
                <InfoRow
                  label="Prioritas"
                  value={
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                        ticket.priority === "major"
                          ? "bg-orange-100 text-orange-700"
                          : ticket.priority === "high"
                          ? "bg-orange-100 text-orange-700"
                          : ticket.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.priority || "-"}
                    </span>
                  }
                />
                <InfoRow
                  label="Batas SLA"
                  value={formatDateSafe(ticket.assignment.slaDue)}
                />
              </dl>
            </div>
          ) : (
            isNewTicket && (
              <form
                onSubmit={handleAssignSubmit}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sticky top-24"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Panel Penugasan
                </h3>
                <div className="space-y-4">
                  <FormSelect
                    id="urgency"
                    name="urgency"
                    label="Urgency (Tingkat Mendesak)"
                    value={formData.urgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Tentukan Urgency --</option>
                    <option value="2">Rendah (Masalah kecil)</option>
                    <option value="4">Sedang (Fungsi terganggu)</option>
                    <option value="5">Tinggi (Sistem utama mati)</option>
                  </FormSelect>

                  <FormSelect
                    id="impact"
                    name="impact"
                    label="Impact (Dampak)"
                    value={formData.impact}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Tentukan Impact --</option>
                    <option value="1">Satu Pengguna</option>
                    <option value="3">Satu Unit / Bidang</option>
                    <option value="4">Satu OPD</option>
                  </FormSelect>

                  {/* Helper Text Preview Skor (Opsional) */}
                  {formData.urgency && formData.impact && (
                    <div className="text-sm md:text-base mt-2 p-2 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 rounded text-slate-600">
                      Estimasi Skor:{" "}
                      <strong>{formData.urgency * formData.impact} </strong>(
                      {formData.urgency * formData.impact > 15
                        ? "Major 🔴"
                        : formData.urgency * formData.impact > 10
                        ? "High 🟠"
                        : formData.urgency * formData.impact > 5
                        ? "Medium 🟡"
                        : "Low 🟢"}
                      )
                    </div>
                  )}

                  <FormSelect
                    id="teknisiId"
                    name="teknisiId"
                    label="Tugaskan ke Teknisi"
                    value={formData.teknisiId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Teknisi --</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.username}
                      </option>
                    ))}
                  </FormSelect>

                  {/* <FormTextArea
                  id="catatanInternal"
                  name="catatanInternal"
                  label="Catatan Internal (opsional)"
                  placeholder="Tambahkan catatan..."
                  rows={4}
                  value={formData.catatanInternal}
                  onChange={handleChange}
                /> */}

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C]"
                    >
                      <FiSend size={18} />
                      <span>Verifikasi Tiket</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-500/10 hover:bg-red-200"
                    >
                      <FiTrash2 size={18} />
                      <span>Tolak Tiket</span>
                    </button>
                  </div>
                </div>
              </form>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      <ReassignModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        currentTechName={ticket.assignment?.assignedTo}
        onConfirm={handleReassignConfirm}
      />
    </div>
  );
};

// Sub Component
const InfoRow = ({ label, value, children, isFullWidth = false }) => (
  <div className={`break-words ${isFullWidth ? "md:col-span-2" : ""}`}>
    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </dt>
    <dd className="mt-1 text-base text-slate-900 dark:text-white">
      {value || children}
    </dd>
  </div>
);

export default DashboardTicketDetailPage;
