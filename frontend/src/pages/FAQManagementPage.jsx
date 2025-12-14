import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiHelpCircle,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import FAQModal from "../features/settings/components/FAQModal";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../features/settings/services/faqService";

// MOCK DATA
// const initialFAQs = [
//   {
//     id: 1,
//     question: "Bagaimana cara reset password email dinas?",
//     category: "Aplikasi",
//     audience: "public",
//     status: "published",
//     answer: "Buka portal SSO...",
//   },
//   {
//     id: 2,
//     question: "Syarat pengajuan laptop baru?",
//     category: "Hardware",
//     audience: "internal",
//     status: "published",
//     answer: "Isi form A-01...",
//   },
//   {
//     id: 3,
//     question: "Kenapa WiFi 'Pemkot_Secure' tidak muncul?",
//     category: "Jaringan",
//     audience: "internal",
//     status: "draft",
//     answer: "Sedang maintenance...",
//   },
// ];

const FAQManagementPage = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);

  const fetchFAQs = async () => {
    try {
      showLoading("Memuat FAQ...");
      const opdId = user?.opd_id || user?.opd?.id;
      const response = await getFAQs(opdId);

      if (response.success || Array.isArray(response.data)) {
        setFaqs(response.data || []);
      } else if (Array.isArray(response)) {
        setFaqs(response);
      }
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      toast.error("Gagal memuat daftar FAQ");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FILTER LOGIC
  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const q = faq.question || "";

      const matchSearch = q.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || faq.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [faqs, search, statusFilter]);

  const handleAddClick = () => {
    setSelectedFAQ(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (faq) => {
    setSelectedFAQ(faq);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Yakin ingin menghapus FAQ ini?")) {
      try {
        showLoading("Menghapus FAQ...");
        await deleteFAQ(id);
        toast.success("FAQ berhasil dihapus");
        // Update state lokal tanpa fetch ulang
        setFaqs(faqs.filter((f) => f.id !== id));
      } catch (error) {
        console.log(error);
        toast.error("Gagal menghapus FAQ");
      } finally {
        hideLoading();
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      showLoading("Menyimpan FAQ...");
      const opdId = user?.opd_id || user?.opd?.id;

      // Sesuaikan payload dengan spesifikasi API
      const payload = {
        question: formData.question,
        answer: formData.answer,
        opd_id: opdId,
        status: formData.status,

        category: formData.category,
        audience: formData.audience,
      };

      if (selectedFAQ) {
        // Update
        await updateFAQ(selectedFAQ.id, payload);
        toast.success("FAQ berhasil diperbarui");
      } else {
        // Create
        await createFAQ(payload);
        toast.success("FAQ baru berhasil ditambahkan");
      }

      setIsModalOpen(false);
      fetchFAQs(); // Refresh data
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan FAQ");
    } finally {
      hideLoading();
    }
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-2 rounded text-xs md:text-sm font-bold border ${
        status === "published"
          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
      }`}
    >
      {status === "published" ? "Tayang" : "Draft"}
    </span>
  );

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiHelpCircle
              className="text-[#053F5C] dark:text-[#429EBD]"
              size={32}
            />
            Manajemen FAQ
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Kelola daftar pertanyaan umum seputar layanan OPD Anda.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex min-h-11 min-w-11 self-center items-center gap-2 px-4 py-2 bg-[#053F5C] text-white font-bold rounded-lg hover:bg-[#075075] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <FiPlus size={18} /> Tambah FAQ
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Cari pertanyaan atau kategori..."
            leftIcon={<FiSearch className="text-slate-400" size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Status */}
        <div className="w-full md:w-48">
          <FormSelect
            leftIcon={<FiFilter size={16} />}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="published">Tayang (Published)</option>
            <option value="draft">Draft</option>
          </FormSelect>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-1/2">
                  Pertanyaan & Jawaban
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredFAQs.map((faq) => (
                <tr
                  key={faq.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-white text-sm md:text-base mb-1">
                      {faq.question}
                    </p>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {faq.answer}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-center align-top pt-6">
                    <StatusBadge status={faq.status} />
                  </td>
                  <td className="px-6 py-4 text-center align-top pt-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(faq)}
                        className="p-2 flex min-h-11 min-w-11 items-center justify-center text-blue-600 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(faq.id)}
                        className="p-2 flex min-h-11 min-w-11 items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFAQs.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    Tidak ada FAQ yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <FAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedFAQ}
        onSave={handleSave}
      />
    </div>
  );
};

// Sub Component
const Input = ({ label, id, leftIcon, rightIcon, className, ...props }) => (
  <div className="w-full">
    {label && (
      <label
        htmlFor={id}
        className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1"
      >
        {label}
      </label>
    )}
    <div className="relative flex items-center">
      {leftIcon && (
        <span className="absolute left-3 text-slate-400">{leftIcon}</span>
      )}
      <input
        id={id}
        className={`w-full min-h-11 min-w-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#053F5C] focus:ring-1 focus:ring-[#053F5C] dark:bg-slate-900 dark:border-slate-600 dark:text-white outline-none ${
          leftIcon ? "pl-10" : ""
        } ${rightIcon ? "pr-10" : ""} ${className || ""}`}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 text-slate-400">{rightIcon}</span>
      )}
    </div>
  </div>
);

const FormSelect = ({ label, id, children, className, leftIcon, ...props }) => (
  <div className="w-full">
    {label && (
      <label
        htmlFor={id}
        className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1"
      >
        {label}
      </label>
    )}
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {leftIcon}
        </span>
      )}
      <select
        id={id}
        className={`w-full min-h-11 min-w-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#053F5C] focus:ring-1 focus:ring-[#053F5C] dark:bg-slate-900 dark:border-slate-600 dark:text-white outline-none appearance-none cursor-pointer ${
          leftIcon ? "pl-10" : ""
        } ${className || ""}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  </div>
);

export default FAQManagementPage;
