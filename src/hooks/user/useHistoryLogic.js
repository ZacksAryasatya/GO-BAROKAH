import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../../services/user/orderService';
import { useCart } from '../../context/CartContext';

export const useHistoryLogic = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
      const mappedOrders = apiData.map(order => {
        const isPickup = order.fulfillmentMethod === 'PICKUP';
        const uiStatusMap = {
          PENDING: "Menunggu",
          PROCESSING: "Disiapkan",
          SHIPPED: isPickup ? "Siap Diambil" : "Dikirim",
          COMPLETED: "Selesai",
          CANCELLED: "Dibatalkan",
        };
        const uiStatus = uiStatusMap[order.status] || order.status;

        return {
          id: order.orderNumber, 
          dbId: order.id,
          created_at: order.createdAt,
          status: uiStatus, 
          total_amount: order.grandTotal,
          shipping_fee: order.shippingFee,
          notes: order.notes,
          paymentStatus: order.paymentStatus, 
          paymentUrl: order.paymentUrl,
          isPickup: isPickup,
          items: order.items?.map(item => ({
            id: item.productId,
            name: item.productName,
            qty: item.quantity,
            price: item.finalUnitPrice || item.unitPrice || 0
          })) || []
        };
      });

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

  const handleResumePayment = (url) => {
    if (url) {
      window.location.href = url;
    } else {
      alert("Link pembayaran tidak ditemukan.");
    }
  };

  const handleReorder = async (items) => {
    try {
      for (const item of items) {
        if (item.id) {
          await addToCart({ id: item.id }, item.qty);
        }
      }
      toast.success("Produk berhasil ditambahkan ke keranjang!");
      navigate('/cart');
    } catch (error) {
      toast.error("Gagal menambahkan beberapa produk ke keranjang.");
      console.error(error);
    }
  };

  return {
    orders,
    isLoading,
    activeTab,
    setActiveTab,
    statuses,
    formatCurrency,
    handleStartShopping,
    handleViewDetail,
    handleCancel,
    handleResumePayment,
    handleReorder
  };
};