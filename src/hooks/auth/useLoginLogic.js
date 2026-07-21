import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const useLoginLogic = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: setGlobalUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login(formData);
      const user = result?.data?.account; 
      const token = result?.data?.token;

      if (token && user) { 
        localStorage.setItem('token', token);
        setGlobalUser(user);

        toast.success(`Selamat Datang, ${user.username || 'di UD Barokah'}!`, {
          style: { borderRadius: '16px', background: '#2D5A43', color: '#fff', fontWeight: 'bold' },
        });

        
        setTimeout(() => { 
          if (user.role === 'owner') {
            navigate('/owner/dashboard', { replace: true });
          } else if (user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 1000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Email atau password salah.";
      setError(errMsg); 
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const result = await authService.loginWithGoogle(credentialResponse.credential);
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
      const errMsg = err.response?.data?.message || "Login Google gagal.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleChange, handleLogin, isLoading, error, handleGoogleSuccess };
};