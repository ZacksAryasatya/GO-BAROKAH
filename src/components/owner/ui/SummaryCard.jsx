import React from 'react';

export const SummaryCard = ({ title, value, subtitle, isCurrency = false, isWarning = false, isSuccess = false, isDanger = false }) => {
  let cardStyles = "border-slate-100";
  let textStyles = "text-[#0f1d37]";

  if (isWarning) {
    cardStyles = "border-amber-100 bg-[#fffdf5]";
    textStyles = "text-amber-600";
  } else if (isSuccess) {
    cardStyles = "border-emerald-100 bg-[#f6fdf9]";
    textStyles = "text-emerald-600";
  } else if (isDanger) {
    cardStyles = "border-rose-100 bg-[#fff8f8]";
    textStyles = "text-rose-600";
  }

  const formattedValue = typeof value === 'number'
    ? isCurrency ? `Rp ${value.toLocaleString('id-ID')}` : value.toLocaleString('id-ID')
    : value;

  return (
    <div className={`bg-white p-5 rounded-2xl border ${cardStyles} shadow-[0_2px_8px_rgba(11,22,44,0.02)] space-y-1.5 transition-all`}>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
      <span className={`text-[22px] font-black tracking-tight block ${textStyles}`}>
        {formattedValue}
      </span>
      <span className="text-[11px] text-slate-400 block font-medium">{subtitle}</span>
    </div>
  );
};