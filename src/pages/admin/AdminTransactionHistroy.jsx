import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Search, Loader2, Wallet, Clock, 
  CheckCircle2, XCircle, CreditCard, Calendar, Store, Truck, Package, Eye, Menu
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import OrderDetailModal from "../../components/admin/order/OrderDetailModal";
import { useAdminOrders } from "../../hooks/admin/useAdminOrders";

const formatRupiahUtuh = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

const PER_PAGE = 10;
const TABS = ["Semua", "Selesai", "Dibatalkan"];

const STATUS_CONFIG = {
  "Selesai": { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={10} /> },
  "Menunggu": { bg: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={10} /> },
  "Disiapkan": { bg: "bg-blue-50 text-blue-600 border-blue-100", icon: <Package size={10} /> },
  "Dapat Diambil": { bg: "bg-orange-50 text-orange-600 border-orange-100", icon: <Store size={10} /> },
  "Dikirim": { bg: "bg-purple-50 text-purple-600 border-purple-100", icon: <Truck size={10} /> },
  "Dibatalkan": { bg: "bg-red-50 text-red-600 border-red-100", icon: <XCircle size={10} /> },
};

const AdminTransactionHistory = () => {
  const { orders, isLoading } = useAdminOrders();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [page, setPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const tableScrollRef = useRef(null);

  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const filteredData = useMemo(() => {
    return orders.filter((o) => {
      if (o.status !== "Selesai" && o.status !== "Dibatalkan") return false;

      const matchTab = activeTab === "Semua" || o.status === activeTab;
      const matchSearch = o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.id.toString().includes(search) || o.order_number?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, search]);



  const totalPages = Math.ceil(filteredData.length / PER_PAGE) || 1;
  const paginatedItems = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 bg-[#F8FAFC]">
          <div className="px-4 md:px-8 pt-4 md:pt-8 flex items-center justify-between gap-4 bg-[#F8FAFC]">
            <div className="flex items-center gap-3 md:gap-0">
              <button className="md:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#1a4d2e] relative z-50" onClick={() => setIsMobileOpen(true)}>
                <Menu size={20} />
              </button>
              <div className="transition-all duration-500">
                <h1 className="text-xl font-black tracking-tight uppercase">Riwayat Pesanan</h1>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em] hidden md:block">Semua Riwayat Pesanan UD BAROKAH</p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-[#F8FAFC]">
            <SearchInput value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {TABS.map(t => (
                <TabButton key={t} label={t} active={activeTab === t} onClick={() => { setActiveTab(t); setPage(1); }} />
              ))}
            </div>
          </div>
        </div>
        <main className="flex-1 px-4 md:px-8 pb-4 md:pb-8 flex flex-col min-h-0 mt-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar" ref={tableScrollRef}>
              <table className="w-full border-collapse min-w-[700px]">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                  <tr>
                    {["ID", "Pelanggan", "Tanggal", "Pengiriman", "Pembayaran", "Total", "Status", "Aksi"].map((h) => (
                      <th key={h} className={`px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ${h === 'Aksi' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? <LoadingState /> : paginatedItems.length === 0 ? <EmptyState /> : (
                    <>
                      {paginatedItems.map((o) => <TableRow key={o.id} order={o} onOpenDetail={openDetail} />)}
                      {paginatedItems.length < PER_PAGE && <tr style={{ height: `${(PER_PAGE - paginatedItems.length) * 68}px` }}><td colSpan={8} /></tr>}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </main>
      </div>

      <OrderDetailModal 
        isOpen={isModalOpen}
        order={selectedOrder} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

const SearchInput = ({ value, onChange }) => (
  <div className="relative flex-1 group">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4d2e] transition-colors" size={14} />
    <input 
      type="text" 
      placeholder="Cari transaksi..." 
      className="w-full bg-white border border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all shadow-sm" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  </div>
);

const TabButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${active ? "bg-[#1a4d2e] text-white border-[#1a4d2e] shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}
  >
    {label}
  </button>
);

const LoadingState = () => (
  <tr>
    <td colSpan={8} className="py-24 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Memuat...</p>
    </td>
  </tr>
);

const EmptyState = () => (
  <tr>
    <td colSpan={8} className="py-24 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
      DATA TIDAK DITEMUKAN
    </td>
  </tr>
);

const TableRow = ({ order, onOpenDetail }) => {
  const config = STATUS_CONFIG[order.status];
  
  const isPaid = order.payment_status === "PAID" || order.paymentStatus === "PAID" || order.payment_status === "SUCCESS" || order.payment_status === "SETTLED";
  const paymentLabel = isPaid ? "Lunas" : order.is_pickup ? "Bayar di Toko" : "Belum Lunas";
  const paymentStyle = isPaid ? "text-emerald-600 bg-emerald-50 border-emerald-100" : order.is_pickup ? "text-amber-600 bg-amber-50 border-amber-100" : "text-red-600 bg-red-50 border-red-100";

  return (
    <tr className="hover:bg-slate-50/50 transition-colors h-[68px]">
      <td className="px-4 py-5"><span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">#{order.id}</span></td>
      <td className="px-4 py-5">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase truncate tracking-tight text-slate-700">
            {order.customer_name}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase">
            {order.customer_phone || "-"}
          </span>
        </div>
      </td>
      <td className="px-4 py-5 text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">{order.created_at}</td>
      <td className="px-4 py-5">
        <div className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded-lg border uppercase whitespace-nowrap ${order.is_pickup ? "text-orange-600 bg-orange-50 border-orange-100" : "text-blue-600 bg-blue-50 border-blue-100"}`}>
          {order.is_pickup ? <><Store size={12} /> Ambil di Toko</> : <><Truck size={12} /> Kirim Kurir</>}
        </div>
      </td>
      <td className="px-4 py-5">
        <div className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded-lg border uppercase whitespace-nowrap ${paymentStyle}`}>
          <CreditCard size={12} /> {paymentLabel}
        </div>
      </td>
      {/* Pake formatRupiahUtuh di sini */}
      <td className="px-4 py-5 text-xs font-black text-slate-900 tabular-nums whitespace-nowrap">{formatRupiahUtuh(order.total_price)}</td>
      <td className="px-4 py-5">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${config?.bg} ${config?.text} ${config?.border}`}>
          {config?.icon} {order.status}
        </div>
      </td>
      <td className="px-4 py-5 text-right">
        <div className="flex justify-end">
          <button
            onClick={() => onOpenDetail(order)}
            title="Detail Pesanan"
            className="p-2.5 rounded-xl transition-all shadow-sm border active:scale-95 bg-white text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center w-9 h-9"
          >
            <Eye size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => (
  <footer className="px-4 md:px-8 py-4 border-t border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white flex-shrink-0">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
    <div className="flex gap-1.5">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm active:scale-95"><ChevronLeft size={16} /></button>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm active:scale-95"><ChevronRight size={16} /></button>
    </div>
  </footer>
);

export default AdminTransactionHistory;