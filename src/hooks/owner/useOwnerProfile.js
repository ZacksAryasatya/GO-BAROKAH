import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/admin/adminService';

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
    
    try {
      const response = await adminService.updateProfile(formData);
      const result = response?.user || response?.data || response;

      const newUserState = {
        ...user,
        ...result,
        name: formData.username,
        username: formData.username
      };

      updateUser(newUserState);
      toast.success("Profil Owner berhasil diperbarui!");
      return { success: true };
    } catch (err) {
      console.error("Update Profile Error:", err);
      const msg = err.response?.data?.message || "Gagal memperbarui profil";
      toast.error(msg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser]); 

  return {
    formData,
    isLoading,
    handleInputChange,
    handleUpdateProfile
  };
};