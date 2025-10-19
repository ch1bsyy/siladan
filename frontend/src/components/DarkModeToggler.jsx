import React from "react";
import { useDarkMode } from "../context/ThemeContext";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";

const DarkModeToggler = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-full transition-colors duration-300 bg-slate-200 text-[#429EBD] hover:bg-slate-300 dark:bg-slate-800 dark:text-[#F7AD19] dark:hover:bg-slate-700 cursor-pointer"
    >
      {darkMode ? <BsSunFill size={20} /> : <BsMoonStarsFill size={20} />}
    </button>
  );
};

export default DarkModeToggler;
