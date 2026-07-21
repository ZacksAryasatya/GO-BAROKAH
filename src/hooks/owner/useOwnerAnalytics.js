import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import ownerService from "../../services/owner/ownerService";

export const useOwnerAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    omzet: null,
    netProfit: null,
    cashFlow: null,
    expenseAnalysis: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const [omzetRes, profitRes, cashFlowRes, expenseRes] = await Promise.all([
        ownerService.getOmzet(params),
        ownerService.getNetProfit(params),
        ownerService.getCashFlow(params),
        ownerService.getExpenseAnalysis(params)
      ]);

      setAnalytics({
        omzet: omzetRes?.data || omzetRes,
        netProfit: profitRes?.data || profitRes,
        cashFlow: cashFlowRes?.data || cashFlowRes,
        expenseAnalysis: expenseRes?.data || expenseRes
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
