import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  const order = state?.order;

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!order) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="bg-[#FBFBFB] min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className={`flex justify-center mb-8 transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-20 h-20 rounded-full bg-[#3A5A4D]/10 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-[#3A5A4D]" strokeWidth={1.5} />
          </div>
        </div>
        <div className={`text-center mb-10 transition-all duration-500 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-3">
            Pesanan <span className="text-[#3A5A4D]">Berhasil!</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium leading-relaxed">
            Terima kasih, <span className="font-black text-gray-600">{order.customerName}</span>. Pesanan kamu sedang kami proses.
          </p>
        </div>
        <div className={`bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden mb-5 transition-all duration-500 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="divide-y divide-gray-50">
            <div className="flex items-start gap-4 px-6 py-5">
              <div className="w-9 h-9 rounded-xl bg-[#3A5A4D]/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={15} className="text-[#3A5A4D]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dikirim ke</p>
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{order.customerName}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">{order.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5">
              <div className="w-9 h-9 rounded-xl bg-[#3A5A4D]/10 flex items-center justify-center shrink-0">
                <CreditCard size={15} className="text-[#3A5A4D]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Metode Pembayaran</p>
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{order.paymentName || order.paymentMethod}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 px-6 py-5">
              <div className="w-9 h-9 rounded-xl bg-[#3A5A4D]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Package size={15} className="text-[#3A5A4D]" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Item Pesanan</p>
                <div className="space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <p className="text-xs font-bold text-gray-700 uppercase truncate max-w-[60%]">{item.name}</p>
                      <p className="text-[10px] font-black text-gray-400">{item.quantity || item.qty}x</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#3A5A4D] px-6 py-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Subtotal</p>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Ongkir</p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-[10px] font-black text-white/70">{order.subtotal}</p>
              <p className="text-[10px] font-black text-white/70">{order.shippingFee}</p>
            </div>
          </div>
          <div className="px-6 py-5 flex items-center justify-between border-t-2 border-dashed border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tagihan</p>
            <p className="text-2xl font-black text-[#3A5A4D] tracking-tighter leading-none">{order.total}</p>
          </div>
        </div>
        <div className={`space-y-3 transition-all duration-500 delay-300 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => navigate('/profile/orders')}
            className="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-[#3A5A4D] text-white flex items-center justify-center gap-2 hover:bg-[#2d453b] shadow-lg active:scale-95 transition-all group"
          >
            Lihat Pesanan Saya
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/store')}
            className="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white border border-gray-100 text-gray-400 flex items-center justify-center gap-2 hover:text-gray-600 hover:border-gray-200 active:scale-95 transition-all"
          >
            <ShoppingBag size={15} />
            Lanjut Belanja
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;