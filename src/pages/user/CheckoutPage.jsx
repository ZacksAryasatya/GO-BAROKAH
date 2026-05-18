import React from "react";
import { useCheckoutLogic } from "../../hooks/user/useCheckoutLogic";
import {
  MapPin,
  Truck,
  Store,
  User,
  ChevronLeft,
  ArrowRight,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    zones,
    selectedLocation,
    setSelectedLocation,
    subtotal,
    shippingFee,
    total,
    isPickup,
    setIsPickup,
    namaPenerima,
    setNamaPenerima,
    alamatDetail,
    setAlamatDetail,
  } = useCheckoutLogic();

  const isFormValid =
    namaPenerima && (isPickup || (selectedLocation && alamatDetail));

  const handleNextStep = () => {
    const orderData = {
      customerName: namaPenerima,
      items: cartItems,
      method: isPickup ? "AMBIL SENDIRI" : "DIKIRIM",
      address: isPickup
        ? "Ambil di Toko (Pangkalan Bun)"
        : `${alamatDetail} (${selectedLocation})`,
      subtotal,
      shippingFee: isPickup ? "Gratis" : shippingFee,
      total,
    };
    navigate("/payment", { state: { orderData } });
  };

  const displayTotal = isPickup
    ? subtotal
    : selectedLocation
      ? total
      : subtotal;

  return (
    <div className="bg-[#FBFBFB] min-h-screen pb-36 lg:pb-12 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-6 lg:mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#2D5A43] mb-3 text-[9px] font-black uppercase tracking-[0.2em] transition-colors group"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Keranjang
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            Data <span className="text-[#2D5A43]">Pengiriman.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-8 items-start">
          <div className="lg:col-span-3 space-y-3 lg:space-y-4">
            <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-2xl border border-gray-200/50">
              <button
                onClick={() => setIsPickup(false)}
                className={`flex-1 py-2.5 lg:py-3.5 rounded-xl font-black text-[10px] flex items-center justify-center gap-1.5 transition-all uppercase tracking-widest
                  ${!isPickup ? "bg-white text-[#2D5A43] shadow-md border border-emerald-100" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Truck size={13} /> Dikirim
              </button>
              <button
                onClick={() => setIsPickup(true)}
                className={`flex-1 py-2.5 lg:py-3.5 rounded-xl font-black text-[10px] flex items-center justify-center gap-1.5 transition-all uppercase tracking-widest
                  ${isPickup ? "bg-white text-[#2D5A43] shadow-md border border-emerald-100" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Store size={13} /> Ambil Sendiri
              </button>
            </div>
            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 space-y-5">
              <div className="space-y-2.5">
                <label className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <User size={11} className="text-[#2D5A43]" /> Nama Penerima
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 outline-none font-bold text-gray-800 text-sm focus:bg-white border-2 border-transparent focus:border-[#2D5A43]/20 transition-all"
                  value={namaPenerima}
                  onChange={(e) => setNamaPenerima(e.target.value)}
                />
              </div>
              {!isPickup ? (
                <div className="space-y-3">
                  <label className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <MapPin size={11} className="text-[#2D5A43]" /> Lokasi &
                    Alamat
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 outline-none font-black text-gray-700 cursor-pointer text-sm border border-gray-100 focus:border-[#2D5A43]/30 focus:bg-white transition-all"
                  >
                    <option value="">Pilih Kota/Kecamatan</option>
                    {zones.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Detail Alamat (Jl, No Rumah, RT/RW)"
                    rows="3"
                    className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 outline-none font-bold text-gray-800 text-sm border border-gray-100 focus:border-[#2D5A43]/30 focus:bg-white transition-all resize-none"
                    value={alamatDetail}
                    onChange={(e) => setAlamatDetail(e.target.value)}
                  />
                </div>
              ) : (
                <div className="px-4 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
                  <Info className="text-[#2D5A43] shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-[9px] font-black text-[#2D5A43] uppercase tracking-widest mb-1">
                      Lokasi Pengambilan
                    </p>
                    <p className="text-xs text-emerald-900/70 font-medium leading-relaxed">
                      Jalan Kecubung No.D136, RT.002, Pasir Panjang, Kec. Arut
                      Sel., Kabupaten Kotawaringin Barat, Kalimantan Tengah
                      74181
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <aside className="hidden lg:block lg:col-span-2">
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 sticky top-8 border border-gray-100 shadow-xl shadow-gray-200/40">
              <h3 className="text-sm font-black mb-5 text-gray-900 uppercase tracking-widest">
                Ringkasan <span className="text-[#2D5A43]">Order</span>
              </h3>

              <div className="space-y-3 mb-5 text-[11px] uppercase tracking-widest font-black">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-800">{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Ongkir</span>
                  <span className="text-[#2D5A43]">
                    {isPickup ? "Gratis" : selectedLocation ? shippingFee : "—"}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-900">Total</span>
                  <span className="text-xl text-[#2D5A43] tracking-tighter font-black leading-none">
                    {displayTotal}
                  </span>
                </div>
              </div>

              <button
                disabled={!isFormValid}
                onClick={handleNextStep}
                className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-[#2D5A43] text-white flex items-center justify-center gap-2 hover:bg-[#234735] shadow-lg shadow-emerald-900/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all active:scale-95 group"
              >
                Lanjut Pembayaran
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
          </aside>
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 pt-2.5 pb-5 z-50 shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
            <span>
              Subtotal <span className="text-gray-700">{subtotal}</span>
            </span>
            <span className="text-gray-200">·</span>
            <span>
              Ongkir{" "}
              <span className="text-[#2D5A43]">
                {isPickup ? "Gratis" : selectedLocation ? shippingFee : "—"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                Total
              </span>
              <span className="text-base font-black text-[#2D5A43] tracking-tighter leading-tight truncate">
                {displayTotal}
              </span>
            </div>
            <button
              disabled={!isFormValid}
              onClick={handleNextStep}
              className="flex-1 bg-[#2D5A43] text-white h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:bg-gray-100 disabled:text-gray-400 shadow-lg shadow-emerald-900/10"
            >
              Lanjut Bayar <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
