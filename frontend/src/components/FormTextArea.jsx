import React from "react";

const FormTextArea = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
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

      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        {...props}
        className={`block text-sm md:text-base w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#429EBD] focus:border-[#429EBD] sm:text-sm transition-colors duration-200 ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-slate-300 dark:border-slate-600"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormTextArea;
