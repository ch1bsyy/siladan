import React from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiLayers, FiClock, FiArrowRight } from "react-icons/fi";
import { TfiTimer } from "react-icons/tfi";

const actions = [
  {
    title: "Kelola Pengguna",
    desc: "Atur role & permission staf",
    icon: FiUsers,
    to: "/dashboard/users",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Atur SLA",
    desc: "Konfigurasi target waktu",
    icon: TfiTimer,
    to: "/dashboard/settings/sla",
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Jam Operasional",
    desc: "Set hari libur & jam kerja",
    icon: FiClock,
    to: "/dashboard/settings/operational",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Katalog Layanan",
    desc: "Tambah jenis layanan baru",
    icon: FiLayers,
    to: "/dashboard/catalog",
    color: "bg-green-100 text-green-600",
  },
];

const QuickActionsWidgetOPD = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 h-full">
      <h3 className="text-lg font-semibold text-center text-slate-900 dark:text-white mb-4">
        Aksi Cepat
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className="flex flex-col items-center p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
          >
            <div
              className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
            >
              <action.icon size={20} />
            </div>
            <div className="flex-1 text-center mt-2">
              <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#053F5C] dark:group-hover:text-[#9FE7F5] transition-colors">
                {action.title}
              </h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {action.desc}
              </p>
            </div>
            <FiArrowRight className="text-slate-600 dark:text-slate-300 self-end opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsWidgetOPD;
