import React from "react";
import { ArrowRight } from "lucide-react"; 

const OrderSummary = ({ subtotal, total, normalSubtotal, discountTotal, totalQuantity, hasDiscount, onCheckout }) => {
  const isMinOrderMet = totalQuantity >= 10;
  
  return (
  <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col">
    <h3 className="text-sm font-black mb-5 text-gray-900 uppercase tracking-widest">
      Ringkasan <span className="text-[#2D5A43]">Belanja</span>
    </h3>
    {hasDiscount && (
      <div className="space-y-3 mb-6 text-[11px] uppercase tracking-widest font-black">
        <div className="flex justify-between text-gray-400 items-center">
          <span>Total Harga ({totalQuantity} barang)</span>
          <span className="line-through">{normalSubtotal}</span>
        </div>
        <div className="flex justify-between items-center text-gray-400">
          <span>Total Diskon</span>
          <span className="text-[#2D5A43]">- {discountTotal}</span>
        </div>
      </div>
    )}

    {/* Total Keseluruhan */}
    <div className={`flex justify-between items-center mb-8 ${hasDiscount ? 'pt-3 border-t border-gray-100' : ''}`}>
      <span className="text-[11px] uppercase tracking-widest font-black text-gray-900">Total</span>
      <span className="text-xl text-[#2D5A43] tracking-tighter font-black leading-none">
        {total}
      </span>
    </div>

    {!isMinOrderMet && (
      <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest">Minimal Order 10 Barang</p>
        <p className="text-[9px] font-bold mt-1 opacity-80">Kurang {10 - totalQuantity} barang lagi</p>
      </div>
    )}

    {/* Tombol Beli */}
    <button
      disabled={!isMinOrderMet}
      onClick={onCheckout}
      className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-[#2D5A43] text-white flex items-center justify-center gap-2 hover:bg-[#234735] shadow-lg shadow-emerald-900/10 transition-all active:scale-95 group disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
    >
      Checkout ({totalQuantity})
      <ArrowRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
  </div>
  );
};

export default OrderSummary;