import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const [animate, setAnimate] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div 
        className={`relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
          animate 
            ? "scale-100 translate-y-0 opacity-100" 
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5">
            <LogOut size={32} strokeWidth={2.5} />
          </div>
          
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
            Konfirmasi Keluar
          </h3>
          <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">
            Apakah kamu yakin ingin keluar dari dashboard <span className="text-emerald-700">UD BAROKAH</span>?
          </p>
          
          <div className="flex gap-3 w-full mt-8">
            <button 
              onClick={onClose}
              className="flex-1 py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 px-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;