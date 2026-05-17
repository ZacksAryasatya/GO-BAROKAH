import React, { useState, useEffect } from 'react';
import { X, Package, CreditCard, Calendar, ShoppingCart } from 'lucide-react';
import Button from '../common/Button';
 
const OrderDetailModal = ({ order, isOpen, onClose, formatCurrency }) => {
  const [animate, setAnimate] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
 
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
 
  if (!shouldRender || !order) return null;
 
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`relative bg-white rounded-[28px] w-full max-w-lg overflow-hidden shadow-2xl transition-all duration-300 transform ${animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-8 opacity-0"}`}>
        <div className={`px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-[#F8FAF9] transition-all duration-500 delay-100 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
          <div className="flex items-center gap-3">
            <div className={`bg-[#3A5A4D] p-2 rounded-lg text-white transition-all duration-500 delay-150 ${animate ? "scale-100 rotate-0" : "scale-0 -rotate-12"}`}>
              <ShoppingCart size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-none">Rincian Pesanan</h3>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">{order.invoice_no}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { icon: <Calendar size={12} />, label: "Tanggal", value: new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), delay: "delay-[150ms]" },
              { icon: <CreditCard size={12} />, label: "Pembayaran", value: order.payment_method, delay: "delay-[200ms]" },
            ].map(({ icon, label, value, delay }) => (
              <div key={label} className={`p-3 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-500 ${delay} ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  {icon}
                  <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                </div>
                <p className="text-xs font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          <div className={`transition-all duration-500 delay-[250ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center gap-2 text-gray-400 mb-3 px-1">
              <Package size={12} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Item Produk</span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center p-3 rounded-xl bg-white border border-gray-50 shadow-sm transition-all duration-500 ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                  style={{ transitionDelay: `${300 + i * 50}ms` }}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900">{item.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{formatCurrency(item.price)} x {item.qty}</span>
                  </div>
                  <span className="text-xs font-black text-[#3A5A4D]">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`mt-6 pt-4 border-t border-dashed border-gray-200 transition-all duration-500 delay-[400ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Bayar</span>
              <span className="text-xl font-black text-[#3A5A4D]">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>
        <div className={`px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 transition-all duration-500 delay-[450ms] ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Button variant="ghost" className="px-5 py-2.5 text-[11px]" onClick={onClose}>Tutup</Button>
          <Button variant="primary" className="px-6 py-2.5 text-[11px]" onClick={() => window.print()}>Cetak Invoice</Button>
        </div>
      </div>
    </div>
  );
};
 
export default OrderDetailModal;