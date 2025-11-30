import React from "react";
import { FiUsers, FiClock } from "react-icons/fi";

const mockTechnicians = [
  { name: "Teknisi Budi", status: "Available", count: 0 },
  { name: "Teknisi Ani", status: "Busy", count: 5 },
  { name: "Teknisi Charlie", status: "On Break", count: 0 },
  { name: "Teknisi Dedi", status: "Available", count: 1 },
];

const TechnicianStatusWidget = () => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "Busy":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "On Break":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <FiUsers className="text-[#053F5C] dark:text-[#9FE7F5]" size={20} />
        Status Tim Teknisi
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {mockTechnicians.map((tech, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-2 items-center md:justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  tech.status === "Available"
                    ? "bg-green-500"
                    : tech.status === "Busy"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {tech.name}
              </span>
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold border ${getStatusStyle(
                tech.status
              )}`}
            >
              {tech.status === "Busy"
                ? `${tech.status} (${tech.count})`
                : tech.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
          <FiClock size={12} /> Update Realtime
        </p>
      </div>
    </div>
  );
};

export default TechnicianStatusWidget;
