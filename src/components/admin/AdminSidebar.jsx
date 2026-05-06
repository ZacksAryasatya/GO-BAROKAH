import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NAV_ITEMS } from "../../constants/adminConstants";
import LogoutModal from "./LogoutModal"; 

const AdminSidebar = ({ alertCount = 0 }) => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initials = useMemo(() => {
    const displayName = user?.username || user?.name || "Admin";
    return displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }, [user]);

  return (
    <>
      <aside className="w-64 h-screen sticky top-0 flex-shrink-0 flex flex-col bg-[#1a4d2e] px-5 py-8 font-sans border-r border-white/5">
        <header className="px-2 mb-10 flex-shrink-0">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">UD. BAROKAH</h1>
          <div className="h-[4px] w-12 bg-[#f5c518] rounded-full mt-2" />
          <p className="text-[9px] text-emerald-400/60 font-black mt-3 uppercase tracking-[0.3em]">Admin Management</p>
        </header>

        <nav className="flex flex-col gap-1.5 mb-auto">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2">Menu Utama</p>
          {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group
                 ${isActive ? "bg-white text-[#1a4d2e] shadow-lg shadow-black/20" : "text-white/50 hover:bg-white/10 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5">
                    <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-[#1a4d2e]" : "text-white/30 group-hover:text-white"} />
                    <span>{label || id}</span>
                  </div>
                  {isActive && <ChevronRight size={14} strokeWidth={3} className="opacity-40" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="mt-auto pt-6 space-y-3">
          {alertCount > 0 && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Stok Menipis ({alertCount})</span>
              </div>
            </div>
          )}

          <NavLink to="/admin/profile" className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group border ${isActive ? "bg-white/10 border-white/20" : "hover:bg-white/5 border-transparent"}`}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-xs shadow-md uppercase">
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[11px] font-black text-white truncate uppercase tracking-wider">{user?.username || "Admin"}</p>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{user?.role || "Administrator"}</p>
            </div>
          </NavLink>

          <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-[10px] font-black text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-[0.2em]">
            <LogOut size={14} strokeWidth={3} />
            <span>Keluar</span>
          </button>
        </footer>
      </aside>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={logout} />
    </>
  );
};

export default AdminSidebar;