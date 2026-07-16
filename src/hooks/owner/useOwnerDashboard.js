import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MOCK_ORDERS = [
  { id: "ORD-001", customer: "Adika imut", idCust: "CUST-001", date: "24/02/2026 14:30", items: 5, total: 1000000, status: "Menunggu" },
  { id: "ORD-002", customer: "Adika imut", idCust: "CUST-001", date: "24/02/2026 14:30", items: 5, total: 1000000, status: "Sedang Disiapkan" }
];

const MOCK_PRODUCTS = [
  { no: 1, name: "Beras Mawar 24Kg" },
  { no: 2, name: "Aqua 1L" },
  { no: 3, name: "Gula merah kardus" },
  { no: 4, name: "Indomie Goreng" }
];

export const useOwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [recentOrders] = useState(MOCK_ORDERS);
  const [topProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalOrders: 156,
        revenue: 45000000,
        users: 32
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []); 

  return {
    profile: user,
    stats,
    loading,
    message,
    recentOrders,
    topProducts
  };
};