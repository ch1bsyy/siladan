import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiGlobe,
  FiLock,
  FiUsers,
  FiFileText,
  FiServer,
  FiShield,
  FiWifi,
  FiBookOpen,
  FiMonitor,
  FiX,
} from "react-icons/fi";

const mockKBArticles = [
  {
    id: "KB-001",
    title: "SOP Restart Server Database E-Kinerja",
    category: "Server & Cloud",
    visibility: "internal_teknis", // SECRET
    updatedAt: "20 Nov 2023",
    tags: ["linux", "mysql", "restart"],
    content:
      "<p><strong>PERINGATAN:</strong> Lakukan hanya di jam maintenance (22:00 - 04:00).</p><ol><li>SSH ke 192.168.10.5</li><li>Jalankan <code>sudo systemctl restart mysql</code></li><li>Cek log: <code>tail -f /var/log/mysql/error.log</code></li></ol>",
  },
  {
    id: "KB-002",
    title: "Panduan Koneksi VPN dari Rumah",
    category: "Jaringan",
    visibility: "public",
    updatedAt: "15 Nov 2023",
    tags: ["vpn", "wfh", "forticlient"],
    content:
      "<p>Panduan ini untuk disebarkan ke user.</p><p>Download client di...</p>",
  },
  {
    id: "KB-003",
    title: "Topologi Jaringan Gedung A (Lantai 2)",
    category: "Jaringan",
    visibility: "internal_teknis",
    updatedAt: "10 Okt 2023",
    tags: ["switch", "cisco", "vlan"],
    content:
      "<p>Switch Core ada di Ruang Server Lt 1. Uplink ke lantai 2 menggunakan FO Single Mode.</p>",
  },
  {
    id: "KB-004",
    title: "Prosedur Reset Password Akun E-Gov",
    category: "Aplikasi",
    visibility: "internal_opd",
    updatedAt: "05 Nov 2023",
    tags: ["password", "sso", "reset"],
    content:
      "<p>Pegawai wajib melampirkan foto ID Card saat meminta reset manual ke Helpdesk.</p>",
  },
  {
    id: "KB-005",
    title: "Troubleshoot Printer Epson L3110 (Blinking)",
    category: "Hardware",
    visibility: "public",
    updatedAt: "01 Des 2023",
    tags: ["printer", "epson", "maintenance"],
    content:
      "<p>Cek indikator tinta. Jika penuh tapi blinking, reset counter menggunakan tool adjustment.</p>",
  },
];

// Badge Visibility
const VisibilityBadge = ({ type }) => {
  const config = {
    public: {
      icon: FiGlobe,
      label: "Publik",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    internal_opd: {
      icon: FiUsers,
      label: "Internal OPD",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    internal_teknis: {
      icon: FiLock,
      label: "Restricted (Teknis)",
      color: "bg-red-100 text-red-700 border-red-200",
    },
  };
  const { icon: Icon, label, color } = config[type] || config.internal_teknis;

  return (
    <span
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-bold border ${color}`}
    >
      <Icon size={12} /> {label}
    </span>
  );
};

// Modal Baca Artikel
const ReadArticleModal = ({ article, onClose }) => {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <VisibilityBadge type={article.visibility} />
              <span className="text-[13px] text-slate-500 dark:text-slate-400">
                Updated: {article.updatedAt}
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
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN PAGE
   ========================================== */
const TechnicianKBPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [selectedArticle, setSelectedArticle] = useState(null);

  // List Kategori (Unik dari data)
  const categories = [
    "Semua",
    "Server & Cloud",
    "Jaringan",
    "Aplikasi",
    "Hardware",
  ];

  // Filter Logic
  const filteredArticles = useMemo(() => {
    return mockKBArticles.filter((art) => {
      const matchSearch =
        art.title.toLowerCase().includes(search.toLowerCase()) ||
        art.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );
      const matchCat =
        categoryFilter === "Semua" || art.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

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
        <div className="hidden md:flex gap-2">
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
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

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
