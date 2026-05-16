import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { User, MapPin, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import { useProfileLogic } from "../hooks/user/useProfileLogic";
import ConfirmModal from "../components/forms/ConfirmModal";

const ProfileSideBarLayout = () => {
  const { user, handleLogout } = useProfileLogic();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      to: "/profile",
      end: true,
      icon: <User size={18} />,
      label: "Informasi Profil",
      sub: "Kelola data diri Anda",
    },
    {
      to: "/profile/address",
      icon: <MapPin size={18} />,
      label: "Alamat",
      sub: "Kelola alamat pengiriman",
    },
    {
      to: "/profile/orders",
      icon: <ShoppingBag size={18} />,
      label: "Riwayat Pesanan",
      sub: "Cek status pesanan",
    },
  ];

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
      isActive
        ? "bg-[#E8F5EE] text-[#2D5A43]"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#E8F5EE] rounded-2xl flex items-center justify-center">
                <User size={22} className="text-[#2D5A43]" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900 tracking-tight capitalize">
                  {user?.name || user?.username || "..."}
                </h2>
                <p className="text-gray-400 text-xs font-medium">
                  {user?.email || "..."}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  mobileMenuOpen
                    ? "bg-[#2D5A43] text-white"
                    : "bg-gray-50 text-gray-500 border border-gray-200"
                }`}
              >
                <span>{mobileMenuOpen ? "Tutup" : "Menu"}</span>
                <ChevronRight
                  size={14}
                  className={`transition-transform duration-300 ${mobileMenuOpen ? "rotate-90" : ""}`}
                />
              </button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="pt-4 border-t border-gray-50 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={navLinkStyle}
                  >
                    <span>{item.icon}</span>
                    <span className="text-[13px] font-bold">{item.label}</span>
                  </NavLink>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                  <span className="text-[13px] font-bold">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          <aside className="hidden lg:block w-[280px] xl:w-[300px] sticky top-8">
            <div className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-sm">
              <div className="p-7 pb-6 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#E8F5EE] rounded-2xl flex items-center justify-center shrink-0">
                    <User size={26} className="text-[#2D5A43]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-black text-gray-900 tracking-tight capitalize truncate">
                      {user?.name || user?.username || "Memuat..."}
                    </h2>
                    <p className="text-gray-400 text-[12px] font-medium truncate">
                      {user?.email || "Memuat..."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={navLinkStyle}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`p-2 rounded-xl transition-all ${isActive ? "bg-[#2D5A43] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}
                        >
                          {item.icon}
                        </span>
                        <div className="flex-1">
                          <p
                            className={`text-[13px] font-bold leading-tight ${isActive ? "text-[#2D5A43]" : ""}`}
                          >
                            {item.label}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {item.sub}
                          </p>
                        </div>
                        <ChevronRight
                          size={14}
                          className={`text-gray-300 ${isActive ? "text-[#2D5A43]" : ""}`}
                        />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
              <div className="p-3 pt-0">
                <div className="h-px bg-gray-50 mb-3" />
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
                >
                  <span className="p-2 rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
                    <LogOut size={18} />
                  </span>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-bold">Logout</p>
                    <p className="text-[11px] text-gray-400 font-medium group-hover:text-red-400 transition-colors">
                      Keluar dari aplikasi
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 w-full min-w-0">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Yakin ingin Keluar?"
        message="Anda akan keluar dari akun Barokah. Anda perlu login kembali untuk mengakses profil dan riwayat pesanan."
        confirmText="Ya, Logout"
      />
    </div>
  );
};

export default ProfileSideBarLayout;
