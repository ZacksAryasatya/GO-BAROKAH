import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Package } from "lucide-react";
import petaniImg from "../../assets/img/petani.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user_session"));
  const userName = storedUser?.name || storedUser?.username;

  if (token) {
    return (
      <section className="w-full bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex-1">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">
              Selamat datang kembali
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-tight">
              Halo, <span className="text-[#2D5A43]">{userName}</span>
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-2">
              Pantau pesanan Anda atau kembali berbelanja kebutuhan hari ini.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/profile/orders")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-bold text-[11px] uppercase tracking-widest transition-all"
            >
              <Package size={15} />
              Riwayat
            </button>
            <button
              onClick={() => navigate("/store")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D5A43] text-white hover:bg-[#244a36] font-bold text-[11px] uppercase tracking-widest transition-all shadow-md shadow-[#2D5A43]/20"
            >
              <ShoppingBag size={15} />
              Belanja
            </button>
          </div>
          
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-[#FBFBFB] py-12 md:py-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-[60px] font-black text-gray-900 leading-[0.95] tracking-tighter uppercase">
              Kualitas <br />
              <span className="text-[#2D5A43]">Utama,</span> <br />
              Harga <br />
              <span className="text-[#2D5A43]">Barokah.</span>
            </h1>
          </div>
          
          <p className="text-gray-500 text-sm font-medium max-w-sm leading-relaxed">
            Distributor bahan pangan terpercaya. Kami hadir untuk memenuhi kebutuhan bisnis Anda dengan pelayanan jujur dan harga bersaing.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/store")}
              className="bg-gray-900 text-white px-7 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#2D5A43] transition-all"
            >
              Belanja Sekarang
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-[400px] relative">
          <img
            src={petaniImg}
            alt="Fresh Produce"
            className="w-full h-full object-cover rounded-[2rem] shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;