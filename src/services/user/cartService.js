import api from '../../utils/api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  addItem: async (productId, quantity = 1) => {
    const response = await api.post('/api/cart/items', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  updateItem: async (productId, quantity) => {
    const response = await api.patch(`/api/cart/items/${productId}`, { quantity });
    return response.data;
  },

  deleteItem: async (productId) => {
    const response = await api.delete(`/api/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/api/cart');
    return response.data;
  },
};