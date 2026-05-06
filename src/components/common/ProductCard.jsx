import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatIDR } from '../../utils/formatCurrency';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  
  const isInCart = user && cartItems.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    if (isInCart) return;
    if (!user) {
      toast.error('Login terlebih dahulu!');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} masuk keranjang!`);
  };

  return (
    <div className="p-5 border-r border-b border-gray-100 relative group transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:z-10 bg-white flex flex-col min-h-[480px] text-left">
      <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer flex-1 mb-16">
        <div className="aspect-square w-full flex items-center justify-center mb-6 overflow-hidden rounded-2xl border border-gray-50 bg-[#FBFBFB]">
          <img 
            src={`${API_URL}${product.image_url || product.image}`} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/400x400/FBFBFB/3A5A4D?text=No+Image'; 
            }} 
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[#3A5A4D] font-black text-[9px] uppercase tracking-[0.25em] opacity-80">
             {typeof product.category === 'object' ? product.category.name : (product.category || 'Organik')}
            </span>
            <div className="h-[1px] w-3 bg-gray-200"></div>
          </div>

          <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#3A5A4D] transition-colors leading-snug">
            {product.name}
          </h4>
          <span className="font-black text-[#3A5A4D] text-lg tracking-tighter block mt-2">
            {formatIDR(product.price)}
          </span>
        </div>
      </div>
      
      <button 
        onClick={handleAddToCart}
        disabled={isInCart}
        className={`absolute bottom-6 right-6 h-11 flex items-center justify-center transition-all duration-500 z-30 rounded-2xl shadow-lg border
          ${isInCart
            ? 'bg-[#3A5A4D] text-white px-5 border-[#3A5A4D] w-auto cursor-default opacity-90' 
            : 'bg-white text-gray-700 border-gray-100 w-11 hover:border-[#3A5A4D] hover:text-[#3A5A4D] cursor-pointer'
          }`}
      >
        <ShoppingBag size={18} className={`${isInCart ? 'mr-2' : ''}`} />
        {isInCart && <span className="text-[10px] font-black uppercase tracking-widest">In Cart</span>}
      </button>
    </div>
  );
};

export default ProductCard;