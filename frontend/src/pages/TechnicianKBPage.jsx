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
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

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

  // Format Date Safe
  const formattedDate = article.updated_at
    ? format(new Date(article.updated_at), "dd MMM yyyy", { locale: localeId })
    : "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <VisibilityBadge type={article.visibility} />
              <span className="text-[13px] text-slate-500 dark:text-slate-400">
                Updated: {formattedDate}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 flex min-h-11 min-w-11 items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <FiX size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 prose dark:prose-invert dark:text-white max-w-none">
          {/* Render HTML Content from Jodit */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Render Metadata Fields jika ada (optional) */}
          {(article.symptoms || article.rootCause) && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
              {article.symptoms && (
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">
                    Gejala:
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {article.symptoms}
                  </p>
                </div>
              )}
              {article.rootCause && (
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">
                    Penyebab:
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {article.rootCause}
                  </p>
                </div>
              )}
            </div>
          )}
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
    "Server & Cloud",
    "Jaringan",
    "Aplikasi",
    "Hardware",
    "Kepegawaian", // Tambahan sesuai CreateArticle
  ];

  // Fetch Data
  const fetchKB = async () => {
    try {
      showLoading("Memuat Knowledge Base...");
      // Ambil semua artikel yang statusnya Published (biasanya default endpoint get public/technician articles)
      // Jika endpoint getArticles memuat semua status, filter di backend atau frontend.
      // Asumsi getArticles menampilkan artikel yang boleh dilihat teknisi (Published & Internal)
      const response = await getArticles({ limit: 100 }); // Ambil banyak untuk client filter

      if (response.success && Array.isArray(response.data)) {
        // Filter hanya yang published untuk referensi (atau sesuai kebijakan: teknisi bisa lihat draft sendiri?)
        // Di sini kita tampilkan yang status 'Published' agar valid sebagai referensi
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
