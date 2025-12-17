import React, { useState, useEffect, useMemo } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { useAuth } from "../../../context/AuthContext";
import { getFAQs, getPublicFAQs } from "../../settings/services/faqService";
import toast from "react-hot-toast";

const FAQSection = ({ searchQuery }) => {
  const { isAuthenticated, user } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [selectedOpd, setSelectedOpd] = useState("Semua");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isInternal = isAuthenticated && user?.role?.name !== "masyarakat";

  useEffect(() => {
    const fetchFaqData = async () => {
      setLoading(true);
      try {
        let response;
        if (isInternal) {
          response = await getFAQs();
        } else {
          response = await getPublicFAQs();
        }

        if (response.status && Array.isArray(response.data)) {
          setFaqs(response.data);
        } else {
          setFaqs([]);
        }
      } catch (error) {
        console.error("Gagal memuat FAQ:", error);
        toast.error("Gagal memuat informasi FAQ.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, [isInternal]);

  // Extract Unique OPD List for Dropdown (Hanya untuk Public View)
  const opdList = useMemo(() => {
    if (isInternal) return [];
    const opds = faqs
      .map((item) => item.opd?.name)
      .filter((name, index, self) => name && self.indexOf(name) === index);
    return opds;
  }, [faqs, isInternal]);

  // Filter Logic
  const filteredFaq = useMemo(() => {
    let data = faqs;

    // 1. Filter OPD (Internal/External logic)
    if (!isInternal && selectedOpd !== "Semua") {
      data = data.filter((item) => item.opd?.name === selectedOpd);
    }

    // 2. Filter Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.question.toLowerCase().includes(lowerQuery) ||
          item.answer.toLowerCase().includes(lowerQuery)
      );
    }

    return data;
  }, [faqs, selectedOpd, isInternal, searchQuery]);

  if (searchQuery && filteredFaq.length === 0) {
    return null;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Pertanyaan Sering Diajukan
          </h2>
          {isInternal && (
            <p className="text-sm text-slate-500 mt-1">
              FAQ Internal - {user?.opd?.name}
            </p>
          )}
        </div>

        {/* Filter Dropdown (Hanya Tampil untuk Masyarakat) */}
        {!isInternal && (
          <div className="relative w-full md:w-64">
            <LuBuilding2
              className="absolute left-3 top-3 text-slate-500 dark:text-slate-400"
              size={18}
            />
            <select
              value={selectedOpd}
              onChange={(e) => setSelectedOpd(e.target.value)}
              disabled={loading}
              className="w-full min-h-11 pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#053F5C] outline-none cursor-pointer shadow-sm appearance-none disabled:opacity-50"
            >
              <option value="Semua">Semua Instansi</option>
              {opdList.map((opdName, index) => (
                <option key={index} value={opdName}>
                  {opdName}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FiChevronDown className="text-slate-500" />
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 text-slate-500 animate-pulse">
          Memuat pertanyaan...
        </div>
      )}

      {/* Accordion List */}
      {!loading && (
        <div className="space-y-4">
          {filteredFaq.length > 0 ? (
            filteredFaq.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full flex justify-between items-center p-4 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-base pr-4">
                    {item.question}
                  </span>
                  {openId === item.id ? (
                    <FiChevronUp
                      size={20}
                      className="text-[#F7AD19] flex-shrink-0"
                    />
                  ) : (
                    <FiChevronDown
                      size={20}
                      className="text-slate-400 flex-shrink-0"
                    />
                  )}
                </button>

                {openId === item.id && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed animate-fade-in-down">
                    {!isInternal && item.opd?.name && (
                      <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 rounded-full">
                        {item.opd.name}
                      </span>
                    )}
                    <div className="whitespace-pre-wrap ">{item.answer}</div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">
                Tidak ditemukan FAQ yang cocok.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQSection;
