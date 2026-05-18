import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useCartLogic } from "../../hooks/user/useCartLogic";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/forms/ConfirmModal";
import CartItem from "../../components/features/cart/CartItem";
import OrderSummary from "../../components/features/cart/OrderSummary";
import EmptyCartView from "../../components/features/cart/EmptyCartView";

const CartPage = () => {
  const {
    cartItems,
    subtotal,
    total,
    normalSubtotal,
    discountTotal,
    hasDiscount,
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
  const [deletingId, setDeletingId] = useState(null);

  const openDeleteModal = (item) =>
    setDeleteModal({ isOpen: true, itemId: item.id, itemName: item.name });

  const confirmRemove = async () => {
    if (deleteModal.itemId) {
      setDeletingId(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null, itemName: "" });
      await handleRemove(deleteModal.itemId);
      setDeletingId(null);
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
              <ArrowLeft
                size={13}
                className="group-hover:-translate-x-1 transition-transform"
              />
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
                isDeleting={deletingId === item.id}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() =>
                  item.quantity <= 1
                    ? openDeleteModal(item)
                    : handleDecrement(item)
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
              normalSubtotal={normalSubtotal}
              discountTotal={discountTotal}
              hasDiscount={hasDiscount}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 pt-3 pb-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
              Total
            </span>
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
        onClose={() =>
          setDeleteModal({ isOpen: false, itemId: null, itemName: "" })
        }
        onConfirm={confirmRemove}
        title="Hapus Produk?"
        message={`Hapus "${deleteModal.itemName}" dari keranjang?`}
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default CartPage;
