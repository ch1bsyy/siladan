import React, { useState } from "react";

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

const categories = [
  {
    id: 1,
    name: "Perangkat Keras",
    icon: FiMonitor,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: 2,
    name: "Jaringan & Internet",
    icon: FiWifi,
    color: "text-green-600 bg-green-50",
  },
  {
    id: 3,
    name: "Aplikasi & Software",
    icon: LuAppWindow,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: 4,
    name: "Keamanan Akun",
    icon: FiShield,
    color: "text-red-600 bg-red-50",
  },
];

const popularArticles = [
  {
    id: 1,
    title: "Cara Mengatasi Printer Error 505",
    category: "Perangkat Keras",
    author: "Teknisi Budi",
    date: "20 Nov 2023",
    tags: ["printer", "troubleshoot", "hardware"],
    excerpt:
      "Panduan langkah demi langkah memperbaiki spooler printer yang macet...",
    content: `
      <h3>Gejala Masalah</h3>
      <p>Printer tidak merespon perintah cetak meskipun kabel sudah terhubung dan indikator menyala. Muncul notifikasi "Error 505" di layar komputer.</p>
      
      <h3>Langkah Penyelesaian</h3>
      <ol>
        <li>Buka <strong>Control Panel</strong> > <strong>Devices and Printers</strong>.</li>
        <li>Klik kanan pada icon printer yang bermasalah, pilih <strong>See what's printing</strong>.</li>
        <li>Klik menu <strong>Printer</strong> di pojok kiri atas jendela baru, pilih <strong>Cancel All Documents</strong>.</li>
        <li>Tekan tombol <strong>Windows + R</strong>, ketik <code>services.msc</code> lalu Enter.</li>
        <li>Cari layanan bernama <strong>Print Spooler</strong>. Klik kanan dan pilih <strong>Restart</strong>.</li>
      </ol>
      <p>Coba cetak kembali dokumen Anda.</p>
    `,
  },
  {
    id: 2,
    title: "Panduan Koneksi VPN dari Rumah",
    category: "Jaringan",
    author: "Andi Network",
    date: "15 Nov 2023",
    tags: ["vpn", "wfh", "security"],
    excerpt: "Setting VPN Client untuk akses intranet saat WFH...",
    content: `
      <p>Untuk mengakses aplikasi internal saat bekerja dari rumah (WFH), Anda perlu mengaktifkan VPN Dinas.</p>
      <h3>Persiapan</h3>
      <ul>
        <li>Pastikan sudah menginstal aplikasi <strong>FortiClient VPN</strong>.</li>
        <li>Memiliki username dan password akun domain (sama dengan login PC kantor).</li>
      </ul>
      <h3>Konfigurasi</h3>
      <p>Masukkan IP Gateway: <strong>vpn.pemkot-surabaya.go.id</strong> dan port <strong>443</strong>.</p>
    `,
  },
  {
    id: 3,
    title: "Lupa Password Email Dinas?",
    category: "Keamanan Akun",
    author: "Admin Helpdesk",
    date: "10 Okt 2023",
    tags: ["email", "password", "reset"],
    excerpt: "Prosedur reset password mandiri melalui portal SSO...",
    content: `
      <p>Jangan panik jika lupa password email. Ikuti panduan reset mandiri berikut:</p>
      <ol>
        <li>Kunjungi portal <a href="#" class="text-blue-600 underline">sso.surabaya.go.id</a>.</li>
        <li>Klik tombol <strong>Lupa Password</strong> di bawah form login.</li>
        <li>Masukkan NIP dan Nomor HP yang terdaftar di SI-SDMK.</li>
        <li>Kode OTP akan dikirim via WhatsApp. Masukkan kode tersebut.</li>
        <li>Buat password baru (Minimal 8 karakter, kombinasi huruf dan angka).</li>
      </ol>
    `,
  },
  {
    id: 4,
    title: "Install Sertifikat Elektronik (TTE)",
    category: "Aplikasi",
    author: "Tim BSrE",
    date: "05 Nov 2023",
    tags: ["tte", "tanda tangan", "digital"],
    excerpt:
      "Cara memasang sertifikat digital untuk tanda tangan elektronik...",
    content:
      "<p>Panduan instalasi sertifikat elektronik Balai Sertifikasi Elektronik (BSrE) pada Adobe Reader DC...</p>",
  },
  {
    id: 5,
    title: "Panduan Zoom Meeting Aman",
    category: "Aplikasi",
    author: "Seksi Infrastruktur",
    date: "01 Des 2023",
    tags: ["zoom", "meeting", "tips"],
    excerpt: "Best practice keamanan saat melakukan video conference...",
    content:
      "<p>Tips mengamankan ruang meeting virtual agar tidak disusupi pihak tidak bertanggung jawab...</p>",
  },
];

// Article Modal
const ArticleDetailModal = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        {/* Header Sticky */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 z-10">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 uppercase tracking-wide">
                {article.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <FiCalendar size={12} /> {article.date}
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin">
          {/* Author Info */}
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

          {/* Article Content */}
          <div className="prose prose-slate dark:prose-invert dark:text-white max-w-none prose-headings:font-bold prose-h3:text-lg prose-a:text-blue-600">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
              <FiTag size={16} /> Topik Terkait:
            </p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const KnowledgeBaseGrid = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

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

        {/* Grid Category */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer text-center group"
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <FiFileText className="text-[#F7AD19]" /> Artikel Terbaru Minggu Ini
          </h3>
          <div className="grid gap-4">
            {popularArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="block bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#053F5C] dark:hover:border-[#429EBD] hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="pr-4">
                    <span className="text-xs font-bold text-[#053F5C] dark:text-[#429EBD] uppercase tracking-wide mb-1 block">
                      {article.category}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#053F5C] dark:group-hover:text-[#429EBD] mb-2 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 group-hover:bg-blue-50 group-hover:text-[#053F5C] dark:group-hover:bg-slate-600 dark:group-hover:text-white transition-colors flex-shrink-0">
                    <FiArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
