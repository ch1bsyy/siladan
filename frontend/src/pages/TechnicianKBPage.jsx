import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiGlobe,
  FiLock,
  FiUsers,
  FiFileText,
  FiServer,
  FiWifi,
  FiBookOpen,
  FiMonitor,
  FiX,
  FiShield,
} from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";
import { getArticles } from "../features/knowledge-base/services/articleService";
import toast from "react-hot-toast";
import ArticleDetailPage from "./ArticleDetailPage";

// --- Sub Components ---

const VisibilityBadge = ({ type }) => {
  const config = {
    public: {
      icon: FiGlobe,
      label: "Publik",
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    },
    internal_opd: {
      icon: FiUsers,
      label: "Internal OPD",
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    },
    internal_teknis: {
      icon: FiLock,
      label: "Restricted (Teknis)",
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    },
  };
  // Fallback ke internal_teknis jika type tidak dikenal
  const { icon: Icon, label, color } = config[type] || config.internal_teknis;

  return (
    <span
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-bold border ${color}`}
    >
      <Icon size={12} /> {label}
    </span>
  );
};

const ReadArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/70 backdrop-blur-sm">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in z-10">
        {/* --- TOMBOL CLOSE (Floating) --- */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] p-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-full transition-colors shadow-sm"
          title="Tutup"
        >
          <FiX size={24} />
        </button>

        {/* --- KONTEN UTAMA (REUSE COMPONENT) --- */}
        <div className="overflow-y-auto h-full scrollbar-thin relative z-10">
          {/* Kita render ArticleDetailPage di sini agar tampilannya SAMA PERSIS dengan sisi User */}
          <ArticleDetailPage article={article} />
        </div>
      </div>
    </div>
  );
};
/* ==========================================
   MAIN PAGE
   ========================================== */
const TechnicianKBPage = () => {
  const { showLoading, hideLoading } = useLoading();
  const [articles, setArticles] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [selectedArticle, setSelectedArticle] = useState(null);

  // List Kategori (Bisa dibuat dinamis dari API unique category)
  const categories = [
    "Semua",
    // "Server & Cloud",
    "Jaringan",
    "Software",
    "Hardware",
    "Account",
  ];

  // Fetch Data
  const fetchKB = async () => {
    try {
      showLoading("Memuat Knowledge Base...");

      const response = await getArticles({ limit: 100 }); // Ambil banyak untuk client filter

      if (response.success && Array.isArray(response.data)) {
        const published = response.data.filter((a) => a.status === "Published");
        setArticles(published);
      }
    } catch (error) {
      console.error("KB Error:", error);
      toast.error("Gagal memuat artikel.");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchKB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter Logic (Client Side)
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const titleMatch = art.title.toLowerCase().includes(search.toLowerCase());

      // Tags di backend mungkin array string atau string comma-separated
      // Kita normalisasi menjadi array untuk pencarian
      let tagsArray = [];
      if (Array.isArray(art.tags)) tagsArray = art.tags;
      else if (typeof art.tags === "string") tagsArray = art.tags.split(",");

      const tagMatch = tagsArray.some((tag) =>
        tag.trim().toLowerCase().includes(search.toLowerCase())
      );

      const matchSearch = titleMatch || tagMatch;

      const matchCat =
        categoryFilter === "Semua" || art.category === categoryFilter;

      return matchSearch && matchCat;
    });
  }, [search, categoryFilter, articles]);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FiBookOpen
              className="text-[#053F5C] dark:text-[#429EBD]"
              size={32}
            />
            Pusat Informasi Internal
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Dokumentasi teknis, SOP, dan panduan solusi untuk Tim IT.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari dokumentasi teknis (judul, tag, error code)..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#053F5C] outline-none dark:text-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Tabs (Desktop) */}
        <div className="hidden md:flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-[#053F5C] text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Category Dropdown (Mobile) */}
        <div className="md:hidden w-full">
          <select
            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-[#053F5C] dark:hover:border-[#429EBD] transition-all cursor-pointer flex flex-col"
          >
            <div className="flex flex-col gap-3 items-start mb-3">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {article.category === "Server & Cloud" && (
                  <FiServer size={18} />
                )}
                {article.category === "Jaringan" && <FiWifi size={18} />}
                {article.category === "Aplikasi" && <FiFileText size={18} />}
                {article.category === "Hardware" && <FiMonitor size={18} />}
                {article.category}
              </span>
              <VisibilityBadge type={article.visibility} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#053F5C] dark:group-hover:text-[#429EBD] transition-colors">
              {article.title}
            </h3>

            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              {/* Handle tags array or string */}
              {(Array.isArray(article.tags)
                ? article.tags
                : (article.tags || "").split(",")
              ).map(
                (tag, idx) =>
                  tag.trim() && (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                    >
                      #{tag.trim()}
                    </span>
                  )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <FiShield className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Tidak ada artikel ditemukan
          </h3>
          <p className="text-slate-500">
            Coba kata kunci lain atau ubah filter kategori.
          </p>
        </div>
      )}

      {/* Read Modal */}
      <ReadArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};

export default TechnicianKBPage;
