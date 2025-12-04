import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";

// MOCK DATA FAQ
const faqData = [
  {
    id: 1,
    opd: "Umum",
    q: "Bagaimana Cara Login SILADAN?",
    a: "Gunakan NIP dan Password default yang diberikan BKD. Jika lupa, gunakan fitur Lupa Password.",
  },
  {
    id: 2,
    opd: "Umum",
    q: "Siapa yang berhak melapor?",
    a: "Seluruh ASN, Tenaga Kontrak, dan Masyarakat umum yang memiliki akun terdaftar.",
  },
  {
    id: 3,
    opd: "Dinas Pendidikan",
    q: "Syarat pengajuan laptop baru guru?",
    a: "Harus melampirkan SK Pengangkatan terakhir dan Surat Rekomendasi Kepala Sekolah.",
  },
  {
    id: 4,
    opd: "Dinas Kesehatan",
    q: "Cara akses WiFi di Puskesmas?",
    a: "Gunakan SSID 'Pemkot_Health', login menggunakan akun SI-SDMK.",
  },
];

const FAQSection = () => {
  const [selectedOpd, setSelectedOpd] = useState("Umum");
  const [openId, setOpenId] = useState(null);

  // Filter Logic
  const filteredFaq = faqData.filter(
    (item) => item.opd === selectedOpd || selectedOpd === "Semua"
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Pertanyaan Sering Diajukan
        </h2>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-64">
          <LuBuilding2
            className="absolute left-3 top-3 text-slate-800 dark:text-slate-200"
            size={18}
          />
          <select
            value={selectedOpd}
            onChange={(e) => setSelectedOpd(e.target.value)}
            className="w-full min-h-11 min-w-11 pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#053F5C] outline-none cursor-pointer shadow-sm appearance-none"
          >
            <option value="Umum">Umum (Seluruh Kota)</option>
            <option value="Dinas Pendidikan">Dinas Pendidikan</option>
            <option value="Dinas Kesehatan">Dinas Kesehatan</option>
            <option value="Semua">Tampilkan Semua</option>
          </select>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaq.length > 0 ? (
          filteredFaq.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex justify-between items-center p-4 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-slate-800 text-base dark:text-slate-200">
                  {item.q}
                </span>
                {openId === item.id ? (
                  <FiChevronUp size={20} className="dark:text-[#F7AD19]" />
                ) : (
                  <FiChevronDown
                    size={20}
                    className="text-slate-500 dark:text-slate-400"
                  />
                )}
              </button>

              {openId === item.id && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm leading-relaxed animate-fade-in-down">
                  {item.opd !== "Umum" && (
                    <span className="text-xs md:text-[13px] font-bold text-[#053F5C] dark:text-[#F7AD19] block mb-1">
                      [{item.opd}]
                    </span>
                  )}
                  {item.a}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 text-base md:text-lg py-8">
            Belum ada FAQ untuk instansi ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
