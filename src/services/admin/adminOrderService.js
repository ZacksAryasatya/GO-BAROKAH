import api from '../../utils/api'; 

const adminOrderService = {
  getAllOrders: async (params = {}) => {
    const response = await api.get('/api/admin/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/api/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/api/admin/orders/${id}/status`, { status });
    return response.data;
  },

  updatePaymentStatus: async (id, payment_status) => {
    const response = await api.patch(`/api/admin/orders/${id}/payment-status`, { payment_status });
    return response.data;
  }
};

export default adminOrderService;