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
        <label htmlFor={id} className="block font-medium text-gray-700">
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
          className={`block w-full min-h-[44px] min-w-[44px] px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-colors duration-200 ${
            error
              ? "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
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
