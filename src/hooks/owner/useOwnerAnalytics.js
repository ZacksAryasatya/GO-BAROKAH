import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getOmzet,
  getNetProfit,
  getCashFlow,
  getCostAnalysis
} from "../../services/owner/ownerService";

export const useOwnerAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    omzet: null,
    netProfit: null,
    cashFlow: null,
    costAnalysis: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const [omzetRes, profitRes, cashFlowRes, costRes] = await Promise.all([
        getOmzet(params),
        getNetProfit(params),
        getCashFlow(params),
        getCostAnalysis(params)
      ]);

      setAnalytics({
        omzet: omzetRes?.data?.data || omzetRes?.data || omzetRes,
        netProfit: profitRes?.data?.data || profitRes?.data || profitRes,
        cashFlow: cashFlowRes?.data?.data || cashFlowRes?.data || cashFlowRes,
        costAnalysis: costRes?.data?.data || costRes?.data || costRes
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Gagal memuat data analitik");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analytics,
    isLoading,
    fetchAnalytics
  };
};
