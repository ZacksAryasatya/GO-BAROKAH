import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePaymentLogic } from '../../hooks/user/usePaymentLogic';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Loader2, CreditCard, Banknote, BookOpenCheck, ChevronLeft, ArrowRight } from 'lucide-react';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processOrder, loading } = usePaymentLogic();
  const [selectedMethod, setSelectedMethod] = useState('');

  const order = state?.orderData;

  const paymentOptions = [
    { id: 'cod', name: 'Bayar di Tempat (COD)', desc: 'Bayar saat barang sampai', icon: <Banknote size={18} />, public: true },
    { id: 'va', name: 'Virtual Account / Transfer', desc: 'Transfer ke rekening tujuan', icon: <Landmark size={18} />, public: true },
    { id: 'cc', name: 'Kartu Kredit / Debit', desc: 'Verifikasi otomatis via sistem', icon: <CreditCard size={18} />, public: true },
    { id: 'debt', name: 'Hutang / Nota Buku', desc: 'Dicatat sebagai piutang toko', icon: <BookOpenCheck size={18} />, public: false },
  ];

  const availablePayments = paymentOptions.filter(opt => opt.public || user?.canDebt);

  if (!order) return null;

  const handleFinalConfirm = () => {
    const methodInfo = paymentOptions.find(p => p.id === selectedMethod);
    processOrder(
      { ...order, paymentMethod: selectedMethod, paymentName: methodInfo?.name },
      navigate
    );
  };

  return (
    <div className="bg-[#FBFBFB] min-h-screen pb-44 lg:pb-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-16">
        <div className="mb-8 md:mb-12">
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#3A5A4D] mb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
          >
            <ChevronLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Data Pengiriman
          </button>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            Metode <span className="text-[#3A5A4D]">Pembayaran.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-16 items-start">
          <div className="lg:col-span-2 space-y-3">
            {availablePayments.map((pay) => {
              const isSelected = selectedMethod === pay.id;
              return (
                <button
                  key={pay.id}
                  onClick={() => setSelectedMethod(pay.id)}
                  className={`w-full flex items-center gap-4 md:gap-6 p-4 sm:p-5 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all text-left
                    ${isSelected
                      ? 'border-[#3A5A4D] bg-[#3A5A4D]/5 shadow-lg shadow-emerald-900/5'
                      : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                    }`}
                >
                  <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 transition-colors
                    ${isSelected ? 'bg-[#3A5A4D] text-white' : 'bg-gray-50 text-gray-400'}`}>
                    {pay.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`font-black text-sm md:text-base tracking-tight leading-tight truncate
                      ${isSelected ? 'text-[#3A5A4D]' : 'text-gray-900'}`}>
                      {pay.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      {pay.desc}
                    </span>
                  </div>
                  <div className={`ml-auto flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected ? 'border-[#3A5A4D] bg-[#3A5A4D]' : 'border-gray-200'}`}>
                    {isSelected && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-10 sticky top-32 border border-gray-100 shadow-xl shadow-gray-200/40">
              <div className="mb-8 pb-8 border-b border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Dikirim ke</p>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">{order.customerName}</h3>
                <p className="text-xs font-bold text-gray-400 mt-1.5 leading-relaxed">{order.address}</p>
              </div>

              <div className="space-y-4 mb-10 text-xs uppercase tracking-widest font-black">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span className="text-gray-900">{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Ongkir</span><span className="text-[#3A5A4D]">{order.shippingFee}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-gray-900">Total</span>
                  <span className="text-2xl text-[#3A5A4D] tracking-tighter leading-none font-black">{order.total}</span>
                </div>
              </div>

              <button
                disabled={!selectedMethod || loading}
                onClick={handleFinalConfirm}
                className="w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#3A5A4D] text-white flex items-center justify-center gap-3 hover:bg-[#2d453b] shadow-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all active:scale-95 group"
              >
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : <>Konfirmasi Pesanan <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" /></>
                }
              </button>
            </div>
          </aside>
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 pt-3 pb-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.07)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-2 px-0.5">
            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
              <span>Subtotal <span className="text-gray-700">{order.subtotal}</span></span>
              <span className="text-gray-200">|</span>
              <span>Ongkir <span className="text-[#3A5A4D]">{order.shippingFee}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Total</span>
              <span className="text-lg font-black text-[#3A5A4D] tracking-tighter leading-tight">{order.total}</span>
            </div>
            <button
              disabled={!selectedMethod || loading}
              onClick={handleFinalConfirm}
              className="flex-1 bg-[#3A5A4D] text-white h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:bg-gray-100 disabled:text-gray-400 shadow-lg shadow-emerald-900/10"
            >
              {loading
                ? <Loader2 size={17} className="animate-spin" />
                : <>Konfirmasi <ArrowRight size={15} strokeWidth={2.5} /></>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;