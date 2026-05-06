import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { formatIDR } from '../../utils/formatCurrency';
import { useProductDetail } from '../../hooks/user/useProductDetail';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { user } = useAuth();
  const detail = useProductDetail(); 
 if (detail.loading) {
    return (
      <div className="bg-[#FBFBFB] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-10"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="bg-gray-200 rounded-[2.5rem] aspect-square shadow-sm"></div>
            <div className="flex flex-col space-y-6">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-200 rounded"></div>
              <div className="h-12 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-10 w-40 bg-gray-200 rounded-full mt-4"></div>
              <div className="space-y-3 mt-8">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-4 mt-10">
                <div className="h-16 w-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-16 flex-1 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!detail.product) return <NotFoundState />;
  const { 
    product, quantity, increase, decrease, 
    handleQuantityChange, handleBlur, onAddToCart, goBack 
  } = detail;

  const handleAddClick = () => {
    if (!user) {
      toast.error('Login dulu yuk buat belanja!', {
        icon: '🛒',
        style: { 
          borderRadius: '16px', 
          background: '#2D5A43', 
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
      return;
    }
    onAddToCart();
    toast.success(`${quantity} ${product.name} masuk keranjang!`, {
      style: { fontSize: '12px', fontWeight: 'bold' }
    });
  };

  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 animate-in fade-in duration-500">
        <BackButton onClick={goBack} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] relative shadow-2xl shadow-gray-200/50 aspect-square flex items-center justify-center p-12 group overflow-hidden">
            {product.sale && (
              <span className="absolute top-8 left-8 bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full z-10 uppercase tracking-widest shadow-lg">
                Sale {product.sale}
              </span>
            )}
            
            <img 
              src={product.img} 
              alt={product.name} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x600/FBFBFB/2D5A43?text=No+Image';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[#2D5A43] font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              {product.category?.name || product.category }
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                <Star size={14} className="fill-orange-400 text-orange-400" />
                <span className="text-orange-700 font-black text-xs">4.8</span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border-l pl-6">
                Fresh Stock
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-4xl font-black text-[#2D5A43] tracking-tighter">
                {formatIDR(product.price)}
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-10 border-b border-gray-100 pb-10 font-medium max-w-lg">
              {product.description || "Kualitas bahan pangan organik terbaik dari UD Barokah. Segar, sehat, dan langsung dari petani lokal untuk meja makan Anda."}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <QuantityControl 
                qty={quantity} 
                onPlus={increase} 
                onMinus={decrease} 
                onChange={handleQuantityChange}
                onBlur={handleBlur}
              />
              
              <button 
                onClick={handleAddClick} 
                className="flex-1 w-full bg-[#2D5A43] text-white py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#234735] transition-all shadow-xl active:scale-95"
              >
                <ShoppingBag size={18} /> Tambah Ke Keranjang
              </button>

              <button className="p-5 border-2 border-gray-100 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 shadow-sm active:scale-90">
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2 text-gray-400 hover:text-[#2D5A43] mb-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all group">
    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Toko
  </button>
);

const QuantityControl = ({ qty, onPlus, onMinus, onChange, onBlur }) => (
  <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1.5 bg-gray-50 w-full sm:w-auto justify-between focus-within:border-[#2D5A43] focus-within:bg-white transition-all shadow-sm">
    <button onClick={onMinus} className="p-2.5 hover:bg-white rounded-xl transition-all text-gray-500"><Minus size={16} /></button>
    <input 
      type="number" 
      value={qty}
      onChange={onChange}
      onBlur={onBlur}
      className="w-16 text-center font-black text-sm bg-transparent border-none focus:ring-0"
    />
    <button onClick={onPlus} className="p-2.5 hover:bg-white rounded-xl transition-all text-[#2D5A43]"><Plus size={16} /></button>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center bg-white min-h-screen">
    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Produk Tidak Ditemukan</h3>
    <Link to="/store" className="mt-4 text-[#2D5A43] font-black text-[10px] uppercase tracking-[0.2em] hover:underline">Balik ke Katalog</Link>
  </div>
);

export default ProductDetailPage;