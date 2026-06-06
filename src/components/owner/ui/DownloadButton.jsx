import React from 'react';
import { Download } from 'lucide-react';

export const DownloadButton = ({ label }) => (
  <button className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
    <span className="truncate">{label}</span>
    <Download className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
  </button>
);