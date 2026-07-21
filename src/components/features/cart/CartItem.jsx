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

  const handleInputBlur = async () => {
    const val = parseInt(inputQty);
    if (!isNaN(val) && val > 0 && val !== item.quantity) {
      setLoadingAction("input");
      try {
        await onQuantityChange(item.id, val);
      } catch (err) {
        setInputQty(item.quantity);
      } finally {
        setLoadingAction(null);
      }
    } else {
      setInputQty(item.quantity);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const hasDiscount = item.discount_amount > 0 && item.original_price > item.price;
  const originalPrice = item.original_price;

  return (
    <div className={`relative flex gap-3 md:gap-5 py-4 px-2 md:px-4 mb-2 border border-transparent hover:border-gray-100 hover:bg-gray-50/50 rounded-2xl transition-all duration-300 group ${isDeleting ? "opacity-50 scale-[0.98]" : "opacity-100"}`}>
      <div className="w-[80px] h-[80px] md:w-[96px] md:h-[96px] rounded-xl border border-gray-200/80 overflow-hidden shrink-0 shadow-sm relative group-hover:shadow-md transition-all duration-300">
        <img
          src={item.image_url || item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </div>

      <div className="flex-1 flex flex-col min-w-0 py-0.5 pb-8 md:pb-10">
        <div className="flex-1 min-w-0">
          {item.stock > 0 && item.stock <= 10 && (
            <span className="inline-flex items-center bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1.5 shadow-sm">
              Sisa {item.stock}
            </span>
          )}
          <h3 className="text-sm md:text-base font-black text-gray-800 leading-snug line-clamp-2 pr-2 transition-colors duration-300">
            {item.name}
          </h3>
          
          <div className="flex flex-col mt-1.5 md:mt-2">
            <p className="font-black text-[#2D5A43] text-sm md:text-base tracking-tight leading-none">
              {formatIDR(item.price)}
            </p>
            {hasDiscount && (
              <p className="text-[11px] text-gray-400 font-bold line-through mt-1 leading-none decoration-gray-300">
                {formatIDR(originalPrice)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions (Trash + Quantity) - Absolute positioned to bottom right */}
      <div className="absolute -bottom-1 md:bottom-1 right-2 md:right-4 flex justify-end items-center gap-3 md:gap-4">
        <button
          disabled={isUpdating}
          onClick={onRemove}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all disabled:opacity-40 shrink-0"
        >
          {isDeleting ? <Spinner /> : <Trash2 size={16} strokeWidth={2.5} />}
        </button>
        
        {/* Kapsul Kuantitas Premium */}
        <div className="flex items-center p-1 rounded-full bg-gray-100/80 border border-gray-200/50 shadow-inner h-[36px] md:h-[40px] w-[96px] md:w-[110px] transition-colors hover:bg-gray-100 shrink-0">
          <button
            disabled={isUpdating}
            onClick={() => withLoading("decrement", onDecrement)}
            className="w-7 md:w-8 h-full flex items-center justify-center rounded-full bg-white text-gray-600 hover:text-[#00AA5B] hover:shadow-sm active:scale-95 disabled:opacity-40 transition-all shrink-0"
          >
            {loadingAction === "decrement" ? <Spinner /> : <Minus size={14} strokeWidth={3} />}
          </button>
          
          {loadingAction === "input" ? (
            <div className="flex-1 flex items-center justify-center min-w-0"><Spinner /></div>
          ) : (
            <input
              type="number"
              value={inputQty}
              disabled={isUpdating}
              onChange={(e) => setInputQty(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
             className="flex-1 min-w-0 bg-transparent text-center text-[13px] md:text-[14px] font-black text-gray-900 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          )}
          
          <button
            disabled={isUpdating}
            onClick={() => withLoading("increment", onIncrement)}
            className="w-7 md:w-8 h-full flex items-center justify-center rounded-full bg-white text-gray-600 hover:text-[#00AA5B] hover:shadow-sm active:scale-95 disabled:opacity-40 transition-all shrink-0"
          >
            {loadingAction === "increment" ? <Spinner /> : <Plus size={14} strokeWidth={3} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;