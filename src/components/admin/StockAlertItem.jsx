import React from "react";
import { stockPercent, stockBarColor } from "../../utils/formatters";

const StockAlertItem = ({ item }) => {
  const { name, stock, maxStock, unit } = item;
  const pct = stockPercent(stock, maxStock);
  const color = stockBarColor(pct);

  return (
    <article className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-red-200 hover:shadow-md hover:shadow-red-50 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{pct}% Tersisa</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-red-500 whitespace-nowrap bg-red-50 px-2 py-1 rounded-lg">
            {stock} {unit}
          </span>
        </div>
      </div>

      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={stock}
          aria-valuemin="0"
          aria-valuemax={maxStock}
        />
      </div>
      
      {stock <= 5 && (
        <p className="text-[9px] font-black text-red-400 mt-2 uppercase">
          Stok Kritis - Segera Restock
        </p>
      )}
    </article>
  );
};

export default StockAlertItem;