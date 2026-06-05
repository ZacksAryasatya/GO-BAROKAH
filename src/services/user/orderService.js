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

  getOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  }
};

export default orderService;