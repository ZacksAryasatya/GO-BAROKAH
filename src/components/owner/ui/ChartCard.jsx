import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const ChartCard = ({ title, trend, color, data }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(11,22,44,0.02)] h-60 flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xs font-bold text-[#0f1d37] uppercase tracking-wide">{title}</h3>
      <span className="text-[10px] font-bold text-[#10b981] bg-[#eefbf4] px-1.5 py-0.5 rounded-md">
        <TrendingUp className="h-3 w-3 inline mr-0.5 -mt-0.5"/> {trend}
      </span>
    </div>
    <div className="flex-1 min-h-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc"/>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontClassName="font-medium" />
          <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `${v/1000000}Jt`} />
          <Tooltip formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Laba']} />
          <Area type="monotone" dataKey="laba" stroke={color} fill={color} fillOpacity={0.03} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);