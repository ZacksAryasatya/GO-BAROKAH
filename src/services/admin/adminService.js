import api from '../../utils/api'; 

export const adminService = {
  updateProfile: async (formData) => {
    try {
      const response = await api.patch('/api/users', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
};