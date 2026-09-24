import React, { useCallback, useEffect, useState } from "react";
import { Banknote, Calendar, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Eye, FileText, Loader2, Menu, Package, Receipt, Search, User, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import cashSaleService from "../../services/admin/cashSaleService";
import { formatDateID } from "../../utils/formatters";
import { formatFullCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const PAGE_SIZE = 20;
const AdminCashSales = () => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cashSaleService.getCashSales({
        page,
        limit: PAGE_SIZE,
      });
      setSales(Array.isArray(response?.data) ? response.data : []);
      setTotalPages(Math.max(1, Number(response?.meta?.totalPages) || 1));
    } catch (error) {
      setSales([]);
      toast.error(error.response?.data?.message || "Gagal memuat riwayat pembayaran kasir");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredSales = sales.filter((sale) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [sale.sale_number, sale.payment_method, sale.transaction_date, sale.grand_total]
      .some((value) => String(value ?? "").toLowerCase().includes(query));
  });

  const openDetail = async (saleNumber) => {
    setSelectedSale(null);
    setDetailLoading(true);
    try {
      const response = await cashSaleService.getCashSaleByNumber(saleNumber);
      setSelectedSale(response?.data || null);
    } catch (error) {
      const message = error.response?.data?.message || "Gagal memuat detail transaksi";
      toast.error(message, { duration: 6000 });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 px-4 md:px-8 pt-4 md:pt-8 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <button className="md:hidden p-2 -ml-2 rounded-xl text-slate-400" onClick={() => setIsMobileOpen(true)} aria-label="Buka menu">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">Riwayat Pembayaran Kasir</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-[0.15em]">Transaksi tunai dan non-tunai dari seluruh kasir</p>
            </div>
          </div>
          <section className="bg-white p-2 rounded-2xl shadow-sm flex items-center transition-all focus-within:ring-1 focus-within:ring-emerald-500/20">
            <div className="relative w-full group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a4d2e] transition-colors" />
              <input
                type="text"
                placeholder="Cari nomor transaksi atau metode pembayaran..."
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                className="w-full pl-11 pr-4 py-2.5 bg-transparent border-transparent focus:border-transparent focus:ring-0 outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium shadow-none"
              />
            </div>
          </section>
        </header>

        <section className="flex-1 min-h-0 px-4 md:px-8 pb-4 md:pb-8">
          <div className="h-full bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full border-collapse min-w-[650px]">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                  <tr>{["Nomor Transaksi", "Tanggal", "Metode Pembayaran", "Total", "Aksi"].map((label) => <th key={label} className={`px-5 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ${label === "Aksi" ? "text-right" : "text-left"}`}>{label}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="py-24 text-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" /><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Memuat transaksi...</p></td></tr>
                  ) : filteredSales.length === 0 ? (
                    <tr><td colSpan={5} className="py-24 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum ada transaksi kasir</td></tr>
                  ) : filteredSales.map((sale) => (
                    <tr key={sale.sale_number} className="h-[68px] hover:bg-slate-50/60">
                      <td className="px-5 py-4 text-xs font-black text-slate-700">{sale.sale_number}</td>
                      <td className="px-5 py-4 text-[10px] font-bold text-slate-500 whitespace-nowrap">{formatDateID(sale.transaction_date)}</td>
                      <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-[9px] font-black text-emerald-700 uppercase"><Banknote size={12} />{sale.payment_method}</span></td>
                      <td className="px-5 py-4 text-xs font-black text-slate-900 tabular-nums whitespace-nowrap">{formatFullCurrency(sale.grand_total)}</td>
                      <td className="px-5 py-4 text-right"><button onClick={() => openDetail(sale.sale_number)} aria-label={`Lihat detail ${sale.sale_number}`} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-emerald-700 hover:border-emerald-200"><Eye size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="px-4 md:px-8 py-4 border-t border-slate-50 flex items-center justify-between bg-white">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-1.5">
                <button disabled={loading || page <= 1} onClick={() => setPage((current) => current - 1)} className="p-2 rounded-lg border border-slate-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button disabled={loading || page >= totalPages} onClick={() => setPage((current) => current + 1)} className="p-2 rounded-lg border border-slate-100 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </footer>
          </div>
        </section>
      </main>

      {(detailLoading || selectedSale) && <CashSaleDetailModal sale={selectedSale} loading={detailLoading} onClose={() => { setSelectedSale(null); setDetailLoading(false); }} />}
    </div>
  );
};

const CashSaleDetailModal = ({ sale, loading, onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 300);
  };

  const isCash = sale?.payment_method === "CASH";
  const cashierName = sale?.cashier?.name || "Kasir";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <button className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`} onClick={handleClose} aria-label="Tutup detail transaksi" />
      <section className={`relative bg-white w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh] transition-all duration-300 transform ${animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-10 opacity-0"}`}>
        <header className={`px-6 py-4 flex items-center justify-between shrink-0 transition-all duration-500 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#1a4d2e] ring-1 ring-emerald-100"><ClipboardList size={18} /></div>
            <div>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">Detail Pembayaran Kasir</h2>
              {sale?.sale_number && <div className="flex items-center gap-1 mt-0.5"><Receipt size={8} className="text-emerald-500" /><span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{sale.sale_number}</span></div>}
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-red-50 rounded-full transition-colors group" aria-label="Tutup"><X size={18} className="text-slate-400 group-hover:text-red-500" /></button>
        </header>

        {loading ? <div className="py-24"><Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" /></div> : sale && <>
          <div className={`px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 transition-all duration-500 delay-[150ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-[20px] bg-slate-50 border border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-400"><User size={11} /><span className="text-[8px] font-black uppercase tracking-[0.2em]">Kasir</span></div>
                <p className="text-[10px] font-black text-slate-900 uppercase">{cashierName}</p>
                <div className="pt-2 border-t border-dashed border-slate-200 flex items-center gap-1.5"><Calendar size={10} className="text-emerald-600" /><p className="text-[9px] font-bold text-slate-500 uppercase">{formatDateID(sale.transaction_date)}</p></div>
              </div>
              <div className="p-4 rounded-[20px] bg-[#1a4d2e] text-white flex flex-col justify-between shadow-lg shadow-emerald-900/5">
                <div className="flex items-center justify-between"><span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Total Bayar</span><span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[8px] font-black uppercase">{sale.status || "COMPLETED"}</span></div>
                <div className="mt-4"><p className="text-[18px] font-black tracking-tighter leading-none">{formatFullCurrency(sale.grand_total)}</p><div className="flex items-center gap-1 mt-1.5 opacity-60"><Banknote size={10} /><span className="text-[8px] font-bold uppercase">{sale.payment_method || "—"}</span></div></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-1"><span className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Receipt size={8} /> Nomor Transaksi</span><p className="text-[9px] font-black text-slate-800 break-all">{sale.sale_number}</p></div>
              <div className={`p-3 rounded-2xl border flex flex-col gap-1 ${isCash ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}><span className={`text-[7px] font-black uppercase tracking-widest flex items-center gap-1 ${isCash ? "text-emerald-600" : "text-blue-600"}`}><CheckCircle2 size={8} /> Metode Pembayaran</span><p className={`text-[10px] font-black uppercase ${isCash ? "text-emerald-700" : "text-blue-700"}`}>{sale.payment_method || "—"}</p></div>
            </div>

            {sale.notes && <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-4"><span className="text-[8px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5 mb-1"><FileText size={11} /> Catatan Transaksi</span><p className="text-[11px] font-bold text-slate-700 leading-relaxed">“{sale.notes}”</p></div>}

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1"><Package size={12} className="text-[#1a4d2e]" /><span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Rincian Produk</span></div>
              <div className="rounded-[20px] border border-slate-100 overflow-hidden bg-white shadow-sm overflow-x-auto">
                <table className="w-full min-w-[420px] text-left border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100"><tr><th className="px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Item</th><th className="px-4 py-2.5 text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">Qty</th><th className="px-4 py-2.5 text-right text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">{sale.items?.map((item, index) => <tr key={`${item.product_id ?? item.product_name}-${index}`} className="hover:bg-slate-50/30"><td className="px-4 py-2.5"><p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{item.product_name}</p><p className="text-[8px] text-slate-400 mt-0.5">{formatFullCurrency(item.final_unit_price)} / item</p></td><td className="px-4 py-2.5 text-center"><span className="text-[9px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">{item.quantity}</span></td><td className="px-4 py-2.5 text-right text-[10px] font-black text-slate-900">{formatFullCurrency(item.subtotal)}</td></tr>)}</tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-[10px]">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold">{formatFullCurrency(sale.subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Total Diskon</span><span className="font-bold">− {formatFullCurrency(sale.total_discount)}</span></div>
              <div className="flex justify-between pt-2 border-t border-dashed border-slate-200 text-slate-900 text-xs font-black"><span>Total Pembayaran</span><span>{formatFullCurrency(sale.grand_total)}</span></div>
              {isCash && <><div className="flex justify-between text-slate-500 pt-1"><span>Uang Diterima</span><span className="font-bold">{formatFullCurrency(sale.cash_received)}</span></div><div className="flex justify-between text-emerald-700"><span>Kembalian</span><span className="font-black">{formatFullCurrency(sale.change_amount)}</span></div></>}
            </div>
          </div>
          <footer className={`px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 transition-all duration-500 delay-[450ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}><p className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-widest">UD Barokah - Riwayat Pembayaran Kasir</p><button onClick={handleClose} className="px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black active:scale-95 shadow-lg">Tutup</button></footer>
        </>}
      </section>
    </div>
  );
};

export default AdminCashSales;
