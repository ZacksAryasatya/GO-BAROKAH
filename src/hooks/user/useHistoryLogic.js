import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../../services/user/orderService';
import { useCart } from '../../context/CartContext';
import { formatIDR as formatCurrency } from '../../utils/formatCurrency';

export const useHistoryLogic = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);
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
      const params = {
        page: page,
        limit: 10
      };
      if (activeTab !== 'Semua') {
        params.status = statusMap[activeTab];
      }
      const response = await orderService.getOrders(params);
      
      let apiData = [];
      let meta = null;
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        apiData = response.data.data;
        meta = response.data.meta || response.data.pagination || null;
      } else if (Array.isArray(response.data)) {
        apiData = response.data;
        meta = response.meta || null;
      }
      
      if (meta) setPaginationMeta(meta);

      const mappedOrders = apiData.map(order => {
        const isPickup = order.fulfillmentMethod === 'PICKUP';
        const uiStatusMap = {
          PENDING: "Menunggu",
          PROCESSING: "Disiapkan",
          SHIPPED: isPickup ? "Dapat Diambil" : "Dikirim",
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
  }, [activeTab, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
      localStorage.setItem('pendingPayment', 'true');
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return {
    orders,
    isLoading,
    activeTab,
    setActiveTab: handleTabChange,
    statuses,
    formatCurrency,
    handleStartShopping,
    handleViewDetail,
    handleCancel,
    handleResumePayment,
    handleReorder,
    page,
    setPage,
    paginationMeta
  };
};