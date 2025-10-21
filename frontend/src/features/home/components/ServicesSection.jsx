import React from "react";
import { FiAlertTriangle, FiHardDrive } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MdOutlineDoubleArrow } from "react-icons/md";

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#9FE7F5]/10 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#053F5C] dark:text-white">
            Layanan Utama Kami
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Kami melayani kebutuhan pengaduan aset dan permintaan layanan TI
            untuk mendukung operasional pemerintahan.
          </p>
        </div>

        {/* Grid Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="flex flex-col justify-between p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-2xl">
            <div>
              <div className="flex justify-center items-center gap-4">
                <div className="flex-shrink-0">
                  <FiAlertTriangle
                    size={36}
                    className="text-[#916610] dark:text-[#F7AD19]"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#053F5C] dark:text-white">
                  Pengaduan Aset & Insiden
                </h3>
              </div>

              <p className="mt-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                Laporkan Kerusakan Aset TI, gangguan jaringan, atau insiden
                keamanan.
                <span className="block font-medium mt-4">
                  (Terbuka untuk Masyarakat & Pegawai)
                </span>
              </p>
            </div>
            <Link
              to="/complaint"
              className="mt-6 min-w-[44px] min-h-[44px] flex flex-row justify-center px-3 py-2 bg-[#053F5C] dark:bg-[#053F5C]/80 rounded-md items-center gap-1 font-semibold text-[#9FE7F5] dark:text-[#9FE7F5] hover:underline hover:scale-102 duration-200"
            >
              <span>Buat Pengaduan</span>
              <MdOutlineDoubleArrow size={20} />
            </Link>
          </div>

          <div className="flex flex-col justify-between p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-2xl">
            <div>
              <div className="flex justify-center items-center gap-4">
                <div className="flex-shrink-0">
                  <FiHardDrive
                    size={36}
                    className="text-[#916610] dark:text-[#F7AD19]"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#053F5C] dark:text-white">
                  Permintaan Layanan TI
                </h3>
              </div>

              <p className="mt-6 text-slate-600 dark:text-slate-300">
                Permintaan instalasi software, backup data, atau layanan TI
                pendukung lainnya.
              </p>
              <div className="mt-5">
                <span className="inline-block bg-[#429EBD] dark:bg-blue-900/90 text-white dark:text-[#9FE7F5] text-sm font-semibold px-3 py-2 rounded-full">
                  Khusus Pegawai OPD
                </span>
              </div>
            </div>
            <Link
              to="/request"
              className="mt-6 min-w-[44px] min-h-[44px] flex flex-row justify-center px-3 py-2 bg-[#053F5C] dark:bg-[#053F5C]/80 rounded-md items-center gap-1 font-semibold text-[#9FE7F5] dark:text-[#9FE7F5] hover:underline hover:scale-102 duration-200"
            >
              <span>Buat Permintaan</span>
              <MdOutlineDoubleArrow size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
