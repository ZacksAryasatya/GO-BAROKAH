import React from "react";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  "Menunggu": "bg-amber-50 text-amber-700 border-amber-200",
  "Disiapkan": "bg-blue-50 text-blue-700 border-blue-200",
  "Dikirim": "bg-purple-50 text-purple-700 border-purple-200",
  "Dapat Diambil": "bg-orange-50 text-orange-700 border-orange-200",
  "Selesai": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Dibatalkan": "bg-red-50 text-red-700 border-red-200",
};

const OrderRow = React.memo(({ order }) => {
  const navigate = useNavigate();
  const { id, customer, date, total, status } = order;
  
  const badgeStyle = STATUS_COLORS[status] || "bg-slate-50 text-slate-500 border-slate-200";

  const displayId = String(id).startsWith('#') ? id : `#${id}`;

  return (
    <div 
      onClick={() => navigate('/admin/orders', { state: { searchId: String(id) } })}
      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-all rounded-xl group cursor-pointer border-b border-slate-50 last:border-0"
    >
      
      {/* Badge ID Pendek */}
      <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 font-black text-[10px] uppercase flex-shrink-0">
        {displayId}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate leading-tight">{customer}</p>
        <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{date}</p>
      </div>

      <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
        <p className="text-sm font-black text-slate-900 tabular-nums">
          {total}
        </p>
        {/* Badge Status Warnanya Udah Bener Sesuai Mapping */}
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${badgeStyle}`}>
          {status}
        </span>
      </div>
    </div>
  );
});

export default OrderRow;