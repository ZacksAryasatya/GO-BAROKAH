import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLoginLogic } from '../../hooks/auth/useLoginLogic';
import InputField from '../../components/common/FormInput';
import Button from '../../components/common/Button'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const { formData, handleChange, handleLogin, isLoading, error, handleGoogleSuccess } = useLoginLogic();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const containerRef = React.useRef(null);
  const [btnWidth, setBtnWidth] = useState(340);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setBtnWidth(Math.min(400, Math.max(200, width)));
      }
    };
    // Panggil setelah render pertama
    const timeout = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] px-4 md:px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-gray-200/60 border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="mb-10">
          <Link 
            to="/store" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#2D5A43] transition-all tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> KEMBALI KE TOKO
          </Link>
        </div>
        <div className="text-left mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">
            Selamat <span className="text-[#2D5A43]">Datang.</span>
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-3 leading-relaxed">
            Masuk untuk melanjutkan belanja bahan pangan organik terbaik dari UD Barokah.
          </p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold rounded-r-xl flex flex-col gap-2 animate-in slide-in-from-top">
            <p>{error}</p>
            {(error.toLowerCase().includes('verifikasi') || error.toLowerCase().includes('aktif') || error.toLowerCase().includes('verify')) && (
               <button 
                 type="button" 
                 onClick={() => {
                   if (formData.email) {
                     localStorage.setItem('pendingVerificationEmail', formData.email);
                     navigate('/verify-otp', { state: { email: formData.email } });
                   } else {
                     toast.error("Silakan isi email Anda pada form di bawah");
                   }
                 }}
                 className="mt-1.5 px-3 py-1.5 bg-red-100/50 border border-red-200 text-red-700 hover:bg-red-100 text-[11px] font-bold rounded-lg transition-colors self-start"
               >
                 Verifikasi Akun Sekarang
               </button>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <InputField 
            label="Email Address"
            icon={<Mail size={18} />} 
            type="email" 
            name="email"
            placeholder="example@gmail.com" 
            value={formData.email} 
            onChange={handleChange} 
            required
          />
          
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Password
              </label>
              <Link to="/forgot-password" size={14} className="text-[10px] font-black text-[#2D5A43] hover:underline uppercase tracking-widest">
                Lupa?
              </Link>
            </div>
            <InputField 
              icon={<Lock size={18} />} 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-[#2D5A43] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          <div className="pt-2"> 
            <Button 
              type="submit"
              isLoading={isLoading} 
              text="MASUK SEKARANG" 
              className="w-full py-5 text-white shadow-lg shadow-green-900/10 active:scale-[0.98] transition-all font-black tracking-widest"
            />
          </div>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-gray-200"></div>
          <span className="relative bg-white px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Atau masuk dengan</span>
        </div>

        <div ref={containerRef} className="mt-6 flex justify-center hover:-translate-y-0.5 transition-transform duration-200 w-full overflow-hidden rounded-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Login Google dibatalkan atau gagal.')}
            theme="outline"
            size="large"
            text="signin_with"
            shape="pill"
            width={btnWidth.toString()}
          />
        </div>

        <div className="mt-8 text-center"> 
          <p className="text-sm text-gray-400 font-medium">
            Belum punya akun?{' '}
            <Link to="/signup" className="text-[#2D5A43] font-black hover:underline tracking-tight ml-1">
              DAFTAR AKUN
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;