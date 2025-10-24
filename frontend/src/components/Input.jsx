import React from "react";

const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  rightIcon,
  onRightIconClick,
  disabled = false,
  ...props
}) => {
  if (type === "checkbox") {
    return (
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={value}
        onChange={onChange}
        {...props}
      />
    );
  }

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

      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
          className={`block text-sm md:text-base w-full min-h-[44px] min-w-[44px] px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400  dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#429EBD] focus:border-[#429EBD] sm:text-sm transition-colors duration-200 ${
            disabled
              ? "bg-slate-100 dark:bg-slate-700 cursor-not-allowed opacity-70"
              : "bg-white dark:bg-slate-800"
          } ${
            error
              ? "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-slate-600"
          } ${rightIcon ? "pr-10" : ""}`}
        />

        {rightIcon && (
          <div
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              onRightIconClick ? "cursor-pointer" : "pointer-events-none"
            }`}
            onClick={onRightIconClick}
            aria-hidden="true"
          >
            <span className={error ? "text-red-500" : "text-gray-400"}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
