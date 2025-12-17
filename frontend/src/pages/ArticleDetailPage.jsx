import React from "react";
import parse from "html-react-parser";
import {
  FiCalendar,
  FiUser,
  FiTag,
  FiBookmark,
  FiShare2,
} from "react-icons/fi";

const ArticleDetailPage = ({ article }) => {
  if (!article) return null;

  // --- HELPER: Pembersih Konten Duplikat ---
  const cleanContent = (htmlString) => {
    if (!htmlString) return "";
    let cleaned = htmlString;

    const duplicateSeparator = /<hr\/><p>\s*<h3>Gejala Masalah<\/h3>/i;

    if (duplicateSeparator.test(cleaned)) {
      // Ambil bagian SEBELUM separator duplikasi
      cleaned = cleaned.split(duplicateSeparator)[0];
    }

    // 2. Pembersihan standar lainnya
    cleaned = cleaned.replace(/<hr\/>\s*<hr\/>/g, "<hr/>");
    cleaned = cleaned.replace(/<p><br><\/p>/g, "");

    return cleaned;
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      {/* --- HEADER ARTIKEL --- */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Kategori & Status */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {article.category}
            </span>
            {article.status === "Published" && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-100 text-green-700">
                Published
              </span>
            )}
          </div>

          {/* Judul */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#053F5C] text-white flex items-center justify-center font-bold text-xs">
                {article.author ? article.author.charAt(0) : "A"}
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {article.author || "Tim Teknis SILADAN"}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <FiCalendar />
              <span>{article.date || "Tanggal tidak tersedia"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT BODY --- */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <article className="flex-1 w-full min-w-0">
            <div
              className="article-content text-slate-700 dark:text-slate-300 leading-relaxed
                [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:dark:text-white [&>h3]:mt-8 [&>h3]:mb-4
                [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mt-6 [&>h4]:mb-3
                [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5
                [&>hr]:my-8 [&>hr]:border-slate-200 [&>hr]:dark:border-slate-700
                [&>div]:mb-4
            "
            >
              {parse(cleanContent(article.content || ""))}
            </div>
          </article>

          {/* Sidebar / Tags */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
            {article.tags && article.tags.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiTag /> Topik Terkait
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(
                    (tag, idx) =>
                      tag &&
                      tag.trim() !== "" && (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer transition"
                        >
                          #{tag}
                        </span>
                      )
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
