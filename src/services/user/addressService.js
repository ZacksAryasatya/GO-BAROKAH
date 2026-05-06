import api from '../../utils/api';

export const addressService = {
  getAddresses: async () => {
    const response = await api.get('/api/users/address');
    return response.data;
  },

  createAddress: async (payload) => {
    const response = await api.post('/api/users/address', payload);
    return response.data;
  },

  updateAddress: async (id, payload) => {
    const response = await api.patch(`/api/users/address/${id}`, payload);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/api/users/address/${id}`);
    return response.data;
  }
};