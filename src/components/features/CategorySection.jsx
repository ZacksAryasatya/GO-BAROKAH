import React from "react";
import { LayoutGrid, RotateCcw } from "lucide-react";

const CategorySection = ({
  categories,
  activeFilters,
  toggleFilter,
  setActiveFilters,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full bg-[#FBFBFB] pt-8 md:pt-10 pb-0 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="flex items-center gap-2.5 mb-5">
          {/* Icon Header */}
          <div className="w-8 h-8 rounded-lg bg-[#2D5A43]/10 flex items-center justify-center shrink-0">
            <LayoutGrid size={14} className="text-[#2D5A43]" />
          </div>
          <div>
            <p className="text-[8px] font-black text-[#2D5A43] uppercase tracking-[0.25em] leading-none mb-0.5">
              Filter kategori
            </p>
            <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Kategori <span className="text-[#2D5A43]">PRODUK</span>
            </h2>
          </div>
        </div>
        
        {/* Container Scroll Horizontal */}
        <div className="flex items-center overflow-x-auto gap-3 md:gap-4 pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* ICON RESET */}
          <button
            onClick={() => setActiveFilters([])}
            title="Reset Filter"
            className={`shrink-0 snap-start w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
              activeFilters.length > 0
                ? "border-red-200 bg-red-50 text-red-500 shadow-sm hover:bg-red-100"
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <RotateCcw size={14} strokeWidth={2.5} />
          </button>

          {/* Kotak Kategori */}
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => toggleFilter(cat)}
              className={`shrink-0 flex-1 snap-start px-6 py-3 md:px-10 md:py-3.5 rounded-xl cursor-pointer transition-all border flex items-center justify-center min-w-[130px] md:min-w-[160px] ${
                activeFilters.includes(cat)
                  ? "border-[#2D5A43] bg-[#2D5A43] shadow-md"
                  : "bg-white border-gray-200 hover:border-[#2D5A43] hover:shadow-sm"
              }`}
            >
              <p
                className={`font-black uppercase text-[10px] md:text-xs tracking-widest whitespace-nowrap transition-colors ${
                  activeFilters.includes(cat)
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {cat}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;