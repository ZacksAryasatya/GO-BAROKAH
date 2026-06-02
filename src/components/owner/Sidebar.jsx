import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  History, 
  Settings,
  ChevronRight 
} from 'lucide-react';

const Sidebar = ({ profileName, profileAvatar, onProfileClick }) => {
  const defaultAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150";

  const baseMenuClass = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all";
  const activeMenuClass = "flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-all";

  return (
    <aside className="w-66 bg-[#265345] p-5 text-white flex flex-col justify-between shrink-0 h-full border-r border-white/5 select-none">
      <div className="flex flex-col h-full">
        
        {/* LOGO AREA */}
        <div className="mb-5">
          <h2 className="text-xl font-bold tracking-wider text-white">UD BAROKAH</h2>
          <p className="text-[11px] text-emerald-300/60 font-medium tracking-wide mt-0.5">Admin Dashboard</p>
        </div>

        <div className="w-full h-[1px] bg-white/10 mb-5" />

        {/* PROFILE CARD */}
        <div 
          onClick={onProfileClick}
          className="flex items-center justify-between gap-2 mb-5 py-2.5 px-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group border border-transparent hover:border-white/10"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-slate-700 shadow-inner">
              <img 
                src={profileAvatar || defaultAvatar} 
                alt="Profile Avatar" 
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-sm font-semibold text-white/90 leading-tight truncate tracking-wide">
                {profileName || "Loading..."}
              </h4>
              <p className="text-[11px] font-medium text-emerald-400/80 mt-0.5">Owner</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

        <div className="w-full h-[1px] bg-white/10 mb-5" />

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
          <NavLink 
            to="/owner/dashboard" 
            className={({ isActive }) => isActive ? activeMenuClass : baseMenuClass}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          
          <NavLink 
            to="/owner/analisis" 
            className={({ isActive }) => isActive ? activeMenuClass : baseMenuClass}
          >
            <BarChart3 className="h-4 w-4" /> Analisi keuangan
          </NavLink>
          
          <NavLink 
            to="/owner/rekap" 
            className={({ isActive }) => isActive ? activeMenuClass : baseMenuClass}
          >
            <Package className="h-4 w-4" /> Rekap Barang
          </NavLink>
          
          <NavLink 
            to="/owner/riwayat" 
            className={({ isActive }) => isActive ? activeMenuClass : baseMenuClass}
          >
            <History className="h-4 w-4" /> Riwayat Transaksi
          </NavLink>
          
          <NavLink 
            to="/owner/profil" 
            className={({ isActive }) => isActive ? activeMenuClass : baseMenuClass}
          >
            <Settings className="h-4 w-4" /> Pengaturan
          </NavLink>
        </nav>
        
      </div>
    </aside>
  );
};

export default Sidebar;