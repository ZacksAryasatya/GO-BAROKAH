import React, { useState } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCartLogic } from "../../hooks/user/useCartLogic";
import { Link, useNavigate } from "react-router-dom";
import { formatIDR } from "../../utils/formatCurrency";
import ConfirmModal from "../../components/forms/ConfirmModal";
import api from "../../utils/api";

const CartPage = () => {
  const {
    cartItems,
    subtotal,
    total,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleQuantityChange,
    isEmpty,
  } = useCartLogic();

  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
  });

  const openDeleteModal = (item) => {
    setDeleteModal({ isOpen: true, itemId: item.id, itemName: item.name });
  };

  const confirmRemove = () => {
    if (deleteModal.itemId) {
      handleRemove(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null, itemName: "" });
    }
  };

  if (isEmpty) return <EmptyCartView />;

  return (
    <div className="bg-[#FBFBFB] min-h-screen pb-36 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 md:mb-12">
          <div>
            <button
              onClick={() => navigate("/store")}
              className="flex items-center gap-2 text-gray-400 hover:text-[#2D5A43] mb-3 text-[9px] font-black uppercase tracking-[0.2em] transition-colors group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
              Kembali Belanja
            </button>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-tight">
              Keranjang <span className="text-[#2D5A43]">Belanja.</span>
            </h1>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b-2 border-gray-100 pb-2 self-start sm:self-auto">
            {cartItems.length} Produk Terpilih
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-16 items-start">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() =>
                  item.quantity <= 1 ? openDeleteModal(item) : handleDecrement(item)
                }
                onRemove={() => openDeleteModal(item)}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          <div className="hidden lg:block lg:col-span-1 sticky top-32">
            <OrderSummary
              subtotal={subtotal}
              total={total}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 pt-3 pb-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Total</span>
            <span className="text-lg font-black text-[#2D5A43] tracking-tighter leading-tight truncate">
              {total}
            </span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="flex-1 bg-[#2D5A43] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-emerald-900/10"
          >
            Checkout <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemName: "" })}
        onConfirm={confirmRemove}
        title="Hapus Produk?"
        message={`Hapus "${deleteModal.itemName}" dari keranjang?`}
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

const CartItem = ({ item, onIncrement, onDecrement, onRemove, onQuantityChange }) => {
  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) onQuantityChange(item.id, val);
  };

  return (
    <div className="group relative flex items-center gap-3 sm:gap-5 md:gap-6 bg-white p-3 sm:p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="flex-shrink-0 bg-[#FBFBFB] rounded-xl md:rounded-3xl overflow-hidden border border-gray-50"
        style={{ width: 'clamp(68px, 18vw, 128px)', height: 'clamp(68px, 18vw, 128px)' }}
      >
        <img
          src={`${api.defaults.baseURL}${item.image_url || item.image}`}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[#2D5A43] font-black text-[8px] uppercase tracking-[0.2em] opacity-60 block truncate">
          {typeof item.category === 'object' ? item.category.name : (item.category || "Kategori")}
        </span>
        <h3 className="text-sm md:text-lg font-black text-gray-900 tracking-tight mt-0.5 truncate">
          {item.name}
        </h3>
        <p className="text-[#2D5A43] font-black text-xs md:text-sm mt-1">
          {formatIDR(item.price)}
        </p>
        <div className="flex items-center gap-2 mt-2.5 md:hidden">
          <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
            <button
              onClick={onDecrement}
              className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm active:scale-90 transition-transform"
            >
              <Minus size={10} />
            </button>
            <span className="w-8 text-center font-black text-[11px] text-gray-900 select-none">
              {item.quantity}
            </span>
            <button
              onClick={onIncrement}
              className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm active:scale-90 transition-transform"
            >
              <Plus size={10} />
            </button>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors active:scale-90"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
          <button
            onClick={onDecrement}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-xl hover:text-red-400 shadow-sm transition-all active:scale-90"
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={handleChange}
            className="w-12 bg-transparent text-center font-black text-sm text-gray-900 focus:outline-none"
          />
          <button
            onClick={onIncrement}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-xl hover:text-[#2D5A43] shadow-sm transition-all active:scale-90"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          onClick={onRemove}
          className="p-3 text-gray-300 hover:text-red-400 transition-all active:scale-90"
        >
          <Trash2 size={19} />
        </button>
      </div>
    </div>
  );
};

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
          <span className="text-2xl md:text-3xl font-black text-[#2D5A43] tracking-tighter leading-none">
            {total}
          </span>
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

const EmptyCartView = () => (
  <div className="flex flex-col items-center justify-center px-6 py-20 min-h-screen bg-white">
    <div className="bg-[#FBFBFB] w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-200 border border-gray-50">
      <ShoppingBag size={40} strokeWidth={1.5} />
    </div>
    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase text-center">
      Keranjang Kosong
    </h2>
    <p className="text-gray-400 mb-10 font-medium max-w-xs text-center text-sm leading-relaxed">
      Wah, keranjangmu masih sepi nih. Yuk, cari kebutuhan harianmu sekarang!
    </p>
    <Link
      to="/store"
      className="w-full sm:w-auto text-center bg-[#2D5A43] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-transform shadow-lg shadow-green-900/10"
    >
      Mulai Belanja
    </Link>
  </div>
);

export default CartPage;