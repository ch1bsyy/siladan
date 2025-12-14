import React, { useState, useMemo, useEffect } from "react";
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

import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import {
  getArticles,
  updateArticleStatus,
  updateArticle, // Import updateArticle
} from "../features/knowledge-base/services/articleService";
import Pagination from "../components/Pagination";

// ... (StatusBadge and VisibilityBadge components remain the same) ...
const StatusBadge = ({ status }) => {
  const styles = {
    "Menunggu Review":
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    Published:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    "Revisi Diperlukan":
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    Draft:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
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
      color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/20",
    },
    internal_opd: {
      icon: FiUsers,
      label: "Internal OPD",
      color:
        "text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/20",
    },
    internal_teknis: {
      icon: FiLock,
      label: "Teknis Only",
      color:
        "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-700",
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
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Menunggu Review");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [editVisibility, setEditVisibility] = useState("");

  // 1. Fetch Data Artikel (Khusus OPD User)
  const fetchArticles = async () => {
    try {
      showLoading("Memuat daftar artikel...");
      const opdId = user?.opd_id || user?.opd?.id;

      // Ambil semua artikel milik OPD ini
      const response = await getArticles({ opd_id: opdId, limit: 100 });

      if (response.success && Array.isArray(response.data)) {
        setArticles(response.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Gagal memuat artikel.");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FILTER LOGIC (Client-Side) ---
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchStatus =
        filterStatus === "Semua" || article.status === filterStatus;

      const titleMatch = article.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const authorMatch = article.author
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchStatus && (titleMatch || authorMatch);
    });
  }, [search, filterStatus, articles]);

  // Handle Modal
  const handleOpenReview = (article) => {
    setSelectedArticle(article);
    setEditVisibility(article.visibility);
    setShowRejectInput(false);
    setRejectReason("");
    setIsModalOpen(true);
  };

  // 2. Approve Action (Fix: Update Visibility first if changed)
  const handleApprove = async () => {
    try {
      showLoading("Menerbitkan artikel...");

      // Cek jika visibilitas berubah, update dulu via PUT
      if (editVisibility !== selectedArticle.visibility) {
        // Siapkan payload lengkap untuk PUT (karena PUT biasanya replace all)
        // Pastikan selectedArticle punya semua field yg dibutuhkan PUT
        const updatePayload = {
          title: selectedArticle.title,
          category: selectedArticle.category,
          visibility: editVisibility, // Update visibilitas
          tags: selectedArticle.tags,
          symptoms: selectedArticle.symptoms,
          rootCause: selectedArticle.rootCause,
          solution: selectedArticle.solution,
          content: selectedArticle.content,
        };
        await updateArticle(selectedArticle.id, updatePayload);
      }

      // Panggil API PATCH status -> Published
      await updateArticleStatus(
        selectedArticle.id,
        "Published",
        "Artikel disetujui oleh Admin OPD"
      );

      toast.success(
        `Artikel diterbitkan dengan visibilitas: ${editVisibility}`
      );
      setIsModalOpen(false);
      fetchArticles(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(
        "Gagal menerbitkan artikel: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      hideLoading();
    }
  };

  // 3. Reject Action
  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) {
      toast.error("Mohon isi alasan penolakan/revisi.");
      return;
    }

    try {
      showLoading("Mengirim revisi...");
      // Panggil API PATCH status -> Revisi Diperlukan
      await updateArticleStatus(
        selectedArticle.id,
        "Rejected", // Pastikan string ini sesuai enum di backend
        rejectReason
      );

      toast.error("Artikel dikembalikan ke teknisi untuk revisi.");
      setIsModalOpen(false);
      fetchArticles(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Gagal menolak artikel.");
    } finally {
      hideLoading();
    }
  };

  // Pagination Logic (Client Side)
  const itemsPerPage = 5;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage]);

  return (
    <div className="space-y-6 pb-10">
      {/* ... (Header, Filters, Table UI remain exactly the same as previous response) ... */}

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
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
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
              {paginatedData.length > 0 ? (
                paginatedData.map((article) => (
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
                        {article.created_at
                          ? format(
                              new Date(article.created_at),
                              "dd MMM yyyy",
                              { locale: localeId }
                            )
                          : "-"}
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
            itemsPerPage={itemsPerPage}
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
                {/* Handle tags (array or string) */}
                {(() => {
                  const tags = Array.isArray(selectedArticle.tags)
                    ? selectedArticle.tags
                    : (selectedArticle.tags || "").split(",");
                  return tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs"
                    >
                      #{tag.trim()}
                    </span>
                  ));
                })()}
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

                {/* Metadata Fields (Symptoms etc) */}
                {(selectedArticle.symptoms || selectedArticle.rootCause) && (
                  <div className="my-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded border-l-4 border-[#053F5C] space-y-4">
                    {selectedArticle.symptoms && (
                      <div>
                        <strong className="block text-slate-900 dark:text-white">
                          Gejala:
                        </strong>
                        <p className="text-sm">{selectedArticle.symptoms}</p>
                      </div>
                    )}
                    {selectedArticle.rootCause && (
                      <div>
                        <strong className="block text-slate-900 dark:text-white">
                          Penyebab:
                        </strong>
                        <p className="text-sm">{selectedArticle.rootCause}</p>
                      </div>
                    )}
                  </div>
                )}
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
                  {/* Select Manual (Native) */}
                  <select
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white text-sm"
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value)}
                  >
                    <option value="public">
                      Publik (Masyarakat & Pegawai)
                    </option>
                    <option value="internal_opd">
                      Internal Pemerintah (Khusus OPD)
                    </option>
                    <option value="internal_teknis">
                      Internal Teknisi Saja (Unit)
                    </option>
                  </select>
                </div>
              </div>

              {/* Reject Reason Input (Conditional) */}
              {showRejectInput && (
                <div className="mb-4">
                  <label className="block text-sm md:text-base font-medium text-red-600 dark:text-red-500 mb-1">
                    Alasan Penolakan / Catatan Revisi:
                  </label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 outline-none text-sm md:text-base dark:bg-slate-800 dark:text-white dark:border-red-800"
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
