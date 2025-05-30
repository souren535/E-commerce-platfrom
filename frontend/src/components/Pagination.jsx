import React from "react";
import { useSelector } from "react-redux";

const Pagination = ({
  currentPage,
  onPageChange,
  activeClass = "active",
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "1st",
  lastPageText = "Last",
}) => {
  const { totalPages, products } = useSelector((state) => state.product);

  if (!products || products.length === 0 || totalPages <= 1) {
    return null;
  }

  const generateNumber = () => {
    const pageNumbers = [];
    const pageWindow = 2;

    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="flex gap-1 p-2 md:gap-4 md:p-4 items-center rounded-b-[8px] justify-center mt-10  ">
      {/* First and Prev buttons */}
      {currentPage > 1 && (
        <>
          <button
            className="px-[8px] md:text-base md:px-4 md-py-2 py-[5px] text-2xl text-white font-semibold  bg-gray-500 rounded-md cursor-pointer transition-all ease-in-out hover:bg-zinc-800 shadow-md"
            onClick={() => onPageChange(1)}
          >
            {firstPageText}
          </button>
          <button
            className="px-[8px] md:text-base md:px-4 md-py-2 py-[5px] text-2xl text-white font-semibold  bg-gray-500 rounded-md cursor-pointer transition-all ease-in-out hover:bg-zinc-800 shadow-md"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {prevPageText}
          </button>
        </>
      )}

      {/* Page Numbers */}
      {generateNumber().map((number) => (
        <button
          onClick={() => onPageChange(number)}
          key={number}
          className={`px-[8px] md:text-base md:px-4 md-py-2 py-[5px] text-2xl text-white font-semibold  bg-gray-500 rounded-md cursor-pointer transition-all ease-in-out hover:bg-zinc-800 shadow-md ${
            currentPage === number ? activeClass : ""
          }`}
        >
          {number}
        </button>
      ))}

      {/* Next and Last buttons */}
      {currentPage < totalPages && (
        <>
          <button
            className="px-[8px] md:text-base md:px-4 md-py-2 py-[5px] text-2xl text-white font-semibold  bg-gray-500 rounded-md cursor-pointer transition-all ease-in-out hover:bg-zinc-800 shadow-md"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {nextPageText}
          </button>
          <button
            className="px-[8px] md:text-base md:px-4 md-py-2 py-[5px] text-2xl text-white font-semibold  bg-gray-500 rounded-md cursor-pointer transition-all ease-in-out hover:bg-zinc-800 shadow-md"
            onClick={() => onPageChange(totalPages)}
          >
            {lastPageText}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
