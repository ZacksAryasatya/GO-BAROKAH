import React, { useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, ChevronRight, LayoutDashboard, Receipt, Users, ArrowRightLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LogoutModal from "../admin/LogoutModal"; 

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/owner/dashboard" },
  { id: "expenses", label: "Pengeluaran", icon: Receipt, path: "/owner/expenses" },
  { id: "employees", label: "Pegawai", icon: Users, path: "/owner/employees" },
];

const OwnerSidebar = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem("ownerSidebarMinimized") === "true";
  });

  useEffect(() => {
    localStorage.setItem("ownerSidebarMinimized", isMinimized);
  }, [isMinimized]);


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
            <p className="text-[9px] text-emerald-400/60 font-black mt-3 uppercase tracking-[0.3em]">Owner Management</p>
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
          <NavLink 
            to="/admin/dashboard" 
            className={`w-full flex items-center ${isMinimized ? "justify-center px-0" : "justify-between px-5"} py-3 rounded-xl text-[10px] font-black text-[#f5c518] border border-[#f5c518]/20 hover:border-[#f5c518]/40 hover:bg-[#f5c518]/10 transition-all uppercase tracking-[0.2em] group`}
            title={isMinimized ? "Beralih ke Admin" : ""}
          >
            <div className={`flex items-center ${isMinimized ? "justify-center" : "gap-3"}`}>
              <ArrowRightLeft size={14} strokeWidth={3} className="text-[#f5c518]/60 group-hover:text-[#f5c518] transition-colors" />
              {!isMinimized && <span>Beralih ke Admin</span>}
            </div>
          </NavLink>
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

export default OwnerSidebar;
