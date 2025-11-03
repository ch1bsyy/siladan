/* eslint-disable no-unused-vars */
import React from "react";

const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="flex items-center px-4 py-4 md:py-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <div
        className={`flex-shrink-0 p-3 rounded-full ${colorClass} text-white mr-4`}
      >
        <Icon className="w-7 h-7 md:w-9 md:h-9 object-cover" />
      </div>
      <div>
        <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
