import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4  text-sm md:text-base text-slate-700 dark:text-slate-300">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 disabled:opacity-50 hover:cursor-pointer"
      >
        <FiChevronLeft size={18} />
        <span>Sebelumnya</span>
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 disabled:opacity-50 hover:cursor-pointer"
      >
        <span>Selanjutnya</span>
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
