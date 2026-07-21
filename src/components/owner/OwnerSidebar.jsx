import React, { useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, ChevronRight, ChevronLeft, LayoutDashboard, Receipt, Users, ArrowRightLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LogoutModal from "../admin/LogoutModal"; 

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/owner/dashboard" },
  { id: "expenses", label: "Pengeluaran", icon: Receipt, path: "/owner/expenses" },
  { id: "employees", label: "Pegawai", icon: Users, path: "/owner/employees" },
];

const OwnerSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
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
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[55] md:hidden transition-opacity"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <aside className={`${isMinimized ? "md:w-20" : "md:w-64"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:sticky inset-y-0 left-0 w-64 h-screen flex-shrink-0 flex flex-col bg-white py-8 font-sans border-r border-slate-200 transition-all duration-300 ease-in-out z-[60]`}>
        
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="hidden md:flex absolute -right-3 top-8 bg-white text-slate-400 hover:text-[#1a4d2e] w-6 h-6 items-center justify-center rounded-full shadow-md border border-slate-200 transition-colors z-[70]"
          title={isMinimized ? "Perbesar Sidebar" : "Perkecil Sidebar"}
        >
          {isMinimized ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
        </button>

        <header className={`flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? "opacity-0 h-0 mb-0" : "px-6 mb-10 h-auto opacity-100"}`}>
          <h1 className="text-2xl font-black tracking-tighter text-[#1a4d2e] uppercase leading-none">
            UD. BAROKAH
          </h1>
          <div className="h-[4px] w-12 bg-[#f5c518] rounded-full mt-2" />
          <p className="text-[9px] text-slate-400 font-black mt-3 uppercase tracking-[0.3em]">Owner Management</p>
        </header>

        <nav className={`flex flex-col gap-2 mb-auto overflow-x-hidden ${isMinimized ? "mt-4" : ""}`}>
          <p className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6 mb-1 transition-all duration-300 ${isMinimized ? "opacity-0 h-0 hidden" : "opacity-100"}`}>
            Menu Utama
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `flex items-center w-full ${isMinimized ? "justify-center py-4" : "justify-between pl-8 pr-6 py-3"} text-[11px] font-black uppercase tracking-widest transition-all duration-300 group relative
                 ${isActive ? "text-[#1a4d2e]" : "text-slate-500 hover:bg-slate-50 hover:text-[#1a4d2e]"}`
              }
              title={isMinimized ? (label || id) : ""}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-[#1a4d2e] rounded-r-full shadow-sm" />}
                  <div className={`flex items-center ${isMinimized ? "md:justify-center" : "gap-3.5"}`}>
                    <Icon size={isMinimized ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#1a4d2e]" : "text-slate-400 group-hover:text-[#1a4d2e] transition-colors"} />
                    <span className={isMinimized ? "md:hidden" : ""}>{label || id}</span>
                  </div>
                  <ChevronRight size={14} strokeWidth={3} className={`opacity-40 ${isMinimized ? "md:hidden" : ""} ${!isActive && "hidden"}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="mt-auto pt-6 flex flex-col gap-2 overflow-x-hidden border-t border-slate-100 mx-4">
          <NavLink 
            to="/admin/dashboard" 
            className={`flex items-center ${isMinimized ? "md:justify-center md:w-12 md:h-12 mx-auto rounded-xl" : "justify-between px-4 py-3 rounded-xl"} text-[10px] font-black text-amber-600 border border-amber-200/50 hover:border-amber-300 hover:bg-amber-50 transition-all uppercase tracking-[0.2em] group mt-4 w-full justify-between px-4 py-3`}
            title={isMinimized ? "Beralih ke Admin" : ""}
          >
            <div className={`flex items-center ${isMinimized ? "md:justify-center" : "gap-3"}`}>
              <ArrowRightLeft size={isMinimized ? 20 : 16} strokeWidth={2.5} className="text-amber-500 group-hover:text-amber-600 transition-colors" />
              <span className={isMinimized ? "md:hidden" : ""}>Beralih ke Admin</span>
            </div>
          </NavLink>
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className={`flex items-center ${isMinimized ? "md:justify-center md:w-12 md:h-12 mx-auto rounded-xl" : "gap-3 px-4 py-3 rounded-xl"} text-[10px] font-black text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.2em] w-full gap-3 px-4 py-3`}
            title={isMinimized ? "Keluar" : ""}
          >
            <LogOut size={isMinimized ? 20 : 16} strokeWidth={2.5} className="flex-shrink-0" />
            <span className={isMinimized ? "md:hidden" : ""}>Keluar</span>
          </button>
        </footer>
      </aside>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={logout} />
    </>
  );
};

export default OwnerSidebar;
