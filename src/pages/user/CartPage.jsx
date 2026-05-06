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
    setDeleteModal({
      isOpen: true,
      itemId: item.id,
      itemName: item.name,
    });
  };

  const confirmRemove = () => {
    if (deleteModal.itemId) {
      handleRemove(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null, itemName: "" });
    }
  };

  if (isEmpty) return <EmptyCartView />;

  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => navigate("/store")}
              className="flex items-center gap-2 text-gray-400 hover:text-[#2D5A43] mb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />{" "}
              Kembali Belanja
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Keranjang <span className="text-[#2D5A43]">Belanja</span>
            </h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b-2 border-gray-100 pb-2">
            {cartItems.length} Produk Terpilih
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() => {
                  if (item.quantity <= 1) {
                    openDeleteModal(item);
                  } else {
                    handleDecrement(item);
                  }
                }}
                onRemove={() => openDeleteModal(item)}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          <div className="lg:col-span-1 sticky top-32">
            <OrderSummary
              subtotal={subtotal}
              total={total}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemName: "" })}
        onConfirm={confirmRemove}
        title="Hapus dari Keranjang?"
        message={`Apakah Anda yakin ingin menghapus "${deleteModal.itemName}"? Produk ini akan dikeluarkan dari daftar belanja Anda.`}
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

const CartItem = ({ item, onIncrement, onDecrement, onRemove, onQuantityChange }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      onQuantityChange(item.id, val);
    }
  };

  return (
    <div className="group relative flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="w-32 h-32 bg-[#FBFBFB] rounded-3xl p-0 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50">
        <img
          src={`${API_URL}${item.image_url || item.image}`}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image'; 
          }}
        />
      </div>
      <div className="flex-grow text-center sm:text-left">
        <span className="text-[#2D5A43] font-black text-[9px] uppercase tracking-[0.2em] opacity-60">
          {typeof item.category === 'object' ? item.category.name : (item.category || "Kategori")}
        </span>
        <h3 className="text-lg font-black text-gray-900 tracking-tight mt-1">
          {item.name}
        </h3>
        <p className="text-[#2D5A43] font-black text-sm mt-2">
          {formatIDR(item.price)}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
          <button
            onClick={onDecrement}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-red-500 shadow-sm transition-all active:scale-90"
          >
            <Minus size={14} />
          </button>
          
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleChange}
            className="w-12 bg-transparent text-center font-black text-sm text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          
          <button
            onClick={onIncrement}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-[#2D5A43] shadow-sm transition-all active:scale-90"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={onRemove}
          className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
          title="Hapus Item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const OrderSummary = ({ subtotal, total, onCheckout }) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col">
    <h3 className="text-xl font-black mb-8 text-gray-900 tracking-tight uppercase border-b border-gray-50 pb-6">
      Ringkasan <span className="text-[#2D5A43]">Order</span>
    </h3>

    <div className="space-y-5 mb-10">
      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <span>Subtotal Pesanan</span>
        <span className="text-gray-900">{subtotal}</span>
      </div>

      <div className="bg-gray-50 p-4 rounded-2xl">
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed ">
          * Biaya pengiriman dikalkulasi di halaman Checkout.
        </p>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Total Tagihan
          </span>
          <span className="text-3xl font-black text-[#2D5A43] tracking-tighter leading-none">
            {total}
          </span>
        </div>
      </div>
    </div>

    <button
      onClick={onCheckout}
      className="w-full bg-[#2D5A43] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#234735] transition-all active:scale-95 group shadow-lg shadow-green-900/10"
    >
      Lanjut ke Pembayaran{" "}
      <ArrowRight
        size={18}
        className="group-hover:translate-x-1 transition-transform duration-200"
      />
    </button>
  </div>
);

const EmptyCartView = () => (
  <div className="flex flex-col items-center justify-center py-40 bg-white min-h-screen">
    <div className="bg-[#FBFBFB] w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-8 text-gray-200 border border-gray-50">
      <ShoppingBag size={48} strokeWidth={1.5} />
    </div>
    <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase">
      Keranjang Kosong
    </h2>
    <p className="text-gray-400 mb-10 font-medium max-w-xs text-center leading-relaxed">
      Wah, keranjangmu masih sepi nih. Yuk, cari kebutuhan harianmu sekarang!
    </p>
    <Link
      to="/store"
      className="bg-[#2D5A43] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#234735] transition-all active:scale-95 shadow-lg shadow-green-900/10"
    >
      Mulai Belanja
    </Link>
  </div>
);

export default CartPage;