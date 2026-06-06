import api from '../../utils/api';

const orderService = {
  createDeliveryOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData); 
    return response.data;
  },

  createPickupOrder: async (orderData) => {
    const response = await api.post('/api/orders/pickup', orderData); 
    return response.data;
  },

  getOrders: async (params = {}) => {
    const response = await api.get('/api/orders', { params });
    return response.data;
  },
  cancelOrder: async (orderId) => {
    const response = await api.patch(`/api/orders/${orderId}/cancel`);
    return response.data;
  },
};

export default orderService;