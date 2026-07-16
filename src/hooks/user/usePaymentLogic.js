import { useState } from 'react';
import orderService from '../../services/user/orderService'; 
import { useCart } from '../../context/CartContext'; 

export const usePaymentLogic = () => {
  const [loading, setLoading] = useState(false);
  const { loadCart } = useCart(); 

  const processOrder = async (orderData, isPickup, navigate) => {
    try {
      setLoading(true);
      
      let response;

      if (isPickup) {
        const payloadPickup = {
          notes: orderData.notes 
        };
        response = await orderService.createPickupOrder(payloadPickup);
      } else {
        const payloadDelivery = {
          notes: orderData.notes,
          address_id: Number(orderData.address_id) 
        };
        response = await orderService.createDeliveryOrder(payloadDelivery);
      }
      
      await loadCart();

      const orderId = response?.data?.id || response?.data?.data?.id || response?.id;

      if (orderId) {
        if (isPickup) {
          navigate('/order-success', {
            replace: true,
            state: { order: response?.data?.data || response?.data || response }
          });
          return;
        }

        const paymentRes = await orderService.payOrder(orderId);
        
        const paymentUrl = paymentRes?.data?.payment_url || paymentRes?.payment_url;

        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        }
      }

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