import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
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
import FormTextArea from "../components/FormTextArea";
import ReassignModal from "../features/tickets/components/ReassignModal";

// Mock Data
const mockAllTickets = [
  {
    id: "TK-0010",
    type: "Pengaduan",
    status: "Diproses",
    priority: "High",
    createdAt: "2025-10-15T09:00:00Z",
    updatedAt: "2025-10-16T10:00:00Z",
    pelapor: {
      name: "Warga Masyarakat A",
      nik: "3578000111222",
      email: "warga@mail.com",
      phone: "08123456789",
      address: "Jl. Pahlawan No. 1, Surabaya",
    },
    details: {
      judul: "Jaringan Server Down di Ruang Rapat",
      deskripsi: "Jaringan server di ruang rapat utama mati total.",
      lampiran: [{ name: "screenshot-error.png", url: "#" }],
      lokasiKejadian: "Gedung A, Lantai 2, Ruang Rapat",
      tanggalKejadian: "2025-10-15",
      namaOpdAset: "Sekretariat DPRD",
      namaAset: "Jaringan",
    },
    assignment: {
      assignedTo: "Teknisi Budi",
      slaHours: 4,
    },
    history: [
      {
        status: "Diproses",
        date: "2025-10-15T10:00:00Z",
        by: "Teknisi Budi",
      },
      {
        status: "Diajukan",
        date: "2025-10-15T09:00:00Z",
        by: "Warga Masyarakat A",
      },
    ],
  },
  {
    id: "REQ-001",
    type: "Permintaan",
    status: "Diproses",
    createdAt: "2025-10-19T09:00:00Z",
    updatedAt: "2025-10-19T09:00:00Z",
    pelapor: {
      name: "Bisma Pargoy",
      nik: "1471070904020021",
      email: "pegawai@opd.go.id",
      phone: "+62895...",
      address: "Rungkut Asri Timur, Surabaya",
    },
    opd: { name: "Sekretariat DPRD" },
    details: {
      judul: "Permintaan Instalasi Microsoft Office",
      deskripsi: "Butuh instalasi Office 365 di komputer baru ruang arsip.",
      lampiran: [],
      tanggalPermintaan: "2025-10-19",
      katalogLayanan: "Software",
      subLayanan: "Instalasi Aplikasi",
      detailLayanan: "Microsoft Office",
    },
    assignment: {
      priority: "Tinggi",
      slaHours: 8,
      assignedTo: "Teknisi Charlie (Software)",
      internalNotes: "User butuh cepat untuk presentasi",
    },
    history: [
      { status: "Diajukan", date: "2025-10-19T09:00:00Z", by: "Bisma Pargoy" },
    ],
  },
];

const mockTeknisi = [
  { id: 1, name: "Teknisi Budi (Jaringan)" },
  { id: 2, name: "Teknisi Ani (Hardware)" },
  { id: 3, name: "Teknisi Charlie (Software)" },
];

const DashboardTicketDetailPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [loadingComplete, setLoadingComplete] = useState(false);

  const [isReassignOpen, setIsReassignOpen] = useState(false);

  // state for assignment form (new ticket)
  const [formData, setFormData] = useState({
    urgency: "",
    impact: "",
    teknisiId: "",
    catatanInternal: "",
  });

  // Simulation Fetch Data
  useEffect(() => {
    showLoading("Memuat detail tiket...");
    setLoadingComplete(false);
    const foundTicket = mockAllTickets.find((t) => t.id === ticketId);

    setTimeout(() => {
      setTicket(foundTicket);
      hideLoading();
      setLoadingComplete(true);
    }, 500);

    return () => hideLoading();
  }, [ticketId, showLoading, hideLoading]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    console.log("Menugaskan Tiket:", formData);
    // API Logic: PATCH /api/tickets/:id/assign { ...formData }
    // if success, fetch data again
    alert("Tiket berhasil Ditugaskan!");
    setTicket((prev) => ({
      ...prev,
      status: "Ditugaskan",
      assignment: { ...prev.assignment, assignedTo: "Teknisi Terpilih" },
    }));
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
        Tiket tidak ditemukan
      </div>
    );
  }

  if (!ticket) return null;

  // check if ticket "New" (pending) for display form
  const isNewTicket =
    ticket.status === "Menunggu" || ticket.status === "Pending";
  const isOngoing =
    ticket.status === "Diproses" ||
    ticket.status === "Ditugaskan" ||
    ticket.status === "Overdue";
  const isRequest = ticket.type === "Permintaan";
  const applicantLabel = isRequest ? "Pemohon" : "Pelapor";

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
                  {format(new Date(ticket.createdAt), "dd MMM yyyy, HH:mm")}
                </strong>
              </span>
            </div>
          </div>
          {/* Badge Status */}
          <div className="flex flex-col items-end gap-3">
            <StatusBadge status={ticket.status} isFullWidth isIncreaseFont />

            {isOngoing && (
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
            <ol className="relative border-l border-slate-200 dark:border-slate-700 ml-2">
              {ticket.history.map((item, index) => (
                <li key={index} className="mb-6 ml-4">
                  <div className="absolute w-3 h-3 bg-slate-200 rounded-full -left-1.5 border border-white dark:border-slate-800 dark:bg-slate-600"></div>
                  <time className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {format(new Date(item.date), "dd MMMM yyyy, HH:mm")}
                  </time>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {item.status}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Oleh: {item.by}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {ticket.assignment?.assignedTo && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informasi Penugasan
              </h3>
              <dl className="space-y-4">
                <InfoRow label="Status Terkini" value={ticket.status} />
                <InfoRow
                  label="Prioritas"
                  value={ticket.assignment?.priority || "-"}
                />
                <InfoRow
                  label="SLA"
                  value={
                    ticket.assignment?.slaHours
                      ? `${ticket.assignment.slaHours} Jam Kerja`
                      : "-"
                  }
                />
                <InfoRow
                  label="Ditugaskan ke"
                  value={ticket.assignment?.assignedTo || "-"}
                />
                <InfoRow
                  label="Catatan Internal"
                  value={ticket.assignment?.internalNotes || "-"}
                  isFullWidth
                />
              </dl>
            </div>
          )}

          {isNewTicket && (
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
                  label="Urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Tentukan Urgency --</option>
                  <option value="Tinggi">Tinggi (Sistem utama mati)</option>
                  <option value="Sedang">Sedang (Fungsi terganggu)</option>
                  <option value="Rendah">Rendah (Masalah kecil)</option>
                </FormSelect>

                <FormSelect
                  id="impact"
                  name="impact"
                  label="Impact"
                  value={formData.impact}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Tentukan Impact --</option>
                  <option value="1">1 - Satu Pengguna</option>
                  <option value="2">2 - Satu Unit</option>
                  <option value="3">3 - Satu OPD</option>
                  <option value="4">4 - Seluruh Kota</option>
                </FormSelect>

                <FormSelect
                  id="teknisiId"
                  name="teknisiId"
                  label="Tugaskan ke Teknisi"
                  value={formData.teknisiId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Teknisi --</option>
                  {mockTeknisi.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </FormSelect>

                <FormTextArea
                  id="catatanInternal"
                  name="catatanInternal"
                  label="Catatan Internal (opsional)"
                  placeholder="Tambahkan catatan..."
                  rows={4}
                  value={formData.catatanInternal}
                  onChange={handleChange}
                />

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
