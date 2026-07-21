import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Loader2,
  ShoppingCart,
  Clock,
  Package,
  CheckCircle2,
  Truck,
  XCircle,
  Briefcase,
  RotateCcw,
  Store,
  Ban,
  Inbox,
  Menu
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import InventoryStatCard from "../../components/admin/inventory/InventoryStatCard";
import OrderDetailModal from "../../components/admin/order/OrderDetailModal";
import ConfirmModal from "../../components/forms/ConfirmModal";
import { useAdminOrders } from "../../hooks/admin/useAdminOrders";

const PER_PAGE = 10;
const TABS = [
  "Semua",
  "Menunggu",
  "Disiapkan",
  "Dapat Diambil",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
];

const STATUS_CONFIG = {
  Menunggu: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    icon: <Clock size={10} />,
  },
  Disiapkan: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    icon: <Package size={10} />,
  },
  "Dapat Diambil": {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
    icon: <Store size={10} />,
  },
  Dikirim: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
    icon: <Truck size={10} />,
  },
  Selesai: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    icon: <CheckCircle2 size={10} />,
  },
  Dibatalkan: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    icon: <XCircle size={10} />,
  },
};

const AdminOrders = () => {
  const location = useLocation();
  const { orders, isLoading, handleUpdateStatus } = useAdminOrders();
  const [search, setSearch] = useState(location.state?.searchId || "");
  const [activeTab, setActiveTab] = useState("Semua");
  const [page, setPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const tableScrollRef = useRef(null);

  const formatFullCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
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

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchTab = activeTab === "Semua" || o.status === activeTab;
      const matchSearch =
        o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toString().includes(search) ||
        o.order_number?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, search]);

  const totalPages = Math.ceil(filteredOrders.length / PER_PAGE) || 1;
  const paginatedItems = filteredOrders.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );
  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "Menunggu").length,
      processing: orders.filter((o) => o.status === "Disiapkan").length,
      ready: orders.filter((o) => o.status === "Dapat Diambil").length,
      shipping: orders.filter((o) => o.status === "Dikirim").length,
      finished: orders.filter((o) => o.status === "Selesai").length,
    }),
    [orders],
  );

  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getModalContent = () => {
    if (!confirmAction) return {};
    const { order, status } = confirmAction;

    switch (status) {
      case "Disiapkan":
        return {
          title: "Proses Pesanan?",
          message: `Yakin mau mulai memproses pesanan #${order.id} dari ${order.customer_name}?`,
          btnText: "Ya, Proses",
          variant: "primary"
        };
      case "Dapat Diambil":
        return {
          title: "Tandai Siap Diambil?",
          message: `Pesanan #${order.id} milik ${order.customer_name} sudah siap. Pelanggan akan diberitahu untuk mengambil pesanan di toko.`,
          btnText: "Ya, Siap Diambil",
          variant: "primary"
        };
      case "Dikirim":
        return {
          title: "Kirim Pesanan?",
          message: `Tandai pesanan #${order.id} sedang dalam pengiriman kurir?`,
          btnText: "Ya, Kirim",
          variant: "primary"
        };
      case "Selesai":
        return {
          title: "Selesaikan Pesanan?",
          message: `Pastikan pesanan #${order.id} benar-benar sudah diterima ${order.customer_name}. Selesaikan sekarang?`,
          btnText: "Ya, Selesai",
          variant: "primary"
        };
      case "Menunggu":
        return {
          title: "Kembalikan Status?",
          message: `Yakin mau mengembalikan pesanan #${order.id} ke status Menunggu?`,
          btnText: "Ya, Kembalikan",
          variant: "primary"
        };
      case "Dibatalkan":
        return {
          title: "Batalkan Pesanan?",
          message: `Kamu yakin mau membatalkan pesanan #${order.id} dari ${order.customer_name}?`,
          btnText: "Ya, Batalkan",
          variant: "danger"
        };
      default:
        return {
          title: "Update Status",
          message: "Yakin melanjutkan aksi ini?",
          btnText: "Lanjut",
          variant: "primary"
        };
    }
  };

  const ActionButtons = ({ order }) => {
    const isPaid = order.paymentStatus === "PAID" || order.payment_status === "PAID";
    const btnClass = "p-2.5 rounded-xl transition-all shadow-sm border active:scale-95 flex items-center justify-center";
    const disabledBtnClass = "p-2.5 rounded-xl transition-all shadow-sm border opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200 flex items-center justify-center";

    return (
      <div className="flex justify-end gap-2">
        <button
          onClick={() => openDetail(order)}
          title="Detail Pesanan"
          className={`${btnClass} bg-white text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-300`}
        >
          <Eye size={14} />
        </button>

        {order.status === "Menunggu" && (
          <>
            {isPaid || order.is_pickup ? (
              <button
                onClick={() => setConfirmAction({ order, status: "Disiapkan" })}
                title={order.is_pickup ? "Proses Pesanan (Bayar di Toko)" : "Proses Pesanan"}
                className={`${btnClass} bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-[#1a4d2e] hover:text-white`}
              >
                <Briefcase size={14} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                disabled
                title="Tidak bisa diproses: Pelanggan belum membayar"
                className={disabledBtnClass}
              >
                <Briefcase size={14} strokeWidth={2.5} />
              </button>
            )}
          </>
        )}

        {order.status === "Disiapkan" && (
          <>
            {order.is_pickup ? (
              <button
                onClick={() => setConfirmAction({ order, status: "Dapat Diambil" })}
                className={`${btnClass} bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white`}
              >
                <Store size={14} />
              </button>
            ) : (
              <button
                onClick={() => setConfirmAction({ order, status: "Dikirim" })}
                className={`${btnClass} bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white`}
              >
                <Truck size={14} />
              </button>
            )}
          </>
        )}

        {(order.status === "Dikirim" || order.status === "Dapat Diambil") && (
          <button
            onClick={() => setConfirmAction({ order, status: "Selesai" })}
            className={`${btnClass} bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white`}
          >
            <CheckCircle2 size={14} />
          </button>
        )}
      </div>
    );
  };

  const modalContent = getModalContent();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 bg-[#F8FAFC] relative z-50">
          <div className="px-4 md:px-8 pt-4 md:pt-8 flex justify-between items-center gap-4 bg-[#F8FAFC] relative z-20">
            <div className="flex items-center gap-3 md:gap-0">
              <button className="md:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#1a4d2e] relative z-50" onClick={() => setIsMobileOpen(true)}>
                <Menu size={20} />
              </button>
              <div className="transition-all duration-500">
                <h1 className="text-lg md:text-xl font-black uppercase tracking-tight">
                  Kelola Pesanan
                </h1>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest hidden md:block">
                  Monitoring Pesanan UD BAROKAH
                </p>
              </div>
            </div>
          </div>
          
          <div 
            className={`transition-all duration-500 ease-in-out ${isScrolled ? 'overflow-hidden' : 'overflow-visible relative z-40'}`}
            style={{ maxHeight: isScrolled ? "0px" : "500px", opacity: isScrolled ? 0 : 1 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 px-4 md:px-8 py-4 md:py-6">
            <InventoryStatCard
              label="Total"
              value={stats.total}
              icon={<ShoppingCart size={14} />}
              iconBg="bg-slate-100 text-slate-600"
            />
            <InventoryStatCard
              label="Menunggu"
              value={stats.pending}
              icon={<Clock size={14} />}
              iconBg="bg-amber-50 text-amber-600"
            />
            <InventoryStatCard
              label="Disiapkan"
              value={stats.processing}
              icon={<Package size={14} />}
              iconBg="bg-blue-50 text-blue-600"
            />
            <InventoryStatCard
              label="Siap Ambil"
              value={stats.ready}
              icon={<Store size={14} />}
              iconBg="bg-orange-50 text-orange-600"
            />
            <InventoryStatCard
              label="Dikirim"
              value={stats.shipping}
              icon={<Truck size={14} />}
              iconBg="bg-purple-50 text-purple-600"
            />
            <InventoryStatCard
              label="Selesai"
              value={stats.finished}
              icon={<CheckCircle2 size={14} />}
              iconBg="bg-emerald-50 text-emerald-600"
            />
            </div>
          </div>
          <div
            className={`px-4 md:px-8 py-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-[#F8FAFC] relative z-20`}
          >
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4d2e]"
                size={14}
              />
              <input
                type="text"
                placeholder="Cari Pesanan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white border border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-[11px] font-bold shadow-sm focus:outline-none focus:border-emerald-500/20"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTab(t);
                    setPage(1);
                  }}
                  className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${activeTab === t ? "bg-[#1a4d2e] text-white border-[#1a4d2e] shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <main className="flex-1 px-4 md:px-8 pb-4 md:pb-8 flex flex-col min-h-0 mt-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div
              className="flex-1 overflow-auto custom-scrollbar" 
              ref={tableScrollRef}
            >
              <table className="w-full border-collapse min-w-[700px]">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                  <tr>
                    {[
                      "ID",
                      "Pelanggan",
                      "Tanggal",
                      "Total Bayar",
                      "Pembayaran",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest ${h === "Aksi" ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-24 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          Memuat Data...
                        </p>
                      </td>
                    </tr>
                  ) : paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-24 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        DATA TIDAK DITEMUKAN
                      </td>
                    </tr>
                  ) : (
                    <>
                      {paginatedItems.map((o) => {
                        const isPaid = o.paymentStatus === "PAID" || o.payment_status === "PAID";
                        return (
                          <tr
                            key={o.id}
                            className="hover:bg-slate-50/50 transition-colors h-[68px]"
                          >
                            <td className="px-4 py-5">
                              <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                                #{o.id}
                              </span>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase truncate tracking-tight">
                                  {o.customer_name}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">
                                  {o.customer_phone || "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-5 text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                              {o.created_at}
                            </td>
                            <td className="px-4 py-5 text-xs font-black text-slate-900 whitespace-nowrap">
                              {formatFullCurrency(o.total_price || o.total_amount || 0)}
                            </td>
                            <td className="px-4 py-5">
                              <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider ${
                                  isPaid 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                    : o.is_pickup 
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : "bg-red-50 text-red-500 border-red-100"
                                }`}
                              >
                                {isPaid ? 'Lunas' : o.is_pickup ? 'Bayar di Toko' : 'Belum Dibayar'}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${STATUS_CONFIG[o.status]?.bg} ${STATUS_CONFIG[o.status]?.text} ${STATUS_CONFIG[o.status]?.border}`}
                              >
                                {STATUS_CONFIG[o.status]?.icon} {o.status}
                              </div>
                            </td>
                            <td className="px-4 py-5 text-right">
                              <ActionButtons order={o} />
                            </td>
                          </tr>
                        );
                      })}
                      {paginatedItems.length < PER_PAGE && (
                        <tr
                          style={{
                            height: `${(PER_PAGE - paginatedItems.length) * 68}px`,
                          }}
                        >
                          <td colSpan={7} />
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="px-4 md:px-8 py-4 border-t border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-20"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-20"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </footer>
          </div>
        </main>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          handleUpdateStatus(confirmAction.order.id, confirmAction.status);
          setConfirmAction(null);
        }}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.btnText}
        variant={modalContent.variant}
      />
    </div>
  );
};

export default AdminOrders;