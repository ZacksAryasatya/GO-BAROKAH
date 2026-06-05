import { useState } from 'react';
import orderService from '../../services/user/orderService'; 
import { useCart } from '../../context/CartContext'; 

export const usePaymentLogic = () => {
  const [loading, setLoading] = useState(false);
  const { loadCart } = useCart(); 

  const processOrder = async (orderData, navigate) => {
    try {
      setLoading(true);
      
      let response;
      const isPickup = orderData.addressId === 0 || orderData.addressId === "0";

      if (isPickup) {
        const payloadPickup = {
          notes: orderData.notes 
        };
        response = await orderService.createPickupOrder(payloadPickup);
      } else {
        const payloadDelivery = {
          notes: orderData.notes || "Tolong kirim secepatnya",
          address_id: Number(orderData.addressId)
        };
        response = await orderService.createDeliveryOrder(payloadDelivery);
      }
      await loadCart();
      navigate('/order-success', {
        replace: true,
        state: { order: response?.data || response }
      });

    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.response?.data?.message || "Gagal memproses pesanan.");
    } finally {
      setLoading(false);
    }
  };

  return { processOrder, loading };
};