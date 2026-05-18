import React, { useState, useEffect } from "react";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import { formatIDR } from "../../../utils/formatCurrency";

const Spinner = () => (
  <Loader2 size={12} className="animate-spin text-gray-400" />
);

const CartItem = ({
  item,
  isDeleting,
  onIncrement,
  onDecrement,
  onRemove,
  onQuantityChange,
}) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const [inputQty, setInputQty] = useState(item.quantity);

  useEffect(() => {
    setInputQty(item.quantity);
  }, [item.quantity]);

  const withLoading = async (action, fn) => {
    setLoadingAction(action);
    try {
      await fn();
    } finally {
      setLoadingAction(null);
    }
  };

  const isUpdating = loadingAction !== null || isDeleting;

  const handleInputBlur = () => {
    const val = parseInt(inputQty);
    if (!isNaN(val) && val > 0 && val !== item.quantity) {
      withLoading("input", () => onQuantityChange(item.id, val));
    } else {
      setInputQty(item.quantity);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
      e.target.blur();
    }
  };

  const hasDiscount =
    item.discount_amount > 0 && item.original_price > item.price;
  const originalPrice = item.original_price;

  return (
    <div
      className={`group relative flex items-center gap-3 sm:gap-5 md:gap-6 bg-white p-3 sm:p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md ${isDeleting ? "opacity-50 scale-[0.99]" : ""}`}
    >
      <div
        className="flex-shrink-0 bg-[#FBFBFB] rounded-xl md:rounded-3xl overflow-hidden border border-gray-50"
        style={{
          width: "clamp(68px, 18vw, 128px)",
          height: "clamp(68px, 18vw, 128px)",
        }}
      >
        <img
          src={item.image_url || item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[#2D5A43] font-black text-[8px] uppercase tracking-[0.2em] opacity-60 block truncate">
          {typeof item.category === "object"
            ? item.category.name
            : item.category || "Kategori"}
        </span>
        <h3 className="text-sm md:text-lg font-black text-gray-900 tracking-tight mt-0.5 truncate">
          {item.name}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {hasDiscount && (
            <span className="text-gray-400 text-[10px] font-bold line-through">
              {formatIDR(originalPrice)}
            </span>
          )}
          <span
            className={`font-black text-xs md:text-sm ${hasDiscount ? "text-red-500" : "text-[#2D5A43]"}`}
          >
            {formatIDR(item.price)}
          </span>
          {hasDiscount && (
            <span className="text-[8px] font-black bg-red-50 text-red-500 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              -{item.discount_amount}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2.5 md:hidden">
          <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
            <button
              disabled={isUpdating}
              onClick={() => withLoading("decrement", onDecrement)}
              className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm active:scale-90 transition-transform disabled:opacity-40"
            >
              {loadingAction === "decrement" ? (
                <Spinner />
              ) : (
                <Minus size={10} />
              )}
            </button>
            <span className="w-8 text-center font-black text-[11px] text-gray-900 select-none">
              {item.quantity}
            </span>
            <button
              disabled={isUpdating}
              onClick={() => withLoading("increment", onIncrement)}
              className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm active:scale-90 transition-transform disabled:opacity-40"
            >
              {loadingAction === "increment" ? <Spinner /> : <Plus size={10} />}
            </button>
          </div>
          <button
            disabled={isUpdating}
            onClick={onRemove}
            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors active:scale-90 disabled:opacity-40"
          >
            {isDeleting ? <Spinner /> : <Trash2 size={15} />}
          </button>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
          <button
            disabled={isUpdating}
            onClick={() => withLoading("decrement", onDecrement)}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-xl hover:text-red-400 shadow-sm transition-all active:scale-90 disabled:opacity-40"
          >
            {loadingAction === "decrement" ? <Spinner /> : <Minus size={14} />}
          </button>

          {loadingAction === "input" ? (
            <span className="w-12 flex items-center justify-center">
              <Spinner />
            </span>
          ) : (
            <input
              type="number"
              value={inputQty}
              disabled={isUpdating}
              onChange={(e) => setInputQty(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-12 bg-transparent text-center font-black text-sm text-gray-900 focus:outline-none disabled:opacity-40"
            />
          )}

          <button
            disabled={isUpdating}
            onClick={() => withLoading("increment", onIncrement)}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-xl hover:text-[#2D5A43] shadow-sm transition-all active:scale-90 disabled:opacity-40"
          >
            {loadingAction === "increment" ? <Spinner /> : <Plus size={14} />}
          </button>
        </div>

        <button
          disabled={isUpdating}
          onClick={onRemove}
          className="p-3 text-gray-300 hover:text-red-400 transition-all active:scale-90 disabled:opacity-40"
        >
          {isDeleting ? <Spinner /> : <Trash2 size={19} />}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
