import React from "react";
import { LayoutGrid } from "lucide-react";

const CategorySection = ({
  categories,
  activeFilters,
  toggleFilter,
  setActiveFilters,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full bg-[#FBFBFB] py-10 md:py-14 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2D5A43]/10 flex items-center justify-center">
              <LayoutGrid size={13} className="text-[#2D5A43]" />
            </div>
            <div>
              <p className="text-[8px] font-black text-[#2D5A43] uppercase tracking-[0.25em] leading-none mb-0.5">
                Filter Belanja
              </p>
              <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                Kategori <span className="text-[#2D5A43]">Pilihan</span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => setActiveFilters([])}
            className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-all self-start sm:self-auto border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg bg-white"
          >
            {activeFilters.length > 0 ? "Reset Filter" : "Semua Kategori"}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => toggleFilter(cat)}
              className={`p-4 rounded-xl cursor-pointer transition-all border flex flex-col items-center justify-center gap-2.5 w-[140px] md:w-[160px] ${
                activeFilters.includes(cat)
                  ? "border-[#2D5A43] bg-[#F8FAF9] shadow-sm"
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-colors ${
                  activeFilters.includes(cat)
                    ? "bg-[#2D5A43] text-white"
                    : "bg-gray-50 text-[#2D5A43]"
                }`}
              >
                {cat.charAt(0).toUpperCase()}
              </div>
              <p
                className={`text-center font-black uppercase text-[9px] tracking-widest line-clamp-1 ${
                  activeFilters.includes(cat)
                    ? "text-[#2D5A43]"
                    : "text-gray-600"
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
