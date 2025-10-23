import React from "react";
import { FiChevronDown } from "react-icons/fi";

const FormSelect = ({
  id,
  label,
  value,
  onChange,
  error,
  children,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          {...props}
          className={`block text-sm md:text-base w-full min-h-[44px] appearance-none pr-10 px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#429EBD] focus:border-[#429EBD] sm:text-sm transition-colors duration-200 ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-slate-300 dark:border-slate-600"
          }`}
        >
          {children}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <FiChevronDown
            className="w-5 h-5 text-dark dark:text-white"
            aria-hidden="true"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelect;
