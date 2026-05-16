import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import petaniImg from "../../assets/img/petani.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-[#FBFBFB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 md:py-0 md:min-h-[85vh] flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-12">
        <div className="flex-1 space-y-6 md:space-y-8 z-10 order-2 md:order-1 self-start md:self-center">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase">
              KUALITAS <br />
              <span className="text-[#2D5A43]">UTAMA,</span> <br />
              HARGA <br />
              <span className="text-[#2D5A43]">BAROKAH.</span>
            </h1>
            <p className="text-gray-500 text-[13px] font-medium max-w-sm leading-relaxed">
              Penyedia bahan pangan segar kualitas unggulan untuk kebutuhan bisnis dan keluarga Anda. Segar setiap hari, jujur dalam harga, dan terpercaya dalam pelayanan.
            </p>
          </div>

          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-4 group w-fit"
          >
            <div className="bg-gray-900 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest group-hover:bg-[#2D5A43] transition-all duration-300">
              Belanja Sekarang
            </div>
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#2D5A43] group-hover:text-[#2D5A43] transition-all">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
        <div className="w-full md:flex-1 h-64 sm:h-80 md:h-[70vh] relative order-1 md:order-2">
          <div className="w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            <img
              src={petaniImg}
              alt="Fresh Produce"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F6F8F7] -z-10 hidden md:block" />
    </section>
  );
};

export default Hero;