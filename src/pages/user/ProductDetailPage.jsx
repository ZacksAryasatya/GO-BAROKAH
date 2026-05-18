import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { formatIDR } from '../../utils/formatCurrency';
import { useProductDetail } from '../../hooks/user/useProductDetail';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { user } = useAuth();
  const detail = useProductDetail();

  if (detail.loading) return <LoadingState />;
  if (!detail.product) return <NotFoundState />;

  const {
    product, quantity, adding,
    increase, decrease,
    handleQuantityChange, handleBlur, onAddToCart, goBack
  } = detail;

  const hasDiscount = product.discount_amount > 0 && product.final_price > 0 && product.final_price !== product.price;
  const displayPrice = hasDiscount ? product.final_price : product.price;
  const discountPercent = hasDiscount ? product.discount_amount : 0;

  const handleAddClick = async () => {
    if (!user) {
      toast.error('Login dulu yuk buat belanja!', {
        style: { borderRadius: '16px', background: '#2D5A43', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
      });
      return;
    }
    await onAddToCart();
  };

  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10">

        <BackButton onClick={goBack} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-start">
          <div className="relative">
            {hasDiscount && (
              <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                -{discountPercent}%
              </span>
            )}
            <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm w-full max-h-[380px] sm:max-h-[420px] lg:max-h-[480px] flex items-center justify-center p-6">
              <img
                src={product.img || product.image_url || product.image}
                alt={product.name}
                className="w-full h-full object-contain max-h-[320px] sm:max-h-[360px] lg:max-h-[420px] hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x600/FBFBFB/2D5A43?text=No+Image';
                }}
              />
            </div>
          </div>

          <div className="flex flex-col py-0 lg:py-2">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-[#2D5A43] font-black text-[10px] uppercase tracking-[0.25em]">
                {product.category?.name || product.category}
              </span>
              <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full">
                <Star size={10} className="fill-orange-400 text-orange-400" />
                <span className="text-orange-600 font-black text-[10px]">4.8</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-[1.05] mb-5 uppercase">
              {product.name}
            </h1>
            <div className="mb-5 flex flex-col">
              {hasDiscount && (
                <span className="text-gray-400 text-sm font-bold line-through leading-none mb-1">
                  {formatIDR(product.price)}
                </span>
              )}
              <span className={`text-3xl lg:text-4xl font-black tracking-tight ${hasDiscount ? 'text-red-500' : 'text-[#2D5A43]'}`}>
                {formatIDR(displayPrice)}
              </span>
            </div>

            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm leading-relaxed font-medium mb-7 line-clamp-4">
              {product.description || "Kualitas bahan pangan organik terbaik dari UD Barokah. Segar, sehat, dan langsung dari petani lokal untuk meja makan Anda."}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <QuantityControl
                qty={quantity}
                onPlus={increase}
                onMinus={decrease}
                onChange={handleQuantityChange}
                onBlur={handleBlur}
                disabled={adding}
              />
              <button
                onClick={handleAddClick}
                disabled={adding}
                className="flex-1 bg-[#2D5A43] text-white py-4 px-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 hover:bg-[#234735] transition-all shadow-lg shadow-[#2D5A43]/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {adding ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Tambah ke Keranjang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-gray-400 hover:text-[#2D5A43] mb-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all group w-fit"
  >
    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
    Kembali
  </button>
);

const QuantityControl = ({ qty, onPlus, onMinus, onChange, onBlur, disabled }) => (
  <div className="flex items-center border border-gray-100 rounded-2xl p-1.5 bg-white shadow-sm w-full sm:w-auto justify-between focus-within:border-[#2D5A43] transition-all shrink-0">
    <button onClick={onMinus} disabled={disabled} className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-700 disabled:opacity-50">
      <Minus size={14} />
    </button>
    <input
      type="number"
      value={qty}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className="w-12 text-center font-black text-sm bg-transparent border-none focus:ring-0 p-0 text-gray-900 disabled:opacity-50"
    />
    <button onClick={onPlus} disabled={disabled} className="p-2.5 hover:bg-[#E8F5EE] rounded-xl transition-all text-[#2D5A43] disabled:opacity-50">
      <Plus size={14} />
    </button>
  </div>
);

const LoadingState = () => (
  <div className="bg-[#FBFBFB] min-h-screen">
    <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        <div className="bg-gray-200 rounded-[2rem] h-[380px]" />
        <div className="space-y-5 pt-4">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-2/3 bg-gray-200 rounded" />
          <div className="h-px bg-gray-200" />
          <div className="h-20 w-full bg-gray-200 rounded" />
          <div className="h-14 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center bg-white min-h-screen px-6">
    <div className="bg-slate-50 p-8 rounded-full mb-6">
      <ShoppingBag size={48} className="text-slate-200" />
    </div>
    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Produk Tidak Ada</h3>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 mb-8">
      Mungkin sudah habis atau dihapus admin.
    </p>
    <Link to="/store" className="bg-[#2D5A43] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10">
      Balik ke Katalog
    </Link>
  </div>
);

export default ProductDetailPage;