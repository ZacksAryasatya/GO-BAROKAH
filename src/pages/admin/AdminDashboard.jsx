import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AlertTriangle, Search, Loader2, XCircle } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { STAT_CONFIG } from "../../constants/adminConstants";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/dashboard/StatCard";
import OrderRow from "../../components/admin/dashboard/OrderRow";
import StockAlertItem from "../../components/admin/StockAlertItem";

import { useAdminOrders } from "../../hooks/admin/useAdminOrders";
import { useAdminProducts } from "../../hooks/admin/useAdminProducts";

const LoadingSkeleton = () => (
  <div className="flex h-screen bg-[#F8FAFC]">
    <AdminSidebar />
    <main className="flex-1 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
        Memuat data dashboard...
      </p>
    </main>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex h-screen bg-[#F8FAFC] items-center justify-center p-8">
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-50 flex flex-col items-center text-center max-w-md">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <XCircle size={32} />
      </div>
      <h2 className="text-lg font-black text-slate-900 mb-2 uppercase">Gagal Memuat Data</h2>
      <p className="text-sm text-slate-500 mb-8">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
      >
        Coba Lagi
      </button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { orders, isLoading: ordersLoading } = useAdminOrders();
  const { products, isLoading: productsLoading } = useAdminProducts();

  const isLoading = ordersLoading || productsLoading;
  
  const firstName = useMemo(() => {
    const name = user?.username || user?.name || "Admin";
    return name.split(" ")[0];
  }, [user]);

  const formatRupiahUtuh = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  const recentOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    let filteredOrders = orders;
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredOrders = filteredOrders.filter(o => 
        o.customer_name?.toLowerCase().includes(lowerSearch) ||
        o.id.toString().includes(search) ||
        o.order_number?.toLowerCase().includes(lowerSearch)
      );
    }

    return filteredOrders.slice(0, 5).map(o => ({
      id: o.id, 
      customer: o.customer_name,
      date: o.created_at || "N/A", 
      total: formatRupiahUtuh(o.total_price),
      status: o.status
    }));
  }, [orders, search]);

  const CRITICAL_LIMIT = 10;

  const lowStockProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return products
      .filter(p => p.stock <= CRITICAL_LIMIT)
      .slice(0, 5) 
      .map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        maxStock: 100, 
        unit: p.type?.name || "Pcs"
      }));
  }, [products]);

  const statsData = useMemo(() => {
    if (!orders || !products) return {};

    const packOrdersCount = orders.filter(o => o.status === "Menunggu" || o.status === "Disiapkan").length;
    
    const shipOrdersCount = orders.filter(o => o.status === "Dikirim").length;
    
    const pickupOrdersCount = orders.filter(o => o.status === "Dapat Diambil").length;
    
    const criticalStockCount = products.filter(p => p.stock <= CRITICAL_LIMIT).length;

    return {
      packOrders: { value: packOrdersCount, growth: 0 },
      shipOrders: { value: shipOrdersCount, growth: 0 },
      pickupOrders: { value: pickupOrdersCount, growth: 0 },
      criticalStock: { value: criticalStockCount, growth: 0 },
    };
  }, [orders, products]);

  if (isLoading) return <LoadingSkeleton />;
  if (!orders && !products) return <ErrorState message="Data dashboard kosong." />;

  const lowStockCount = lowStockProducts.length;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden text-[13px]">
      <AdminSidebar user={user} alertCount={lowStockCount} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[72px] bg-white border-b border-slate-100 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">DASHBOARD ADMIN</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Selamat datang kembali, <span className="text-emerald-600">{firstName}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari transaksi..."
                className="pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-64 focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STAT_CONFIG.map((config) => (
              <StatCard
                key={config.key}
                config={config}
                statData={statsData[config.key] ?? { value: 0, growth: 0 }}
              />
            ))}
          </section>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
            <section className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[520px]">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 flex-shrink-0">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Transaksi Terakhir</h3>
                <button 
                  onClick={() => navigate("/admin/orders")}
                  className="group flex items-center gap-2 text-[10px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl transition-all uppercase tracking-tighter"
                >
                  Buka Laporan
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => <OrderRow key={order.id} order={order} />)
                ) : (
                  <div className="py-20 text-center opacity-30 font-black uppercase text-[10px] tracking-widest">
                    Data transaksi kosong
                  </div>
                )}
              </div>
            </section>
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[520px]">
              <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-50 flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Stok Kritis</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Butuh pengadaan segera</p>
                </div>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((item) => <StockAlertItem key={item.id} item={item} />)
                ) : (
                  <div className="py-20 text-center opacity-30 font-black uppercase text-[10px] tracking-widest">
                    Persediaan aman
                  </div>
                )}
              </div>
              <div className="p-6 pt-0 flex-shrink-0">
                <button 
                  onClick={() => navigate("/admin/inventory")}
                  className="w-full py-4 bg-[#1a4d2e] hover:bg-black text-white rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all uppercase active:scale-95"
                >
                  Cek Inventaris
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;