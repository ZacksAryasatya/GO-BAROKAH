import React from 'react';

export const StatCard = ({ title, value, icon, suffix = "", isCurrency, isHighlight }) => {
  const valueColor = isHighlight ? "text-[#fa5252]" : "text-[#0f1d37]";
  
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(11,22,44,0.02)] flex flex-col justify-between space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-1.5 rounded-lg bg-[#f3f6f9] text-slate-400 [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className={`font-bold tracking-tight ${valueColor} ${isCurrency ? 'text-base' : 'text-[22px]'}`}>
          {value}
        </span>
        {!isCurrency && suffix && (
          <span className="text-[11px] text-slate-400 font-bold ml-0.5">{suffix}</span>
        )}
      </div>
    </div>
  );
};