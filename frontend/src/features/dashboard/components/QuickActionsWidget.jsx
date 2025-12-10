import React from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const QuickActionsWidget = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg text-center font-semibold text-slate-900 dark:text-white mb-4">
        Aksi Cepat
      </h3>
      <Link
        to="/dashboard/new-ticket"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C] transition-colors"
      >
        <FiPlus size={18} />
        <span>Buat Tiket Baru</span>
      </Link>
    </div>
  );
};

export default QuickActionsWidget;
