import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ChevronRight } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#2D5A43] text-white pt-16 md:pt-24 pb-10 md:pb-12 w-full mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 mb-14 md:mb-20">

          {/* Brand */}
          <div className="space-y-4 md:space-y-6 sm:col-span-2 md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">
              UD. <br />BAROKAH.
            </h2>
            <p className="text-white/60 text-[14px] md:text-[15px] leading-relaxed max-w-xs">
              Penyedia bahan pangan segar kualitas unggulan langsung dari distributor terpercaya.
            </p>
          </div>

          {/* Kontak */}
          <div className="space-y-3 md:space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Kontak Kami</p>
            <ul className="space-y-3 text-[14px] md:text-[15px] font-medium">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-[#A7C7B5] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 group-hover:text-white transition-colors">
                  Jalan Kecubung No.D136, RT.002, Pasir Panjang, Kec. Arut Sel., Kabupaten Kotawaringin Barat, Kalimantan Tengah 74181
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-[#A7C7B5] shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:customerservice@udbarokah.com" className="text-white/80 group-hover:text-white transition-colors">customerservice@udbarokah.com</a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-[#A7C7B5] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 group-hover:text-white transition-colors">+62 812 3456 7890</span>
              </li>
            </ul>
          </div>

          {/* Navigasi */}
          <div className="space-y-3 md:space-y-4 md:text-right flex flex-col md:items-end">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Navigasi</p>
            <ul className="space-y-3 text-[14px] md:text-[15px] font-medium uppercase tracking-tighter">
              <li>
                <Link to="/" className="group flex items-center gap-2 text-white/70 hover:text-white transition-all justify-start md:justify-end">
                  <span className="group-hover:-translate-x-1 transition-transform opacity-0 group-hover:opacity-100 hidden md:block">
                    <ChevronRight size={14} />
                  </span>
                  <span>Beranda</span>
                  <span className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 md:hidden block">
                    <ChevronRight size={14} />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/store" className="group flex items-center gap-2 text-white/70 hover:text-white transition-all justify-start md:justify-end">
                  <span className="group-hover:-translate-x-1 transition-transform opacity-0 group-hover:opacity-100 hidden md:block">
                    <ChevronRight size={14} />
                  </span>
                  <span>Katalog</span>
                  <span className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 md:hidden block">
                    <ChevronRight size={14} />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="group flex items-center gap-2 text-white/70 hover:text-white transition-all justify-start md:justify-end">
                  <span className="group-hover:-translate-x-1 transition-transform opacity-0 group-hover:opacity-100 hidden md:block">
                    <ChevronRight size={14} />
                  </span>
                  <span>Keranjang</span>
                  <span className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 md:hidden block">
                    <ChevronRight size={14} />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="group flex items-center gap-2 text-white/70 hover:text-white transition-all justify-start md:justify-end">
                  <span className="group-hover:-translate-x-1 transition-transform opacity-0 group-hover:opacity-100 hidden md:block">
                    <ChevronRight size={14} />
                  </span>
                  <span>Profil</span>
                  <span className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 md:hidden block">
                    <ChevronRight size={14} />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-center items-center text-center">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
            © {currentYear} UD BAROKAH. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;