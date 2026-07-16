import React from "react";

const InventoryStatCard = ({ label, value, icon, iconBg, items }) => {
  return (
    <div className="relative group z-10 hover:z-50">
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-0 group-hover:rounded-b-none transition-all duration-300 relative z-20">
        <div className={`flex-shrink-0 w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider truncate">
            {label}
          </span>
          <span className="text-base font-black text-slate-900 leading-none mt-0.5">
            {value}
          </span>
        </div>
      </div>

      {items && (
        <div className="absolute top-full left-0 w-full bg-white border border-slate-100 border-t-0 shadow-xl rounded-b-2xl p-2 opacity-0 invisible -translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out max-h-64 overflow-y-auto custom-scrollbar z-10">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 px-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <span className="text-xs font-bold text-slate-700 truncate mr-2">{item.name}</span>
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                  {item.stock} {item.unit || item.type?.name || 'Pcs'}
                </span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Tidak ada data
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryStatCard;