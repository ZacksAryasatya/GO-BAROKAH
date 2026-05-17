import React from "react";
import { ArrowRight } from "lucide-react";

const OrderSummary = ({ subtotal, total, onCheckout }) => (
  <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col">
    <h3 className="text-lg md:text-xl font-black mb-6 md:mb-8 text-gray-900 tracking-tight uppercase border-b border-gray-50 pb-5">
      Ringkasan <span className="text-[#2D5A43]">Order</span>
    </h3>
    <div className="space-y-4 md:space-y-5 mb-8">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span>Subtotal Pesanan</span>
        <span className="text-gray-900">{subtotal}</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-2xl">
        <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
          * Biaya pengiriman dikalkulasi di halaman Checkout.
        </p>
      </div>
      <div className="pt-5 border-t border-gray-100 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Total Tagihan</span>
          <span className="text-2xl md:text-3xl font-black text-[#2D5A43] tracking-tighter leading-none">{total}</span>
        </div>
      </div>
    </div>
    <button
      onClick={onCheckout}
      className="w-full bg-[#2D5A43] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#234735] transition-all active:scale-95 shadow-lg shadow-green-900/10"
    >
      Lanjut ke Pembayaran <ArrowRight size={17} />
    </button>
  </div>
);

export default OrderSummary;