import React, { useState } from "react";
import { FiFileText, FiServer } from "react-icons/fi";
import HelpdeskComplaintForm from "../features/new-ticket/components/HelpdeskComplaintForm";
import HelpdeskRequestForm from "../features/new-ticket/components/HelpdeskRequestForm";

const NewTicket = () => {
  const [activeTab, setActiveTab] = useState("complaint");

  const baseTabClass =
    "flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm transition-colors";
  const activeTabClass =
    "bg-[#9FE7F5] dark:bg-slate-800 text-[#053F5C] dark:text-[#9FE7F5] shadow-md";
  const inactiveTabClass =
    "bg-slate-200 dark:bg-slate-700/50 text-slate-500 hover:bg-[#9FE7F5] dark:hover:bg-slate-700 cursor-pointer";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl text-center  md:text-3xl font-bold text-slate-900 dark:text-white">
        Buat Tiket Baru
      </h1>

      <div className="flex flex-col md:flex-row mx-auto p-1 gap-2 bg-slate-200 dark:bg-slate-900 rounded-lg overflow-hidden max-w-md">
        <button
          onClick={() => setActiveTab("complaint")}
          className={`${baseTabClass} rounded-md ${
            activeTab === "complaint" ? activeTabClass : inactiveTabClass
          }`}
        >
          <FiFileText size={20} />
          <span className="text-base">Tiket Pengaduan</span>
        </button>
        <button
          onClick={() => setActiveTab("request")}
          className={`${baseTabClass} rounded-md ${
            activeTab === "request" ? activeTabClass : inactiveTabClass
          }`}
        >
          <FiServer size={20} />
          <span className="text-base">Tiket Permintaan</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
        {activeTab === "complaint" ? (
          <HelpdeskComplaintForm />
        ) : (
          <HelpdeskRequestForm />
        )}
      </div>
    </div>
  );
};

export default NewTicket;
