import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const useOwnerProfile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatarUrl: ''
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (user && !isInitialized.current) {
      setFormData({
        username: user.name || user.username || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || user.avatar || ''
      });
      isInitialized.current = true;
    }
  }, [user]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUpdateProfile = useCallback(async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUserState = {
          ...user,
          name: formData.username,
          username: formData.username,
          avatarUrl: formData.avatarUrl
        };

        updateUser(newUserState);
        toast.success("Profil Owner berhasil diperbarui (MOCK)!");
        setIsLoading(false);
        resolve({ success: true });
      }, 800);
    });

  }, [user, updateUser, formData]); 

  return {
    formData,
    isLoading,
    handleInputChange,
    handleUpdateProfile
  };
};