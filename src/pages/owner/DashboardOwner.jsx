import React, { useMemo, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Activity, Package, Menu } from "lucide-react";
import DatePicker from "../../components/common/DatePicker";
import OwnerSidebar from "../../components/owner/OwnerSidebar";
import StatCard from "../../components/admin/dashboard/StatCard";
import { useOwnerAnalytics } from "../../hooks/owner/useOwnerAnalytics";
import { useAuth } from "../../context/AuthContext";
import { formatIDR } from "../../utils/formatCurrency";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DashboardOwner = () => {
  const { user } = useAuth();
  const { analytics, isLoading, fetchAnalytics } = useOwnerAnalytics();

  const today = new Date();
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const firstDay = formatLocalDate(new Date(today.getFullYear(), today.getMonth(), 1));
  const lastDay = formatLocalDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));

  const [startDate, setStartDate] = React.useState(firstDay);
  const [endDate, setEndDate] = React.useState(lastDay);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  React.useEffect(() => {
    fetchAnalytics({ startDate: firstDay, endDate: lastDay });
  }, []);

  const handleFilter = () => {
    fetchAnalytics({ startDate, endDate });
  };

  const firstName = useMemo(() => {
    const name = user?.username || user?.name || "Owner";
    return name.split(" ")[0];
  }, [user]);

  const { omzet, netProfit, cashFlow, expenseAnalysis } = analytics;

  const getStatusColor = (status) => {
    if (status === "POSITIVE") return "text-emerald-500 bg-emerald-50";
    if (status === "NEGATIVE") return "text-red-500 bg-red-50";
    return "text-yellow-500 bg-yellow-50";
  };

  const getStatusIcon = (status) => {
    if (status === "POSITIVE") return <TrendingUp size={20} />;
    if (status === "NEGATIVE") return <TrendingDown size={20} />;
    return <Activity size={20} />;
  };

  const topProductData = useMemo(() => {
    if (!omzet?.per_product) return [];
    return omzet.per_product.slice(0, 5).map(p => ({
      name: p.product_name,
      revenue: p.revenue
    }));
  }, [omzet]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#F8FAFC]">
        <OwnerSidebar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
            Memuat data analitik...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden text-[13px]">
      <OwnerSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <main className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        {/* HEADER */}
        <header className="bg-white px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              className="md:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#1a4d2e]"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight mb-0.5">DASHBOARD OWNER</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                Selamat Datang, {firstName}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-1 items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-100 min-w-0">
              <DatePicker 
                value={startDate}
                onChange={setStartDate}
                className="text-xs font-bold text-slate-700"
                placeholder="Start Date"
                label="Start Date"
              />
              <div className="h-6 w-px bg-slate-200 mx-1 flex-shrink-0"></div>
              <DatePicker 
                value={endDate}
                onChange={setEndDate}
                className="text-xs font-bold text-slate-700"
                placeholder="End Date"
                align="right"
                label="End Date"
              />
            </div>
            <button 
              onClick={handleFilter}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all w-full sm:w-auto self-stretch sm:self-auto flex items-center justify-center"
            >
              Filter
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-4 md:p-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar overflow-x-hidden">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              config={{ label: "Total Omzet", icon: DollarSign, variant: "emerald", key: "revenue" }} 
              statData={{ value: formatIDR(omzet?.omzet || 0) }} 
            />
            <StatCard 
              config={{ label: "Laba Bersih", icon: Activity, variant: "blue", key: "revenue" }} 
              statData={{ value: formatIDR(netProfit?.filter_3?.value || 0) }} 
            />
            <StatCard 
              config={{ label: "Total Expenses", icon: TrendingDown, variant: "red", key: "revenue" }} 
              statData={{ value: formatIDR(expenseAnalysis?.total_cost || 0) }} 
            />
            <StatCard 
              config={{ 
                label: "Arus Kas", 
                icon: cashFlow?.status === "POSITIVE" ? TrendingUp : (cashFlow?.status === "NEGATIVE" ? TrendingDown : Activity), 
                variant: cashFlow?.status === "POSITIVE" ? "emerald" : (cashFlow?.status === "NEGATIVE" ? "red" : "amber"), 
                key: "revenue" 
              }} 
              statData={{ 
                value: formatIDR(cashFlow?.net_cash_flow || 0),
                badge: (
                  <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${getStatusColor(cashFlow?.status)}`}>
                    {cashFlow?.status || "BREAK_EVEN"}
                  </div>
                )
              }} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PRODUK TERLARIS */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Produk Terlaris</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Berdasarkan total omzet</p>
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Produk</th>
                      <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Terjual</th>
                      <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Omzet</th>
                      <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Laba Kotor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {omzet?.per_product?.length > 0 ? (
                      omzet.per_product.slice(0, 5).map((prod, idx) => (
                        <tr key={prod.product_id || idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{prod.product_name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                              {prod.qty_sold}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-emerald-600">
                            {formatIDR(prod.revenue)}
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-indigo-600">
                            {formatIDR(prod.gross_profit)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-xs text-slate-400 font-bold">
                          Belum ada data produk terjual.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RINCIAN BIAYA */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Rincian Biaya</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Berdasarkan Kategori</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {expenseAnalysis?.breakdown?.length > 0 ? (
                    expenseAnalysis.breakdown.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{item.category}</span>
                          <span className="text-xs font-bold text-slate-800">{formatIDR(item.total)}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full" 
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        <p className="text-right text-[8px] font-black text-slate-400 mt-1">{Number(item.percent).toFixed(1)}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-slate-400 font-bold py-4">Belum ada data pengeluaran.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOwner;