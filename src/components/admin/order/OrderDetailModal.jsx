import React, { useState, useEffect } from "react";
import { X, Package, User, Calendar, CreditCard, ClipboardList, MapPin, Hash, Store, Truck } from "lucide-react";
import { formatRupiah } from "../../../utils/formatters";

const OrderDetailModal = ({ order, onClose }) => {
  const [animate, setAnimate] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (order) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [order]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 300);
  };

  if (!shouldRender || !order) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      <div
        className={`relative bg-white w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh] transition-all duration-300 transform ${animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-10 opacity-0"}`}
      >
        <div className={`px-6 py-4 flex items-center justify-between shrink-0 transition-all duration-500 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#1a4d2e] ring-1 ring-emerald-100">
              <ClipboardList size={18} />
            </div>
            <div>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">Detail Transaksi</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <Hash size={8} className="text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{order.id}</span>
              </div>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-red-50 rounded-full transition-colors group">
            <X size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 transition-all duration-500 delay-[150ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="p-4 rounded-[20px] bg-slate-50 border border-slate-100 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <User size={11} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Customer</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase">{order.customer_name}</p>
                  <p className="text-[8px] font-bold text-slate-400 tracking-wider">{order.user_id}</p>
                </div>
                <div className="pt-2 border-t border-dashed border-slate-200 flex items-start gap-1.5">
                  <MapPin size={10} className="text-emerald-600 mt-0.5" />
                  <p className="text-[9px] font-bold text-slate-500 leading-tight uppercase line-clamp-2">
                    {order.is_pickup ? "AMBIL DI TOKO (UD BAROKAH)" : (order.address || "ALAMAT TIDAK TERSEDIA")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-[20px] bg-[#1a4d2e] text-white flex flex-col justify-between shadow-lg shadow-emerald-900/5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Total Bayar</span>
                <div className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[8px] font-black uppercase">
                  {order.status}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[18px] font-black tracking-tighter leading-none">{formatRupiah(order.total_price)}</p>
                <div className="flex items-center gap-1 mt-1.5 opacity-60">
                  <Calendar size={10} />
                  <span className="text-[8px] font-bold uppercase">{order.created_at}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`grid grid-cols-2 gap-3 mb-6 transition-all duration-500 delay-[250ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-1">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Package size={8} /> Metode Pengambilan
              </span>
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${order.is_pickup ? 'text-orange-600' : 'text-blue-600'}`}>
                {order.is_pickup ? <Store size={12}/> : <Truck size={12}/>}
                {order.is_pickup ? "Ambil di Tempat" : "Kirim Kurir"}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-1">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <CreditCard size={8} /> Metode Pembayaran
              </span>
              <p className="text-[10px] font-black text-slate-900 uppercase">
                {order.payment_method || "Transfer Bank"}
              </p>
            </div>
          </div>
          <div className={`space-y-3 transition-all duration-500 delay-[350ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center gap-2 px-1">
              <Package size={12} className="text-[#1a4d2e]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Rincian Produk</span>
            </div>

            <div className="rounded-[20px] border border-slate-100 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                    <th className="px-4 py-2.5 text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                    <th className="px-4 py-2.5 text-right text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{item.name}</p>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="text-[9px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">{item.qty}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-[10px] font-black text-slate-900">{formatRupiah(item.qty * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={`px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 transition-all duration-500 delay-[450ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-widest">UD Barokah - Sistem Distribusi</p>
          <button onClick={handleClose} className="px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all active:scale-95 shadow-lg">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;