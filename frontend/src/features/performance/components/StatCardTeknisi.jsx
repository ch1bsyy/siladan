/* eslint-disable no-unused-vars */
import React from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const StatCardTeknisi = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}) => {
  // Mapping color
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-transform hover:-translate-y-1 duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            {value}
          </h3>
        </div>
        <div
          className={`p-3 rounded-lg ${
            colorClasses[color] || colorClasses.blue
          }`}
        >
          <Icon size={24} />
        </div>
      </div>

      {/* Trend Section (Opsional) */}
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={`font-medium flex items-center gap-1 ${
              trend === "up"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend === "up" ? <FiArrowUp /> : <FiArrowDown />} {trendValue}
          </span>
          <span className="ml-2 text-slate-400 dark:text-slate-500">
            vs bulan lalu
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCardTeknisi;
