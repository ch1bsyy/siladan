import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiGlobe,
  FiLock,
  FiUsers,
  FiClock,
  FiFilter,
} from "react-icons/fi";

import FormSelect from "../components/FormSelect";
import Pagination from "../components/Pagination";

// --- MOCK DATA ARTICLE ---
const mockArticles = [
  {
    id: "ART-001",
    title: "Cara Mengatasi Printer Error 505 di Windows 11",
    author: "Budi Santoso (Teknisi)",
    submittedAt: "2025-11-20T09:00:00",
    status: "Menunggu Review",
    category: "Hardware",
    visibility: "public",
    content: "<p>Langkah pertama adalah cek kabel USB...</p>",
    tags: ["printer", "error", "windows"],
  },
  {
    id: "ART-002",
    title: "Konfigurasi VPN untuk WFH (OPD Teknis)",
    author: "Andi Saputra (Network Engineer)",
    submittedAt: "2025-11-21T14:30:00",
    status: "Menunggu Review",
    category: "Jaringan",
    visibility: "internal_teknis",
    content: "<p>IP Server VPN adalah 192.168.x.x...</p>",
    tags: ["vpn", "network", "security"],
  },
  {
    id: "ART-003",
    title: "Panduan Reset Password Email Pemerintah",
    author: "Siti Aminah (Helpdesk)",
    submittedAt: "2025-11-18T10:00:00",
    status: "Published",
    category: "Aplikasi",
    visibility: "internal_opd",
    content: "<p>Buka portal SSO...</p>",
    tags: ["email", "password", "sso"],
  },
];

// --- COMPONENT BADGES ---
const StatusBadge = ({ status }) => {
  const styles = {
    "Menunggu Review": "bg-yellow-100 text-yellow-700 border-yellow-200",
    Published: "bg-green-100 text-green-700 border-green-200",
    "Revisi Diperlukan": "bg-red-100 text-red-700 border-red-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${
        styles[status] || styles["Draft"]
      }`}
    >
      {status}
    </span>
  );
};

const VisibilityBadge = ({ type }) => {
  const config = {
    public: {
      icon: FiGlobe,
      label: "Publik",
      color: "text-blue-600 bg-blue-50",
    },
    internal_opd: {
      icon: FiUsers,
      label: "Internal OPD",
      color: "text-purple-600 bg-purple-100",
    },
    internal_teknis: {
      icon: FiLock,
      label: "Teknis Only",
      color: "text-slate-600 bg-slate-100",
    },
  };
  const { icon: Icon, label, color } = config[type] || config.internal_teknis;

  return (
    <span
      className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${color}`}
    >
      <Icon size={16} /> {label}
    </span>
  );
};

