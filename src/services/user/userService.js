import api from '../../utils/api'; 

export const userService = {
  updateProfile: async (userData) => { 
    const response = await api.patch('/api/users', userData);
    return response.data;
  },
  getProfile: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  }
};