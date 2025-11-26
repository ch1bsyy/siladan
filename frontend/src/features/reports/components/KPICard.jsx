/* eslint-disable no-unused-vars */
import React from "react";

const KPICard = ({ title, value, subtext, icon: Icon, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </h3>
        {subtext && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {subtext}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default KPICard;
