import React from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCartView = () => (
  <div className="flex flex-col items-center justify-center px-6 py-20 min-h-screen bg-white">
    <div className="bg-[#FBFBFB] w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-200 border border-gray-50">
      <ShoppingBag size={40} strokeWidth={1.5} />
    </div>
    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase text-center">Keranjang Kosong</h2>
    <p className="text-gray-400 mb-10 font-medium max-w-xs text-center text-sm leading-relaxed">
      Wah, keranjangmu masih sepi nih. Yuk, cari kebutuhan harianmu sekarang!
    </p>
    <Link to="/store" className="w-full sm:w-auto text-center bg-[#2D5A43] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-transform shadow-lg shadow-green-900/10">
      Mulai Belanja
    </Link>
  </div>
);

export default EmptyCartView;