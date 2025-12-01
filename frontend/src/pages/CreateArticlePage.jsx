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
  FiPaperclip,
  FiMonitor,
} from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";
import Input from "../components/Input";
import FormTextArea from "../components/FormTextArea";
import FormFileUpload from "../components/FormFileUpload";
import FormSelect from "../components/FormSelect";
import JoditEditor from "jodit-react";

const CreateArticlePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const editor = useRef(null);

  // --- Initial State ---
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    visibility: "internal_teknis",
    tags: "",
    symptoms: "",
    rootCause: "",
    solution: "",
    relatedAsset: "",
    ticketReference: "",
    attachment: null,
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
        insertImageAsBase64URI: true,
      },
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    []
  );

  // --- SMART CONVERT LOGIC ---
  useEffect(() => {
    if (state?.ticketData) {
      const ticket = state.ticketData;
      toast("Mode Konversi Tiket Aktif", { icon: "🪄" });

      setFormData((prev) => ({
        ...prev,
        title: `Solusi: ${ticket.title}`,
        ticketReference: ticket.id,
        category: ticket.details?.kategori || "Hardware",
        symptoms: ticket.details?.deskripsi || "",
        // Ambil solusi dari worklog terakhir teknisi (Simulasi)
        solution: ticket.worklogs?.length
          ? `<p><strong>Berdasarkan penyelesaian tiket ${ticket.id}:</strong></p><ul>` +
            ticket.worklogs.map((w) => `<li>${w.activity}</li>`).join("") +
            `</ul>`
          : "",
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File maksimal 5MB");
      return;
    }
    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, attachment: null }));
    if (editor.current) {
      editor.current.value = "";
    }
  };

  const handleSubmit = (status) => {
    // validasi content Jodit
    const isSolutionEmpty =
      !formData.solution || formData.solution === "<p><br></p>";

    if (!formData.title || isSolutionEmpty) {
      toast.error("Judul dan Langkah Penyelesaian wajib diisi!");
      return;
    }

    showLoading(
      status === "draft" ? "Menyimpan Draft..." : "Mengirim ke Admin OPD..."
    );

    // Simulation API Call
    setTimeout(() => {
      hideLoading();
      toast.success(
        status === "draft"
          ? "Artikel berhasil disimpan sebagai Draft"
          : "Artikel dikirim untuk Review Admin"
      );
      navigate("/dashboard");
    }, 1000);
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

                {/* IMPLEMENTATION JODIT EDITOR */}
                <div className="prose-editor">
                  <JoditEditor
                    ref={editor}
                    value={formData.solution}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => handleEditorChange(newContent)}
                    // eslint-disable-next-line no-unused-vars
                    onChange={(newContent) => {}}
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
          {/* Support Panel */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FiPaperclip size={20} className="text-[#F7AD19]" /> Data
              Pendukung
            </h3>
            <div className="space-y-4">
              <FormFileUpload
                id="attachment"
                name="attachment"
                label="Lampiran (Driver/Manual)"
                file={formData.attachment}
                onChange={handleFileChange}
                onClear={clearFile}
                ref={editor}
              />

              <Input
                id="ticketReference"
                name="ticketReference"
                label="Referensi Tiket (Source)"
                placeholder="Contoh: TK-2023-001"
                value={formData.ticketReference}
                onChange={handleChange}
                disabled={!!state?.ticketData}
                rightIcon={<FiTag className="text-slate-400" />}
              />

              <div>
                <label className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Relasi Aset
                </label>
                <div className="relative">
                  <FiMonitor
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                  />
                  <input
                    type="text"
                    name="relatedAsset"
                    value={formData.relatedAsset}
                    onChange={handleChange}
                    placeholder="Cari aset terkait..."
                    className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#053F5C] dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              Status:{" "}
              <span className="text-slate-500 font-normal">Draft Baru</span>
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSubmit("review")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#053F5C] text-white font-bold rounded-lg hover:bg-[#075075] transition-all active:scale-95"
              >
                <FiSend size={18} /> Kirim ke Admin
              </button>
              <button
                onClick={() => handleSubmit("draft")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-all"
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
