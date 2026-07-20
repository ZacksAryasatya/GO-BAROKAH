import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/store', label: 'Katalog' },
];

const CartBadge = ({ count, size = 'md' }) =>
  count > 0 ? (
    <span className={`absolute bg-red-500 text-white font-black flex items-center justify-center rounded-full border-2 border-white
      ${size === 'sm' ? 'top-0 right-0 text-[8px] min-w-[16px] h-4 px-0.5' : '-top-2 -right-2 text-[9px] min-w-[16px] h-4 px-0.5 shadow-sm'}`}>
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

const Navbar = () => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const closeAll = () => { setMenuOpen(false); setSearchOpen(false); };

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => { closeAll(); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => { if (navRef.current && !navRef.current.contains(e.target)) closeAll(); };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => mobileSearchRef.current?.focus(), 300);
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    } else {
      navigate('/store');
    }
  };

  const isActive = (path) => pathname === path;
  const displayName = (user?.name || user?.username || '').split(' ')[0] || 'User';
  const navLinkClass = (path, base) =>
    `${base} transition-colors ${isActive(path) ? 'text-[#2D5A43]' : 'text-gray-400 hover:text-black'}`;

  const links = [...NAV_LINKS];
  if (user?.role === 'owner') links.push({ to: '/owner/dashboard', label: 'Dashboard' });
  else if (user?.role === 'admin') links.push({ to: '/admin/dashboard', label: 'Dashboard' });

  return (
    <nav
      ref={navRef}
      className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-gray-100 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-[#2D5A43] text-xl sm:text-2xl font-black tracking-tighter leading-none uppercase">UD. Barokah</h1>
          <div className="w-full h-[3px] bg-gradient-to-r from-yellow-400 to-transparent mt-0.5 opacity-70 rounded-full" />
        </Link>
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 min-w-0 max-w-xl relative mx-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#2D5A43] transition-colors pointer-events-none" />
          <input 
            type="text" 
            placeholder="Cari kebutuhan pangan segar..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-gray-50/60 border border-gray-200/80 rounded-full py-2.5 pl-11 pr-10 text-xs font-medium transition-all duration-300 outline-none placeholder:text-gray-400 focus:bg-white focus:border-[#2D5A43] focus:ring-4 focus:ring-[#2D5A43]/5 shadow-sm shadow-black/[0.01]"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </form>
        <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
          <ul className="flex items-center gap-6">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={navLinkClass(to, 'text-[10px] font-black uppercase tracking-[0.2em]')}>{label}</Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5 border-l pl-6 border-gray-200">
            <Link to="/cart" className="relative text-gray-800 hover:text-[#2D5A43] transition-all group" aria-label={`Keranjang, ${totalItems} item`}>
              <ShoppingCart className="w-5 h-5 stroke-[2] group-hover:scale-110 transition-transform" />
              <CartBadge count={totalItems} />
            </Link>

            <Link to={user ? '/profile' : '/login'} className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-[#2D5A43]/5 rounded-full flex items-center justify-center border border-[#2D5A43]/10 group-hover:bg-[#2D5A43] group-hover:border-[#2D5A43] group-hover:text-white transition-all">
                <User className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex flex-col leading-none">
                {user ? (
                  <>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Akun</span>
                    <span className="text-[11px] font-black text-gray-900 uppercase tracking-tighter group-hover:text-[#2D5A43] transition-colors">{displayName}</span>
                  </>
                ) : (
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">Masuk</span>
                )}
              </div>
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          <button onClick={() => setSearchOpen((p) => !p)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle search" aria-expanded={searchOpen}>
            {searchOpen ? <X size={17} /> : <Search size={17} />}
          </button>

          <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center" aria-label={`Keranjang, ${totalItems} item`}>
            <ShoppingCart size={20} className="text-gray-800" />
            <CartBadge count={totalItems} size="sm" />
          </Link>

          <button onClick={() => setMenuOpen((p) => !p)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#2D5A43] text-white hover:bg-[#234835] transition-colors"
            aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white ${
        searchOpen ? 'max-h-20 opacity-100 border-t border-gray-100 py-3' : 'max-h-0 opacity-0'
      }`}>
        <form onSubmit={handleSearch} className="px-4 relative">
          <input 
            ref={mobileSearchRef} 
            type="text" 
            placeholder="Cari produk..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-gray-50 rounded-xl py-2.5 pl-5 pr-10 text-sm font-medium outline-none border border-transparent focus:bg-white focus:border-[#2D5A43] focus:ring-4 focus:ring-[#2D5A43]/5 transition-all"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={15} />
            </button>
          )}
        </form>
      </div>
      <div className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out bg-white border-t border-gray-100 ${
        menuOpen ? 'max-h-72 opacity-100 shadow-xl' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={closeAll}
              className={navLinkClass(to, 'text-sm font-black uppercase tracking-[0.2em]')}>
              {label}
            </Link>
          ))}

          <div className="h-px bg-gray-100 w-full" />

          <Link to={user ? '/profile' : '/login'} onClick={closeAll} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 flex-shrink-0">
              <User className="w-5 h-5 stroke-[1.5] text-gray-600" />
            </div>
            <div className="flex flex-col leading-none">
              {user ? (
                <>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Akun Profil</span>
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{user.name || user.username || 'User'}</span>
                </>
              ) : (
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-800 transition-colors">Masuk / Daftar</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;