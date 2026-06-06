import React from 'react';

export const MetricCard = ({ icon, label, value, bg = "bg-slate-100", textStyle = "text-slate-600" }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-3">
    <div className={`p-2.5 rounded-lg ${bg} ${textStyle} flex items-center justify-center shrink-0`}>{icon}</div>
    <div>
      <span className="text-[10px] font-bold text-slate-400 uppercase block">{label}</span>
      <span className="text-xl font-black text-slate-900">{value}</span>
    </div>
  </div>
);