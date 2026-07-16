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

  const hasDiscount = item.discount_amount > 0 && item.original_price > item.price;
  const originalPrice = item.original_price;

  return (
    <div className={`flex gap-3 md:gap-4 py-5 border-b border-gray-100 last:border-0 transition-opacity ${isDeleting ? "opacity-50" : "opacity-100"}`}>
      <div className="w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-lg border border-gray-200 overflow-hidden shrink-0">
        <img
          src={item.image_url || item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image";
          }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {item.stock > 0 && item.stock <= 10 && (
              <p className="text-[#FA591D] font-bold text-[10px] md:text-xs mb-1 leading-none">
                Sisa {item.stock}
              </p>
            )}
            <h3 className="text-sm md:text-[15px] font-bold text-gray-800 leading-snug line-clamp-2">
              {item.name}
            </h3>
          </div>
          
          <div className="text-right shrink-0">
            <p className="font-black text-gray-900 text-sm md:text-base">
              {formatIDR(item.price)}
            </p>
            {hasDiscount && (
              <p className="text-[11px] text-gray-400 font-bold line-through mt-0.5">
                {formatIDR(originalPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-5 mt-2">
          <button
            disabled={isUpdating}
            onClick={onRemove}
            className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
          >
            {isDeleting ? <Spinner /> : <Trash2 size={18} strokeWidth={2} />}
          </button>
          
          {/* Kapsul Kuantitas */}
          <div className="flex items-center border border-gray-200 rounded-full h-[32px] md:h-[36px] w-[96px] md:w-[100px] overflow-hidden bg-gray-50/50">
            <button
              disabled={isUpdating}
              onClick={() => withLoading("decrement", onDecrement)}
              className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-[#00AA5B] hover:bg-white disabled:opacity-40 transition-colors"
            >
              {loadingAction === "decrement" ? <Spinner /> : <Minus size={14} strokeWidth={2.5} />}
            </button>
            
            {loadingAction === "input" ? (
              <div className="flex-1 flex items-center justify-center bg-white"><Spinner /></div>
            ) : (
              <input
                type="number"
                value={inputQty}
                disabled={isUpdating}
                onChange={(e) => setInputQty(e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
               className="flex-1 w-full h-full bg-white text-center text-sm font-black text-gray-800 focus:outline-none border-x border-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            )}
            
            <button
              disabled={isUpdating}
              onClick={() => withLoading("increment", onIncrement)}
              className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-[#00AA5B] hover:bg-white disabled:opacity-40 transition-colors"
            >
              {loadingAction === "increment" ? <Spinner /> : <Plus size={14} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartItem;