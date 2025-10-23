import React from "react";
import { FiUploadCloud } from "react-icons/fi";

const FormFileUpload = ({ id, label, error, ...props }) => {
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

      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          error
            ? "border-red-500"
            : "border-slate-300 dark:border-slate-600 hover:border-[#429EBD]"
        }`}
      >
        <div className="space-y-2 text-center">
          <FiUploadCloud
            className="mx-auto h-12 w-12 text-slate-400"
            aria-hidden="true"
          />

          <div className="flex justify-center text-sm lg:text-base text-slate-600 dark:text-slate-400">
            <label
              htmlFor={id}
              className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-[#429EBD] hover:text-[#053F5C] dark:hover:text-[#9FE7F5] focus-within:outline-none"
            >
              <span>Unggah File</span>
              <input
                id={id}
                name={id}
                type="file"
                className="sr-only"
                {...props}
              />
            </label>
          </div>
          <p className="text-xs lg:text-sm text-slate-500">
            PNG, JPG, PDF (Maks. 5MB)
          </p>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormFileUpload;
