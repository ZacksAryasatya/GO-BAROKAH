import { useState } from 'react';

export const usePaymentLogic = () => {
  const [loading, setLoading] = useState(false);

  const processOrder = (orderData, navigate) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/order-success', {
        replace: true,
        state: { order: orderData },
      });
    }, 1200);
  };

  return { processOrder, loading };
};