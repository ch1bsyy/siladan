import React, { useState, useEffect } from "react";
import {
  FiMonitor,
  FiWifi,
  FiShield,
  FiFileText,
  FiX,
  FiArrowRight,
  FiSearch,
} from "react-icons/fi";
import { LuAppWindow } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import {
  getArticles,
  getPublicArticles,
} from "../../knowledge-base/services/articleService";
import ArticleDetailPage from "../../../pages/ArticleDetailPage";

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
    name: "Software",
    icon: LuAppWindow,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: 4,
    name: "Account",
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

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all"
          title="Tutup"
        >
          <FiX size={24} />
        </button>

        <div className="overflow-y-auto h-full scrollbar-thin">
          <ArticleDetailPage article={article} />
        </div>
      </div>
    </div>
  );
};

// Main Component
const KnowledgeBaseGrid = ({ searchQuery }) => {
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
        let params = {
          limit: 20,
          page: 1,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (selectedCategory !== "Semua") {
          params.category = selectedCategory;
        }

        if (isAuthenticated) {
          // --- LOGIC PEGAWAI (LOGIN) ---
          params.status = "Published";
          if (user?.opd_id) {
            params.opd_id = user.opd_id;
          }

          response = await getArticles(params);
        } else {
          // --- LOGIC MASYARAKAT (PUBLIC) ---

          response = await getPublicArticles(params);
        }

        if (response.success && Array.isArray(response.data)) {
          let visibleArticles = response.data;

          if (isAuthenticated) {
            visibleArticles = response.data.filter((art) => {
              if (art.status !== "Published") return false;
              return (
                art.visibility === "public" || art.visibility === "internal_opd"
              );
            });
          }

          setArticles(visibleArticles);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Gagal memuat artikel:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, selectedCategory, searchQuery]);

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
          ) : articles.length > 0 ? (
            <div className="grid gap-4">
              {articles.map((article) => (
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
              <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                <FiSearch className="text-slate-400" size={24} />
              </div>
              <p className="text-slate-500">
                {searchQuery
                  ? `Tidak ditemukan artikel untuk pencarian "${searchQuery}"`
                  : "Belum ada artikel di kategori ini."}
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
