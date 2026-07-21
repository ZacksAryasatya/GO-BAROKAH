import React from "react";
import { ArrowRight, AlertCircle } from "lucide-react"; 

const OrderSummary = ({ subtotal, total, normalSubtotal, discountTotal, totalQuantity, hasDiscount, onCheckout }) => {
  const isMinOrderMet = totalQuantity >= 10;
  
  return (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden p-6">
    <h3 className="text-base font-black mb-6 text-gray-900">
      Ringkasan <span className="text-[#2D5A43]">Belanja</span>
    </h3>

    <div className="space-y-4 mb-6">
      {hasDiscount ? (
        <>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-500 font-medium">Total Harga ({totalQuantity} barang)</span>
            <span className="text-gray-400 line-through font-medium decoration-gray-300">{normalSubtotal}</span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-500 font-medium">Total Diskon</span>
            <span className="text-[#00AA5B] font-bold">- {discountTotal}</span>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-gray-500 font-medium">Total Harga ({totalQuantity} barang)</span>
          <span className="text-gray-900 font-bold">{normalSubtotal || total}</span>
        </div>
      )}
    </div>

    {/* Divider */}
    <div className="h-[1px] w-full bg-gray-100 mb-6" />

    {/* Total Keseluruhan */}
    <div className="flex flex-col gap-1.5 mb-8">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Tagihan</span>
      <span className="text-3xl text-[#2D5A43] tracking-tighter font-black leading-none">
        {total}
      </span>
    </div>

    {/* Alert Minimal Order */}
    {!isMinOrderMet && (
      <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl flex gap-3 items-start border border-red-100/50 transition-all">
        <AlertCircle size={18} className="shrink-0 mt-0.5" strokeWidth={2.5} />
        <div>
          <p className="text-[12px] font-black leading-tight">Belum Memenuhi Minimal</p>
          <p className="text-[11px] font-medium mt-1 opacity-80 leading-relaxed">
            Tambah <b>{10 - totalQuantity} barang</b> lagi untuk bisa lanjut ke pembayaran.
          </p>
        </div>
      </div>
    )}

    {/* Tombol Beli */}
    <button
      disabled={!isMinOrderMet}
      onClick={onCheckout}
      className={`w-full py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ${
        isMinOrderMet
          ? "bg-[#2D5A43] hover:bg-[#234735] text-white shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      }`}
    >
      <span>Checkout ({totalQuantity})</span>
      {isMinOrderMet && <ArrowRight size={18} strokeWidth={2.5} />}
    </button>
  </div>
  );
};

export default OrderSummary;