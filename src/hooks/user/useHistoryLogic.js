import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/user/orderService';

export const useHistoryLogic = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const statuses = ['Semua', 'Menunggu', 'Disiapkan', 'Dikirim', 'Selesai', 'Dibatalkan'];

  const statusMap = {
    'Menunggu': 'PENDING',
    'Disiapkan': 'PROCESSING',
    'Dikirim': 'SHIPPED',
    'Selesai': 'COMPLETED',
    'Dibatalkan': 'CANCELLED'
  };

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (activeTab !== 'Semua') {
        params.status = statusMap[activeTab];
      }

      const response = await orderService.getOrders(params);
      const apiData = response.data || [];
      const mappedOrders = apiData.map(order => ({
        id: order.orderNumber, 
        dbId: order.id,
        created_at: order.createdAt,
        status: order.status, 
        total_amount: order.grandTotal,
        notes: order.notes,
        items: order.items?.map(item => ({
          name: item.productName,
          qty: item.quantity,
          price: item.finalUnitPrice || item.unitPrice || 0
        })) || []
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Gagal memuat riwayat pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCancel = async (orderId) => {
 try {
      await orderService.cancelOrder(orderId);
      fetchHistory(); 
    } catch (error) {
      console.error("Gagal membatalkan pesanan:", error);
      alert("Gagal membatalkan pesanan. Coba lagi.");
    }
};
  const handleStartShopping = () => navigate('/store');
  const handleViewDetail = (id) => navigate(`/profile/orders/${id}`);

  return {
    orders,
    isLoading,
    activeTab,
    setActiveTab,
    statuses,
    formatCurrency,
    handleStartShopping,
    handleViewDetail,
    handleCancel
  };
};