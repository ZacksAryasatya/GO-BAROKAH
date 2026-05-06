import React from "react";
import { Search } from "lucide-react";

const ProductFilterBar = ({ search, onSearchChange, activecat, onCatChange, categories = [] }) => {
  const filterOptions = ["Semua", ...categories.map(c => c.name)];

  return (
    <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
        {filterOptions.map((cat) => (
          <button
            key={cat}
            onClick={() => onCatChange(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200
              ${activecat === cat
                ? "bg-[#1a4d2e] text-white shadow-lg shadow-emerald-900/20"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-72 group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4d2e] transition-colors" />
        <input
          type="text"
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
        />
      </div>
    </div>
  );
};

export default ProductFilterBar;