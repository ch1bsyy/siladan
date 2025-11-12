import React, { useState } from "react";

const AssignedTicketPage = () => {
  const [activeTab, setActiveTab] = useState("pengaduan");
  return (
    <div className="space-y-6 dark:text-white">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white ">
          Pengerjaan Tiket
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Kelola seluruh tiket pengaduan dan permintaan yang telah ditugaskan
          kepada Anda.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <TabButton
          label="Pengaduan"
          isActive={activeTab === "pengaduan"}
          onClick={() => setActiveTab("pengaduan")}
        />
        <TabButton
          label="Permintaan"
          isActive={activeTab === "permintaan"}
          onClick={() => setActiveTab("permintaan")}
        />
      </div>
    </div>
  );
};

// Sub Component
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 min-h-[44px] min-w-[44px] font-semibold rounded-full transition-colors ${
      isActive
        ? "bg-[#053F5C] text-white dark:bg-[#429EBD]/40"
        : "text-slate-700 dark:text-slate-300 hover:bg-[#053F5C]/80 hover:text-white dark:hover:text-slate-300 dark:hover:bg-[#429EBD]/20 cursor-pointer"
    }`}
  >
    {label}
  </button>
);

export default AssignedTicketPage;
