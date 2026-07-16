import React from "react";
import { Link } from "react-router-dom"; 
import { formatIDR } from "../../utils/formatCurrency";
import { ShoppingBag } from "lucide-react";

const ProductSection = ({ filteredProducts }) => {
  return (
    <div className="font-sans">
      <section className="w-full bg-white py-10 md:py-14 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 rounded-lg bg-[#2D5A43]/10 flex items-center justify-center">
              <ShoppingBag size={13} className="text-[#2D5A43]" />
            </div>
            <div>
              <p className="text-[8px] font-black text-[#2D5A43] uppercase tracking-[0.25em] leading-none mb-0.5">
                Katalog Lengkap
              </p>
              <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                Semua <span className="text-[#2D5A43]">Produk</span>
              </h2>
            </div>
          </div>

          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((prod) => {
                const hasDiscount = prod.discount_amount > 0 && prod.final_price > 0 && prod.final_price !== prod.price;
                const displayPrice = hasDiscount ? prod.final_price : prod.price;
                const discountPercent = hasDiscount ? prod.discount_amount : 0;
                const productId = prod.id || prod._id;

                return (
                  <Link 
                    to={`/product/${productId}`} 
                    key={productId} 
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-white border border-gray-100">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        onError={(e) => { e.target.src = "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image"; }}
                      />
                      {hasDiscount && (
                        <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>
                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                      {prod.category?.name || prod.category || "General"}
                    </p>
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-[#2D5A43] transition-colors mb-1">
                      {prod.name}
                    </h3>
                    {hasDiscount ? (
                      <div className="flex flex-col mt-1">
                        <p className="text-[10px] font-bold text-red-500 line-through mb-0.5">{formatIDR(prod.price)}</p>
                        <p className="text-xs font-black text-[#3A5A4D]">{formatIDR(displayPrice)}</p>
                      </div>
                    ) : (
                      <p className="text-xs font-black text-gray-600">{formatIDR(prod.price)}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-16 md:py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
                Data tidak ditemukan
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductSection;