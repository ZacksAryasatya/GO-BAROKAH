import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import ownerService from "../../services/owner/ownerService";

export const useOwnerExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchExpenses = useCallback(async (params = {}, isMounted = { current: true }) => {
    setIsLoading(true);
    try {
      const res = await ownerService.getAllExpenses(params);
      if (!isMounted.current) return;
      const data = res?.data || res || [];
      setExpenses(data);
    } catch (err) {
      if (isMounted.current) toast.error(err?.response?.data?.message || err?.message || "Gagal memuat pengeluaran");
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  const handleCreate = async (data) => {
    setActionLoading(true);
    try {
      await ownerService.createExpense(data);
      await fetchExpenses();
      toast.success("Pengeluaran berhasil dicatat");
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Gagal mencatat pengeluaran";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setActionLoading(true);
    try {
      await ownerService.updateExpense(id, data);
      await fetchExpenses();
      toast.success("Pengeluaran berhasil diperbarui");
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Gagal memperbarui pengeluaran";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await ownerService.deleteExpense(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      toast.success("Pengeluaran berhasil dihapus");
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Gagal menghapus pengeluaran";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    expenses,
    isLoading,
    actionLoading,
    fetchExpenses,
    handleCreate,
    handleUpdate,
    handleDelete
  };
};
