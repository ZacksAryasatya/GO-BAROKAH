import React, { useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, ChevronRight, LayoutDashboard, ArrowRightLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NAV_ITEMS } from "../../constants/adminConstants";
import LogoutModal from "./LogoutModal"; 

const AdminSidebar = ({ alertCount = 0 }) => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem("adminSidebarMinimized") === "true";
  });

  useEffect(() => {
    localStorage.setItem("adminSidebarMinimized", isMinimized);
  }, [isMinimized]);

  const initials = useMemo(() => {
    const displayName = user?.username || user?.name || "Admin";
    return displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }, [user]);

  const isOwner = user?.role === "owner" || user?.Role === "owner" || user?.data?.role === "owner";

  return (
    <>
      <aside className={`${isMinimized ? "w-[88px] px-3" : "w-64 px-5"} h-screen sticky top-0 flex-shrink-0 flex flex-col bg-[#1a4d2e] py-8 font-sans border-r border-white/5 transition-all duration-300 ease-in-out relative`}>
        
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -right-3 top-8 bg-white text-[#1a4d2e] p-1.5 rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-transform z-50"
          title={isMinimized ? "Perbesar Sidebar" : "Perkecil Sidebar"}
        >
          {isMinimized ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>

        <header className={`mb-10 flex-shrink-0 flex flex-col ${isMinimized ? "items-center px-0" : "px-2"}`}>
          <h1 className={`font-black tracking-tighter text-white uppercase leading-none transition-all ${isMinimized ? "text-xl" : "text-2xl"}`}>
            {isMinimized ? "UD" : "UD. BAROKAH"}
          </h1>
          <div className={`h-[4px] bg-[#f5c518] rounded-full mt-2 ${isMinimized ? "w-6" : "w-12"}`} />
          {!isMinimized && (
            <p className="text-[9px] text-emerald-400/60 font-black mt-3 uppercase tracking-[0.3em]">Admin Management</p>
          )}
        </header>

        <nav className="flex flex-col gap-1.5 mb-auto overflow-x-hidden">
          {!isMinimized && <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2">Menu Utama</p>}
          {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `flex items-center ${isMinimized ? "justify-center px-0" : "justify-between px-4"} py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group
                 ${isActive ? "bg-white text-[#1a4d2e] shadow-lg shadow-black/20" : "text-white/50 hover:bg-white/10 hover:text-white"}`
              }
              title={isMinimized ? (label || id) : ""}
            >
              {({ isActive }) => (
                <>
                  <div className={`flex items-center ${isMinimized ? "justify-center" : "gap-3.5"}`}>
                    <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-[#1a4d2e]" : "text-white/30 group-hover:text-white"} />
                    {!isMinimized && <span>{label || id}</span>}
                  </div>
                  {!isMinimized && isActive && <ChevronRight size={14} strokeWidth={3} className="opacity-40" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="mt-auto pt-6 space-y-3 overflow-x-hidden">
          {isOwner && (
            <NavLink 
              to="/owner/dashboard" 
              className={`w-full flex items-center ${isMinimized ? "justify-center px-0" : "justify-between px-5"} py-3 rounded-xl text-[10px] font-black text-[#f5c518] border border-[#f5c518]/20 hover:border-[#f5c518]/40 hover:bg-[#f5c518]/10 transition-all uppercase tracking-[0.2em] group`}
              title={isMinimized ? "Beralih ke Owner" : ""}
            >
              <div className={`flex items-center ${isMinimized ? "justify-center" : "gap-3"}`}>
                <ArrowRightLeft size={14} strokeWidth={3} className="text-[#f5c518]/60 group-hover:text-[#f5c518] transition-colors" />
                {!isMinimized && <span>Beralih ke Owner</span>}
              </div>
            </NavLink>
          )}
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className={`w-full flex items-center ${isMinimized ? "justify-center px-0" : "gap-3 px-5"} py-3 rounded-xl text-[10px] font-black text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-[0.2em]`}
            title={isMinimized ? "Keluar" : ""}
          >
            <LogOut size={14} strokeWidth={3} />
            {!isMinimized && <span>Keluar</span>}
          </button>
        </footer>
      </aside>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={logout} />
    </>
  );
};

export default AdminSidebar;