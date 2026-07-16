import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"; 
import { useSignupLogic } from "../../hooks/auth/useSignupLogic"; 
import InputField from "../../components/common/FormInput";
import Button from "../../components/common/Button"; 
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const { 
    formData, 
    isLoading, 
    showPassword, 
    handleChange, 
    handleSignUp, 
    togglePassword,
    loginWithGoogleAction
  } = useSignupLogic();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/60 border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="mb-10">
          <Link 
            to="/store" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#2D5A43] transition-all tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            KEMBALI KE TOKO
          </Link>
        </div>

        <div className="text-left mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">
            Buat <span className="text-[#2D5A43]">Akun.</span>
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-3 leading-relaxed">
            Gabung bersama komunitas UD Barokah untuk pengalaman belanja organik terbaik.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <InputField 
            label="Username"
            icon={<User size={18} />} 
            type="text" 
            name="username"
            placeholder="Username Anda" 
            value={formData.username} 
            onChange={handleChange} 
            required
          />

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

          <InputField 
            label="Password"
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
                onClick={togglePassword} 
                className="text-gray-400 hover:text-[#2D5A43] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="pt-2"> 
            <Button 
              type="submit"
              isLoading={isLoading} 
              text="DAFTAR SEKARANG" 
              className="w-full py-5 text-white shadow-lg shadow-green-900/10 active:scale-[0.98] transition-all font-black tracking-widest"
            />
          </div>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-gray-200"></div>
          <span className="relative bg-white px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Atau daftar dengan</span>
        </div>

        <div className="mt-6">
          <button 
            type="button"
            onClick={() => loginWithGoogleAction()}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all font-bold shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Daftar dengan Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#2D5A43] font-black hover:underline tracking-tight ml-1">
              MASUK DI SINI
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;