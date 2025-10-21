import React from "react";
import { FiEdit, FiCheckSquare, FiThumbsUp } from "react-icons/fi";

// steps data
const steps = [
  {
    icon: <FiEdit size={32} />,
    title: "1. Buat Laporan",
    description:
      "Isi formulir pengaduan atau permintaan layanan Anda dengan detail lengkap. Lampirkan foto jika diperlukan.",
  },
  {
    icon: <FiCheckSquare size={32} />,
    title: "2. Verifikasi Tim",
    description:
      "Tim kami (Seksi, Bidang, dan pihak lainnya) akan memvalidasi pengaduan atau permintaan layanan Anda untuk ditindaklanjuti dan diteruskan ke tim teknis.",
  },
  {
    icon: <FiThumbsUp size={32} />,
    title: "3. Selesai & Transparan",
    description:
      "Anda dapat melacak progres tiket Anda kapan saja melalui fitur 'Lacak Tiket' hingga masalah atau permintaan dinyatakan selesai.",
  },
];

const WorkflowSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#053F5C] dark:text-white">
            Alur yang Mudah dan Transparan
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
            Kami memastikan setiap aduan dan layanan ditangani secara
            profesional melalui tiga langkah sederhana berikut:
          </p>
        </div>

        {/* Grid Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {steps.map((step) => (
            <div
              key={step.title}
              className="p-6 bg-slate-100 dark:bg-slate-700/20 rounded-lg shadow-lg text-center transition-transform hover:-translate-y-2 duration-300"
            >
              <div className="flex justify-center text-[#916610] dark:text-[#F7AD19]">
                {step.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#053F5C] dark:text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
