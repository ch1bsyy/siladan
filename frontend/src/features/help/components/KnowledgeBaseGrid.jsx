import React, { useState, useEffect } from "react";
import {
  FiMonitor,
  FiWifi,
  FiShield,
  FiFileText,
  FiX,
  FiUser,
  FiTag,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";
import { LuAppWindow } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import {
  getArticles,
  getPublicArticles, // Import the new service
} from "../../knowledge-base/services/articleService";

// Kategori Statis untuk Grid (Bisa diganti dinamis jika mau)
const categories = [
  {
    id: 1,
    name: "Hardware",
    icon: FiMonitor,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: 2,
    name: "Jaringan",
    icon: FiWifi,
    color: "text-green-600 bg-green-50",
  },
  {
    id: 3,
    name: "Aplikasi",
    icon: LuAppWindow,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: 4,
    name: "Kepegawaian",
    icon: FiShield,
    color: "text-red-600 bg-red-50",
  },
];

const ArticleDetailModal = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 z-10">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 uppercase tracking-wide">
                {article.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <FiCalendar size={12} />{" "}
                {new Date(article.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 flex min-h-11 min-w-11 justify-center items-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex-shrink-0"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <FiUser size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                Ditulis oleh {article.author}
              </p>
              <p className="text-xs md:text-[13px] text-slate-500">
                Tim Teknis SILADAN
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert dark:text-white max-w-none prose-headings:font-bold prose-h3:text-lg prose-a:text-blue-600">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {article.tags && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                <FiTag size={16} /> Topik Terkait:
              </p>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(article.tags)
                  ? article.tags
                  : (article.tags || "").split(",")
                ).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
const KnowledgeBaseGrid = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        let visibleArticles = [];

        if (isAuthenticated) {
          // --- LOGIC PEGAWAI (LOGIN) ---
          // Mengambil artikel internal dan publik via endpoint authenticated
          // Asumsi backend getArticles mengembalikan semua artikel yang boleh dilihat user
          let params = { limit: 20, status: "Published" };

          if (user?.opd_id) {
            params.opd_id = user.opd_id;
          }

          response = await getArticles(params);

          if (response.success && Array.isArray(response.data)) {
            // Filter Client-Side untuk Pegawais
            visibleArticles = response.data.filter((art) => {
              if (art.status !== "Published") return false;
              // Pegawai bisa lihat Public + Internal OPD
              if (
                art.visibility === "public" ||
                art.visibility === "internal_opd"
              )
                return true;
              return false;
            });
          }
        } else {
          // --- LOGIC MASYARAKAT (PUBLIC) ---
          // Mengambil artikel via endpoint public baru
          response = await getPublicArticles({ limit: 20 });

          if (response.success && Array.isArray(response.data)) {
            // Endpoint public seharusnya sudah memfilter hanya status=Published & visibility=public
            // Tapi kita filter lagi untuk keamanan ganda
            visibleArticles = response.data.filter(
              (art) => art.status === "Published" && art.visibility === "public"
            );
          }
        }

        setArticles(visibleArticles);
      } catch (error) {
        console.error("Gagal memuat artikel:", error);
        // toast.error("Gagal memuat artikel"); // Optional
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  // Filter berdasarkan Kategori yang diklik
  const displayedArticles =
    selectedCategory === "Semua"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Jelajahi Topik Bantuan
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Temukan panduan teknis dan tutorial lengkap.
          </p>
        </div>

        {/* Grid Category (Sebagai Filter) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? "Semua" : cat.name
                )
              }
              className={`p-6 rounded-xl shadow-sm border transition-all cursor-pointer text-center group ${
                selectedCategory === cat.name
                  ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200 dark:bg-slate-800"
                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:-translate-y-1"
              }`}
            >
              <div
                className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <cat.icon size={28} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-[#053F5C] dark:group-hover:text-[#429EBD] transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Artikel List */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiFileText className="text-[#F7AD19]" /> Artikel{" "}
              {selectedCategory !== "Semua"
                ? `- ${selectedCategory}`
                : "Terbaru"}
            </h3>
            {selectedCategory !== "Semua" && (
              <button
                onClick={() => setSelectedCategory("Semua")}
                className="text-sm text-blue-600 hover:underline"
              >
                Lihat Semua
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500 animate-pulse">
              Memuat artikel...
            </div>
          ) : displayedArticles.length > 0 ? (
            <div className="grid gap-4">
              {displayedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="block bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#053F5C] dark:hover:border-[#429EBD] hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="pr-4 w-full">
                      <div className="flex justify-between w-full mb-1">
                        <span className="text-xs font-bold text-[#053F5C] dark:text-[#429EBD] uppercase tracking-wide block">
                          {article.category}
                        </span>
                        {/* Tampilkan Badge Internal hanya jika Login */}
                        {isAuthenticated &&
                          article.visibility === "internal_opd" && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                              INTERNAL
                            </span>
                          )}
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#053F5C] dark:group-hover:text-[#429EBD] mb-2 transition-colors">
                        {article.title}
                      </h4>
                      {/* Gunakan plain text dari content untuk excerpt (strip HTML tags) */}
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {article.content
                          .replace(/<[^>]+>/g, "")
                          .substring(0, 150)}
                        ...
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 group-hover:bg-blue-50 group-hover:text-[#053F5C] dark:group-hover:bg-slate-600 dark:group-hover:text-white transition-colors flex-shrink-0 self-center">
                      <FiArrowRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500">
                Belum ada artikel di kategori ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      <ArticleDetailModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </div>
  );
};

export default KnowledgeBaseGrid;
