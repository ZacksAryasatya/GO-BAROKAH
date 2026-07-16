import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export const useSignupLogic = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);

 const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        username: formData.username, 
        email: formData.email,
        password: formData.password
      };
      
      await authService.register(payload); 
      toast.success('Pendaftaran berhasil! Cek email untuk kode OTP.');
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal mendaftar";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const { login: setGlobalUser } = useAuth();
  const loginWithGoogleAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const result = await authService.loginWithGoogle(tokenResponse.access_token);
        const user = result?.data?.account; 
        const token = result?.data?.token;

        if (token && user) { 
          localStorage.setItem('token', token);
          setGlobalUser(user);
          toast.success(`Selamat Datang, ${user.username || 'di UD Barokah'}!`, {
            style: { borderRadius: '16px', background: '#2D5A43', color: '#fff', fontWeight: 'bold' },
          });

          setTimeout(() => { 
            if (user.role === 'owner') navigate('/owner/dashboard', { replace: true });
            else if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
            else navigate('/', { replace: true });
          }, 1000);
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || "Login/Daftar Google gagal.";
        toast.error(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Login/Daftar Google dibatalkan atau gagal.');
    }
  });

  return { formData, isLoading, showPassword, handleChange, handleSignUp, togglePassword, loginWithGoogleAction };
};