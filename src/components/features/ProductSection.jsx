import React, { useState, useEffect } from "react";
import { productService } from "../../services/user/productService";
import { useProductFilter } from "../../hooks/user/useProductFilter";
import { formatIDR } from "../../utils/formatCurrency";
import { API_URL } from "../../utils/api";
import { Loader2 } from "lucide-react";

const buildImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await productService.getAllProducts();
        const actualData = Array.isArray(response)
          ? response
          : response?.data || response?.products || [];
        setProducts(actualData.map((p) => ({
          ...p,
          image_url: buildImageUrl(p.image_url || p.image),
        })));
      } catch (err) {
        console.error("Database Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const categories = [
    ...new Set(products?.map((p) => p.category?.name || p.category) || []),
  ].filter(Boolean);

  const filteredProducts = useProductFilter(
    Array.isArray(products) ? products : [],
    searchQuery,
    activeFilters,
  );

  const toggleFilter = (catName) => {
    setActiveFilters((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [catName],
    );
  };

  if (loading)
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#2D5A43]" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px]">Loading products...</p>
      </div>
    );

  return (
    <div className="bg-[#FBFBFB] font-sans">
      <section className="max-w-7xl mx-auto py-16 md:py-24 px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-16">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-[56px] font-black text-gray-900 leading-[0.9] tracking-tighter uppercase">
              KATEGORI <br /><span className="text-[#2D5A43]">PILIHAN.</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-[15px] font-medium max-w-sm leading-relaxed">
              Pilih kategori untuk melihat produk segar langsung dari distributor.
            </p>
          </div>
          <button
            onClick={() => setActiveFilters([])}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all self-start sm:self-auto"
          >
            {activeFilters.length > 0 ? "Reset Filter" : "Tampilkan Semua"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => toggleFilter(cat)}
              className={`p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] cursor-pointer transition-all border ${
                activeFilters.includes(cat)
                  ? "border-[#2D5A43] bg-white shadow-xl shadow-green-900/5 ring-1 ring-[#2D5A43]"
                  : "bg-white border-gray-100 hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 bg-gray-50 rounded-full flex items-center justify-center font-black text-[#2D5A43]">
                {cat.charAt(0).toUpperCase()}
              </div>
              <p className={`text-center font-black uppercase text-[9px] tracking-widest ${
                activeFilters.includes(cat) ? "text-[#2D5A43]" : "text-gray-800"
              }`}>
                {cat}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 md:py-24 px-6 lg:px-12 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-16">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-[56px] font-black text-gray-900 leading-[0.9] tracking-tighter uppercase">
              PRODUK <br /><span className="text-[#2D5A43]">KAMI.</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-[15px] font-medium max-w-sm leading-relaxed">
              Jelajahi produk berkualitas tinggi yang kami kurasi khusus untuk memenuhi kebutuhan Anda.
            </p>
          </div>
        </div>

        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
            {filteredProducts.map((prod) => {
              const hasDiscount = prod.discount_amount > 0 && prod.final_price > 0 && prod.final_price !== prod.price;
              const displayPrice = hasDiscount ? prod.final_price : prod.price;
              const discountPercent = hasDiscount ? prod.discount_amount : 0;

              return (
                <div key={prod.id || prod._id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-4 md:mb-6 transition-all duration-500 group-hover:shadow-2xl">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image";
                      }}
                    />
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="px-1 md:px-2 text-left">
                    <p className="text-[9px] md:text-[10px] font-black text-[#2D5A43] uppercase tracking-widest opacity-60">
                      {prod.category?.name || prod.category || "General"}
                    </p>
                    <h3 className="font-black text-gray-900 text-base md:text-xl uppercase tracking-tighter">
                      {prod.name}
                    </h3>
                    <div className="flex flex-col mt-0.5">
                      {hasDiscount && (
                        <span className="text-gray-400 text-xs font-bold line-through leading-none mb-0.5">
                          {formatIDR(prod.price)}
                        </span>
                      )}
                      <span className={`font-bold text-sm md:text-base ${hasDiscount ? 'text-red-500' : 'text-gray-400'}`}>
                        {formatIDR(displayPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 md:py-20 text-center bg-white rounded-[2rem] md:rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
              Data tidak ditemukan
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductSection;