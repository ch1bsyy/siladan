import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

const quickTags = ["Reset Password", "WiFi Kantor", "Aplikasi", "Panduan"];

const HeroSection = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setTimeout(() => {
      onSearch();
    }, 100);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-gradient-to-r from-[#053F5C] to-[#429EBD] dark:from-[#053F5C] dark:to-slate-800 py-16 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Hai, ada yang bisa kami bantu?
        </h1>
        <p className="text-blue-100 text-lg mb-8">
          Pusat Bantuan Resmi Pemerintah Kota & SILADAN.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-12 py-4 bg-white text-slate-900 rounded-full shadow-lg focus:ring-4 focus:ring-blue-300/30 outline-none text-base placeholder:text-slate-400 transition-all"
            placeholder="Ketik kendala Anda (contoh: WiFi tidak connect, Printer macet)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Button Clear */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              title="Hapus pencarian"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm transition-colors backdrop-blur-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