const ArticleReviewPage = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Menunggu Review");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [editVisibility, setEditVisibility] = useState("");

  // --- FILTER LOGIC ---
  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchStatus =
        filterStatus === "Semua" || article.status === filterStatus;
      const matchSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.author.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [search, filterStatus]);

  const handleOpenReview = (article) => {
    setSelectedArticle(article);
    setEditVisibility(article.visibility);
    setShowRejectInput(false);
    setRejectReason("");
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    // Logic API: PUT /articles/:id/approve { visibility: editVisibility }
    toast.success(`Artikel diterbitkan dengan visibilitas: ${editVisibility}`);
    setIsModalOpen(false);
    // Refresh data here...
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) {
      toast.error("Mohon isi alasan penolakan/revisi.");
      return;
    }
    // Logic API: PUT /articles/:id/reject { reason: rejectReason }
    toast.error("Artikel dikembalikan ke teknisi untuk revisi.");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Review & Publikasi Artikel
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Validasi solusi teknis sebelum diterbitkan ke Knowledge Base.
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari judul artikel atau penulis..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#429EBD] outline-none dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <div className="relative">
            <FiFilter
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />
            <select
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#429EBD] outline-none dark:text-white appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Review">Perlu Review (Pending)</option>
              <option value="Published">Sudah Terbit (Published)</option>
              <option value="Revisi Diperlukan">Ditolak / Revisi</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-base">
                  Judul Artikel
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-base">
                  Penulis
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-base text-center">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-base text-center">
                  Visibilitas
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-base text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-white line-clamp-2 max-w-xs">
                        {article.title}
                      </p>
                      <span className="text-xs text-slate-500 mt-2 inline-block bg-slate-100 dark:bg-slate-700 dark:text-slate-100 px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                        {article.author}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <FiClock size={14} />
                        {format(new Date(article.submittedAt), "dd MMM yyyy", {
                          locale: localeId,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-6 py-4">
                      <VisibilityBadge type={article.visibility} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenReview(article)}
                        className="inline-flex min-h-11 min-w-11 items-center gap-2.5 px-4 py-2 bg-[#053F5C] text-white text-sm md:text-base font-medium rounded-lg hover:bg-[#075075] transition-colors shadow-sm cursor-pointer"
                      >
                        <FiEye size={20} /> Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic"
                  >
                    Tidak ada artikel yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredArticles.length}
            itemsPerPage={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* --- REVIEW MODAL (PREVIEW & ACTION) --- */}
      {isModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FiFileText className="text-[#F7AD19]" /> Preview Artikel
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ID: {selectedArticle.id} • Oleh: {selectedArticle.author}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable Content) */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8">
              {/* Article Metadata */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                  {selectedArticle.category}
                </span>
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Article Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {selectedArticle.title}
              </h1>

              {/* Article Content Simulation */}
              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
                {/* Dummy */}
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="my-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
                  <strong>Catatan Penting:</strong> Pastikan driver printer
                  sudah versi terbaru sebelum mengikuti langkah ini.
                </div>
                <h3>Langkah Penyelesaian:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Buka Control Panel di Windows Anda.</li>
                  <li>
                    Pilih menu <strong>Devices and Printers</strong>.
                  </li>
                  <li>
                    Klik kanan pada printer yang bermasalah, pilih{" "}
                    <em>Remove Device</em>.
                  </li>
                  <li>Restart komputer Anda.</li>
                </ol>
              </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              {/* Admin Control: Visibility Settings */}
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-1 items-start gap-3">
                  <FiGlobe
                    className="text-blue-600 dark:text-blue-400 mt-1"
                    size={20}
                  />
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm md:text-base">
                      Atur Visibilitas Publikasi
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 md:text-sm">
                      Tentukan siapa yang boleh melihat artikel ini setelah
                      terbit.
                    </p>
                  </div>
                </div>
                <div className="md:w-64">
                  <FormSelect
                    id="visibilitas"
                    name="visibilitas"
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value)}
                  >
                    <option value="public">
                      Publik (Masyarakat & Pegawai)
                    </option>
                    <option value="internal_opd">
                      Internal Pemerintah (Semua OPD)
                    </option>
                    <option value="internal_teknis">
                      Internal Teknisi Saja
                    </option>
                  </FormSelect>
                </div>
              </div>

              {/* Reject Reason Input (Conditional) */}
              {showRejectInput && (
                <div className="mb-4">
                  <label className="block text-sm md:text-base font-medium text-red-600 dark:text-red-500 mb-1">
                    Alasan Penolakan / Catatan Revisi:
                  </label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 outline-none text-sm md:text-base"
                    rows={3}
                    placeholder="Jelaskan bagian mana yang perlu diperbaiki oleh teknisi..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 min-h-11 min-w-11 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 font-medium transition-colors cursor-pointer"
                >
                  Tutup
                </button>

                {!showRejectInput ? (
                  <>
                    <button
                      onClick={handleReject}
                      className="px-5 py-2.5 min-h-11 min-w-11 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 font-bold transition-colors cursor-pointer"
                    >
                      Tolak / Revisi
                    </button>
                    <button
                      onClick={handleApprove}
                      className="px-6 py-2.5 min-h-11 min-w-11 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 font-bold flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                    >
                      <FiCheckCircle size={18} /> Publish Artikel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleReject}
                    className="px-6 py-2.5 min-h-11 min-w-11 rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <FiXCircle size={18} /> Kirim Revisi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleReviewPage;
