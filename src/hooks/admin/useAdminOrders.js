import { useState, useEffect } from "react";
import { adminOrderService } from "../../services/admin/adminOrderService";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mapStatusToUI = (apiStatus, isPickup) => {
    const statusMap = {
      PENDING: "Menunggu",
      PROCESSING: "Disiapkan",
      SHIPPED: isPickup ? "Dapat Diambil" : "Dikirim",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
    };
    return statusMap[apiStatus] || apiStatus;
  };

  const mapStatusToAPI = (uiStatus) => {
    const statusMap = {
      Menunggu: "PENDING",
      Disiapkan: "PROCESSING",
      "Dapat Diambil": "SHIPPED",
      Dikirim: "SHIPPED",
      Selesai: "COMPLETED",
      Dibatalkan: "CANCELLED",
    };
    return statusMap[uiStatus] || uiStatus;
  };

  const normalizeOrder = (o) => {
    const isPickup = o.fulfillmentMethod === "PICKUP";

    return {
      id: o.id,
      order_number: o.orderNumber,
      customer_name: o.recipientName,
      customer_phone: o.recipientPhone,
      user_id: o.userId,
      created_at: new Date(o.createdAt).toLocaleString("id-ID"),
      address: o.shippingAddress,
      total_price: o.grandTotal,
      status: mapStatusToUI(o.status, isPickup),
      payment_status: o.paymentStatus,
      is_pickup: isPickup,
      payment_method: o.paymentMethod || "Transfer Bank / VA",
      notes: o.notes || null,
      items: o.items?.map((item) => ({
        name: item.productName,
        qty: item.quantity,
        price: item.finalUnitPrice,
      })) || [],
    };
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await adminOrderService.getAllOrders();
      const dataAsli = response.data?.data || response.data || [];
      setOrders(dataAsli.map(normalizeOrder));
    } catch (error) {
      console.error("Gagal mengambil data pesanan admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatusUI) => {
    try {
      const statusForAPI = mapStatusToAPI(newStatusUI);
      await adminOrderService.updateOrderStatus(orderId, statusForAPI);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatusUI } : order,
        ),
      );
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
      alert("Gagal update status pesanan. Coba lagi.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, isLoading, fetchOrders, handleUpdateStatus };
};