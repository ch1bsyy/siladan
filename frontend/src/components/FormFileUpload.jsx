import React, { forwardRef } from "react";
import { FiFile, FiUploadCloud, FiXCircle } from "react-icons/fi";

const FormFileUpload = forwardRef(
  ({ id, label, error, onChange, file, onClear }, ref) => {
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

        {file ? (
          <div className="flex items-center justify-between p-3 border border-green-500 rounded-md bg-green-50 dark:bg-green-900/30">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <FiFile />
              <span className="text-sm font-medium truncate">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
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
                    onChange={onChange}
                    accept="image/png, image/jpeg, application/pdf"
                    ref={ref}
                  />
                </label>
              </div>
              <p className="text-xs lg:text-sm text-slate-500">
                PNG, JPG, PDF (Maks. 5MB)
              </p>
            </div>
          </div>
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

export default FormFileUpload;
