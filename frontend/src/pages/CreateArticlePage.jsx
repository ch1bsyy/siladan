import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiSave,
  FiSend,
  FiArrowLeft,
  FiInfo,
  FiFileText,
  FiTag,
  FiMonitor,
} from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";
import Input from "../components/Input";
import FormTextArea from "../components/FormTextArea";
import FormSelect from "../components/FormSelect";
import JoditEditor from "jodit-react";

// Import Service
import { createArticle } from "../features/knowledge-base/services/articleService";

const CreateArticlePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const editor = useRef(null);

  // --- Initial State ---
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    visibility: "internal_teknis", // Default teknisi
    tags: "",
    symptoms: "",
    rootCause: "",
    solution: "", // Ini akan diisi oleh Jodit
    // relatedAsset: "", // Backend belum support di payload contoh, bisa diabaikan atau masuk content
    // ticketReference: "",
  });

  // --- Jodit Config ---
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder:
        "Tuliskan langkah-langkah perbaikan secara detail di sini...",
      height: 400,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      uploader: {
        insertImageAsBase64URI: true, // Upload gambar base64
      },
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    []
  );

  // --- SMART CONVERT LOGIC (Dari Tiket -> Artikel) ---
  useEffect(() => {
    if (state?.ticketData) {
      const ticket = state.ticketData;
      toast("Mode Konversi Tiket Aktif", { icon: "🪄" });

      // Convert worklogs to list items
      const solutionSteps = ticket.worklogs?.length
        ? `<ul>${ticket.worklogs
            .map((w) => `<li>${w.activity}</li>`)
            .join("")}</ul>`
        : "";

      setFormData((prev) => ({
        ...prev,
        title: `Solusi: ${ticket.title}`,
        // ticketReference: ticket.id,
        category: "Hardware", // Default atau mapping dari ticket.category
        symptoms: ticket.description || "",
        solution: `<p><strong>Berdasarkan penyelesaian tiket ${ticket.id}:</strong></p>${solutionSteps}`,
      }));
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({ ...prev, solution: newContent }));
  };

  const handleSubmit = async (actionType) => {
    // Validasi
    const isSolutionEmpty =
      !formData.solution || formData.solution === "<p><br></p>";

    if (!formData.title || isSolutionEmpty) {
      toast.error("Judul dan Langkah Penyelesaian wajib diisi!");
      return;
    }

    showLoading(
      actionType === "draft" ? "Menyimpan Draft..." : "Mengirim ke Admin OPD..."
    );

    try {
      // 1. Prepare Payload sesuai API
      // Tags dari string "a, b, c" menjadi array ["a", "b", "c"]
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [];

      // Content utama artikel adalah gabungan atau field terpisah?
      // Sesuai payload contoh: ada field 'content', 'symptoms', 'rootCause', 'solution'.
      // Kita pakai 'content' untuk menyimpan full article body (Jodit result)
      // Field lain disimpan terpisah sebagai metadata terstruktur.

      const payload = {
        title: formData.title,
        category: formData.category,
        visibility: formData.visibility,
        tags: tagsArray,
        symptoms: formData.symptoms,
        rootCause: formData.rootCause,
        solution: formData.solution, // HTML content dari Jodit
        content: formData.solution, // Redundant/Fallback jika backend butuh 'content'
        // Status tidak dikirim di sini karena default backend = "Menunggu Review" / Draft
      };

      // 2. Call API
      await createArticle(payload);

      toast.success(
        actionType === "draft"
          ? "Artikel berhasil disimpan sebagai Draft"
          : "Artikel berhasil dikirim untuk Review"
      );

      // Redirect kembali ke dashboard atau list artikel
      navigate("/dashboard/knowledge-base"); // Sesuaikan route list artikel Anda
    } catch (error) {
      console.error("Create Article Error:", error);
      toast.error(
        "Gagal membuat artikel: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Buat Artikel Solusi
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Bagikan pengetahuan teknis untuk membantu tim dan pengguna.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-[#053F5C] dark:hover:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FiArrowLeft size={20} /> Batal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT FORM (Main Content) --- */}
        <div className="lg:col-span-2 space-y-6">
          {/*Section A: Metadata */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FiInfo size={20} className="text-[#F7AD19]" /> Informasi Dasar
            </h2>
            <div className="space-y-4">
              <Input
                id="title"
                name="title"
                label="Judul Artikel"
                placeholder="Contoh: Cara Mengatasi Printer Error 505"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  id="category"
                  name="category"
                  label="Kategori"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  <option value="Hardware">Hardware & Peripherals</option>
                  <option value="Software">Software & OS</option>
                  <option value="Jaringan">Jaringan & Internet</option>
                  <option value="Aplikasi">Aplikasi SILADAN</option>
                  <option value="Kepegawaian">Layanan Kepegawaian</option>
                </FormSelect>

                <FormSelect
                  id="visibility"
                  name="visibility"
                  label="Target Pembaca"
                  value={formData.visibility}
                  onChange={handleChange}
                  required
                >
                  <option value="public">Publik (Masyarakat & Pegawai)</option>
                  <option value="internal_opd">
                    Internal Pemerintah (Semua OPD)
                  </option>
                  <option value="internal_teknis">
                    Teknis (Hanya Teknisi/IT)
                  </option>
                </FormSelect>
              </div>
              <Input
                id="tags"
                name="tags"
                label="Kata Kunci (Tags)"
                placeholder="Pisahkan dengan koma (misal: printer, error, windows)"
                value={formData.tags}
                onChange={handleChange}
                rightIcon={<FiTag className="text-slate-400" />}
              />
            </div>
          </div>

          {/* Section B: Main Content */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FiFileText size={20} className="text-[#F7AD19]" /> Konten Solusi
            </h2>
            <div className="space-y-6">
              <FormTextArea
                id="symptoms"
                name="symptoms"
                label="Gejala / Deskripsi Masalah"
                placeholder="Jelaskan apa yang dialami pengguna..."
                rows={3}
                value={formData.symptoms}
                onChange={handleChange}
              />

              <FormTextArea
                id="rootCause"
                name="rootCause"
                label="Penyebab (Root Cause) - Opsional"
                placeholder="Jelaskan teknis penyebab masalah..."
                rows={2}
                value={formData.rootCause}
                onChange={handleChange}
              />

              <div className="space-y-1">
                <label className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Langkah Penyelesaian (Step-by-Step){" "}
                  <span className="text-red-500">*</span>
                </label>

                {/* JODIT EDITOR */}
                <div className="prose-editor text-black">
                  <JoditEditor
                    ref={editor}
                    value={formData.solution}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => handleEditorChange(newContent)}
                  />
                </div>

                <p className="text-xs text-slate-500 italic mt-1">
                  * Anda dapat menyisipkan gambar dan tabel langsung di editor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT FORM (Support) --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Reference Panel (Optional, tidak dikirim ke backend tapi berguna buat UI) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FiMonitor size={20} className="text-[#F7AD19]" /> Referensi
            </h3>
            <div className="space-y-4">
              {state?.ticketData && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800 text-sm">
                  <p className="font-bold text-blue-800 dark:text-blue-300">
                    Tiket Sumber:
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    {state.ticketData.ticketNumber || state.ticketData.id}
                  </p>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Artikel ini akan dibuat dengan status awal{" "}
                <strong>Menunggu Review</strong> oleh Admin OPD sebelum
                dipublikasikan.
              </p>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              Aksi Publikasi
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSubmit("review")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#053F5C] text-white font-bold rounded-lg hover:bg-[#075075] transition-all active:scale-95 cursor-pointer"
              >
                <FiSend size={18} /> Kirim ke Admin
              </button>
              {/* Draft button logic is same for backend (POST /articles), 
                  status management usually handled by backend default or update later */}
              <button
                onClick={() => handleSubmit("draft")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer"
              >
                <FiSave size={18} /> Simpan Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticlePage;
