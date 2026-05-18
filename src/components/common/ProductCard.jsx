import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatIDR } from "../../utils/formatCurrency";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isInCart = user && cartItems.some((item) => item.id === product.id);
  console.log(product.name, {
    discount_amount: product.discount_amount,
    final_price: product.final_price,
    price: product.price,
  });

  const hasDiscount =
    product.discount_amount > 0 &&
    product.final_price > 0 &&
    product.final_price !== product.price;
  const displayPrice = hasDiscount ? product.final_price : product.price;
  const originalPrice = product.price;
  const discountPercent = hasDiscount ? product.discount_amount : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isInCart || isLoading) return;
    if (!user) {
      toast.error("Login terlebih dahulu!");
      return;
    }
    try {
      setIsLoading(true);
      await addToCart(product);
      toast.success(`${product.name} masuk keranjang!`);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-5 border-r border-b border-gray-100 relative group transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:z-10 bg-white flex flex-col min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] text-left">
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer flex-1 mb-12 sm:mb-16"
      >
        <div className="relative aspect-square w-full flex items-center justify-center mb-3 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-50 bg-[#FBFBFB]">
          <img
            src={product.image_url || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image";
            }}
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
              -{discountPercent}%
            </div>
          )}
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#3A5A4D] font-black text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] opacity-80">
              {typeof product.category === "object"
                ? product.category.name
                : product.category || "Organik"}
            </span>
            <div className="h-[1px] w-3 bg-gray-200"></div>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#3A5A4D] transition-colors leading-snug">
            {product.name}
          </h4>
          <div className="flex flex-col mt-1 sm:mt-2">
            {hasDiscount && (
              <span className="text-gray-400 text-[10px] sm:text-xs font-bold line-through leading-none mb-0.5">
                {formatIDR(originalPrice)}
              </span>
            )}
            <span
              className={`font-black tracking-tighter leading-none ${hasDiscount ? "text-red-500" : "text-[#3A5A4D]"} text-base sm:text-lg`}
            >
              {formatIDR(displayPrice)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={isInCart || isLoading}
        className={`absolute bottom-3 right-3 sm:bottom-6 sm:right-6 h-10 sm:h-11 flex items-center justify-center transition-all duration-500 z-30 rounded-xl sm:rounded-2xl shadow-lg border
          ${
            isInCart
              ? "bg-[#3A5A4D] text-white px-3 sm:px-5 border-[#3A5A4D] w-auto cursor-default opacity-90"
              : isLoading
                ? "bg-gray-50 text-gray-400 border-gray-100 w-10 sm:w-11 cursor-default"
                : "bg-white text-gray-700 border-gray-100 w-10 sm:w-11 hover:border-[#3A5A4D] hover:text-[#3A5A4D] cursor-pointer active:scale-95"
          }`}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isInCart ? (
          <>
            <ShoppingBag size={16} className="sm:mr-2" />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">
              In Cart
            </span>
          </>
        ) : (
          <ShoppingBag size={16} />
        )}
      </button>
    </div>
  );
};

export default ProductCard;
