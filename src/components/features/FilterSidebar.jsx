import React from 'react';
import { SlidersHorizontal } from 'lucide-react'; 

const FilterSidebar = ({ categories, activeFilters, onFilterChange, onClear, hideHeader }) => {
  return (
    <aside className="w-full shrink-0">
      {!hideHeader && (
        <div className="flex items-center gap-3 mb-6">
          <SlidersHorizontal size={18} className="text-[#2D5A43]" strokeWidth={2.5} />
          <h3 className="font-black text-[13px] uppercase tracking-[0.15em] text-[#2D5A43]">
            Kategori
          </h3>
          {activeFilters.length > 0 && (
            <button onClick={onClear} className="ml-auto text-[9px] text-red-400 font-bold uppercase tracking-wider hover:text-red-600 transition-colors">
              Clear
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        {categories.map(c => {
          const isActive = activeFilters.includes(c);
          return (
            <label 
              key={c} 
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 group
                ${isActive ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={() => onFilterChange(c)}
                  className="peer w-4 h-4 appearance-none rounded border-2 border-slate-200 checked:border-[#2D5A43] checked:bg-[#2D5A43] transition-all cursor-pointer" 
                />
                <svg 
                  className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <span className={`text-[11px] font-bold tracking-tight transition-colors ${
                isActive ? 'text-[#2D5A43]' : 'text-slate-500 group-hover:text-slate-900'
              }`}>
                {c}
              </span>
            </label>
          );
        })}
      </div>
    </aside>
  );
};

export default FilterSidebar;