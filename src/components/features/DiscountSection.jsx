import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { formatIDR } from "../../utils/formatCurrency";

const ProductCard = ({ prod }) => (
  <Link to={`/product/${prod.id}`} className="group block">
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-white border border-gray-100">
      <img
        src={prod.image_url}
        alt={prod.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
        onError={(e) => { e.target.src = "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image"; }}
      />
      <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
        -{prod.discount_amount}%
      </div>
    </div>
    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
      {prod.category?.name || prod.category}
    </p>
    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-[#2D5A43] transition-colors mb-1">
      {prod.name}
    </h3>
    <div className="flex flex-col mt-1">
      <p className="text-[10px] font-bold text-red-500 line-through mb-0.5">{formatIDR(prod.price)}</p>
      <p className="text-xs font-black text-[#3A5A4D]">{formatIDR(prod.final_price)}</p>
    </div>
  </Link>
);

const DiscountSection = ({ filteredProducts }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);
  const products = filteredProducts.filter((p) => p.discount_amount > 0 && p.final_price > 0 && p.final_price !== p.price);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 350, behavior: "smooth" });

  if (products.length === 0) return null;

  const useGrid = products.length <= 4;

  return (
    <section className="w-full bg-[#FBFBFB] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
              <Tag size={13} className="text-red-500" />
            </div>
            <div>
              <p className="text-[8px] font-black text-red-400 uppercase tracking-[0.25em] leading-none mb-0.5">Hemat Lebih Banyak</p>
              <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                Promo <span className="text-red-500">Hari Ini</span>
              </h2>
            </div>
          </div>
          {!useGrid && (
            <div className="flex items-center gap-1.5">
              <button onClick={() => scroll(-1)} disabled={!canScrollLeft} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 transition-all"><ChevronLeft size={13} /></button>
              <button onClick={() => scroll(1)} disabled={!canScrollRight} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 transition-all"><ChevronRight size={13} /></button>
            </div>
          )}
        </div>

        {useGrid ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((prod) => <ProductCard key={prod.id} prod={prod} />)}
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {products.map((prod) => (
              <div key={prod.id} className="flex-shrink-0 w-56 md:w-64">
                <ProductCard prod={prod} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscountSection;