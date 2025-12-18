import React from "react";
import { Link } from "react-router-dom";
import { FiFilePlus, FiSearch } from "react-icons/fi";
import HeroIlustration from "../../../assets/images/hero-section.png";

const HeroSection = () => {
  return (
    <section className="relative bg-white/20 dark:bg-[#053F5C]/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center py-4 md:pb-10">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#053F5C] dark:text-white leading-tight">
              Sistem Informasi
              <span className="block mt-1 underline decoration-[#429EBD] dark:decoration-[#9FE7F5] decoration-4 underline-offset-8">
                Layanan dan Aduan
              </span>
            </h1>

            <p className="mt-8 text-lg text-[#053F5C] dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Kami hadir sebagai platform digital yang memudahkan masyarakat
              untuk menyampaikan keluhan, laporan, dan masukan terkait layanan
              teknologi informasi. Dengan sistem yang terintegrasi dan
              responsif, setiap aduan Anda akan ditangani secara profesional dan
              transparan.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/complaint"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C] dark:bg-[#9FE7F5] dark:text-[#053F5C] dark:hover:bg-white shadow-lg transition-colors duration-300"
              >
                <FiFilePlus size={20} />
                <span>Buat Pengaduan</span>
              </Link>
              <Link
                to="/track-ticket"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-[#429EBD] hover:bg-[#429EBD]/10 text-[#053F5C] dark:text-[#9FE7F5] dark:border-[#9FE7F5] dark:hover:bg-[#9FE7F5]/10 transition-colors duration-300"
              >
                <FiSearch size={20} />
                <span>Lacak Tiket Anda</span>
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={HeroIlustration}
              alt="Hero Image"
              className="w-full h-80 object-contain lg:w-140 lg:h-140 lg:object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
