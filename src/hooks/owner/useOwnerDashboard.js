import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const useOwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        
        const statsRes = await api.get('/api/products/stats', { 
          signal: controller.signal 
        }).catch((err) => {
          if (err.name === 'CanceledError') return { data: null };
          
          console.warn("Endpoint statistik backend belum siap/error:", err);
          return { data: null };
        });

        const statsData = statsRes?.data?.data || statsRes?.data;
        
        if (statsData) {
          setStats({
            totalOrders: statsData.totalOrders ?? 0,
            revenue: statsData.revenue ?? 0,
            users: statsData.users ?? 0
          });
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error("Dashboard Fetch Error:", error);
          setMessage({ type: 'error', text: 'Gagal memuat statistik dari server.' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();

   
    return () => {
      controller.abort();
    };
  }, []); 

  return {
    profile: user,
    stats,
    loading,
    message
  };
};