import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"; 
import { useSignupLogic } from "../../hooks/auth/useSignupLogic"; 
import InputField from "../../components/common/FormInput";
import Button from "../../components/common/Button"; 
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const SignUpPage = () => {
  const { 
    formData, 
    isLoading, 
    showPassword, 
    handleChange, 
    handleSignUp, 
    togglePassword,
    handleGoogleSuccess
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

        <div className="mt-6 flex justify-center hover:-translate-y-0.5 transition-transform duration-200">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Login/Daftar Google dibatalkan atau gagal.')}
            theme="outline"
            size="large"
            text="signup_with"
            shape="pill"
            width="340"
          />
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