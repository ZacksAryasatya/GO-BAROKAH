import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOwnerProfile } from '../../hooks/owner/useOwnerProfile';
import Sidebar from '../../components/owner/Sidebar';
import { ArrowLeft, Save, ShieldCheck, LogOut } from 'lucide-react';

const PengaturanProfil = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { formData, isLoading, handleInputChange, handleUpdateProfile } = useOwnerProfile();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mengamankan submit form bawaan browser
    const res = await handleUpdateProfile(e);
    if (res?.success) {
      // FIX: Navigasi instan menggunakan startTransition agar prioritas render UI lancar
      startTransition(() => {
        navigate('/owner/dashboard');
      });
    }
  };

  const handleLogout = async () => {
    // Untuk standardisasi enterprise, Anda bisa mengganti ini dengan komponen Modal UI kustom
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari sistem?');
    if (confirmLogout) {
      try {
        await logout();
        navigate('/login', { replace: true }); // Mengganti riwayat stack agar tidak bisa di-back
      } catch (error) {
        console.error("Gagal melakukan pemutusan sesi:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f6f9] font-sans antialiased text-slate-700 overflow-hidden">
      {/* FIX: Menampilkan preview avatar dari formData langsung di Sidebar secara real-time.
        Sehingga saat user mengubah URL foto, foto di sidebar langsung berubah sebelum di-save.
      */}
      <Sidebar 
        profileName={formData.username || user?.name || user?.username}
        profileAvatar={formData.avatarUrl || user?.avatarUrl || user?.avatar}
        onProfileClick={() => {}} 
      />

      <main className="flex-1 p-8 overflow-y-auto h-full flex justify-center items-start">
        <div className="w-full max-w-2xl space-y-5">
          
          <button 
            type="button"
            onClick={() => navigate('/owner/dashboard')}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#0f1d37] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-1 transition-transform" />
            Kembali ke Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(11,22,44,0.03)] border border-slate-100 overflow-hidden">
            
            {/* CARD HEADER */}
            <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-center">
              <div className="space-y-0.5">
                <h1 className="text-lg font-bold text-[#0f1d37] tracking-tight">Pengaturan Akun</h1>
                <p className="text-xs text-slate-400 font-medium">Kelola informasi profil utama Anda di UD BAROKAH</p>
              </div>
              
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#eefbf4] px-2.5 py-1 text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" /> Owner Active
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-[#fa5252] bg-[#fff5f5] rounded-md hover:bg-[#ffe3e3] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <LogOut className="h-3 w-3" /> Keluar
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* AVATAR MANAGEMENT */}
              <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/60 shadow-inner shrink-0">
                  <img 
                    src={formData.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"} 
                    alt="Profile Preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback jika URL gambar yang dimasukkan rusak/error
                      e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150";
                    }}
                  />
                </div>
                <InputField 
                  label="URL Foto Profil"
                  type="url" // Mengubah type ke url untuk validasi format otomatis browser
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  variant="filled"
                />
              </div>

              {/* USERNAME FIELD */}
              <InputField 
                label="Nama Pengguna (Username)"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />

              {/* EMAIL FIELD (READ ONLY) */}
              <InputField 
                label="Email Terdaftar"
                type="email"
                name="email"
                value={formData.email}
                disabled
                helperText="Email utama diatur oleh Administrator/Dev Team dan tidak dapat diubah secara mandiri."
              />

              {/* FORM ACTIONS */}
              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-50">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => navigate('/owner/dashboard')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-40"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-1.5 bg-[#1e2e4d] hover:bg-[#0f1d37] text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all cursor-pointer shadow-[0_2px_6px_rgba(30,46,77,0.15)]"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

/* REUSABLE INPUT FIELD COMPONENT (Optimized) */
const InputField = ({ 
  label, type, name, value, onChange, placeholder, required, disabled, helperText, variant = 'standard' 
}) => {
  const baseInputStyles = "w-full rounded-xl text-xs font-semibold transition-all";
  const stateStyles = disabled 
    ? "border-slate-100 bg-[#f8fafc] text-slate-400 cursor-not-allowed px-3.5 py-2.5" 
    : variant === 'filled'
      ? "border border-slate-200 bg-[#f8fafc] px-3.5 py-2 focus:border-slate-400 focus:bg-white focus:outline-none text-slate-700"
      : "border border-slate-200 bg-white px-3.5 py-2.5 text-[#0f1d37] focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200";

  return (
    <div className="space-y-1.5 flex-1 w-full">
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <input 
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${baseInputStyles} ${stateStyles}`}
      />
      {helperText && (
        <span className="text-[11px] text-slate-400 block font-medium leading-relaxed">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default PengaturanProfil;