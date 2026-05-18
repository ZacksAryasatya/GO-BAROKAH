import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, Lock, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        <div className="relative select-none">
          <span className="text-[120px] font-black tracking-[-6px] text-gray-100 leading-none">
            403
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-3">
          Akses Ditolak
        </h1>
        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
          Akun Anda tidak memiliki izin untuk mengakses halaman ini.
          Hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#1a4d2e] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={14} />
            Kembali
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Ke beranda
          </button>
        </div>
        <p className="mt-10 text-[10px] text-gray-300 tracking-widest uppercase">
          GO-BAROKAH · Security Protocol 
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;