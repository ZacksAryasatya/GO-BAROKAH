import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import ownerService from "../../services/owner/ownerService";

export const useOwnerEmployees = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, adminsRes] = await Promise.all([
        ownerService.getAllUsers(),
        ownerService.getAllAdmins()
      ]);
      const usersData = usersRes?.data || usersRes || [];
      const adminsData = adminsRes?.data || adminsRes || [];
      
      setUsers(usersData);
      setAdmins(adminsData);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Gagal memuat daftar pegawai");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePromote = async (email) => {
    setActionLoading(true);
    try {
      await ownerService.promoteUser(email);
      await fetchEmployees();
      toast.success(`Berhasil promote ${email} menjadi Admin`);
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Gagal melakukan promote";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const handleDemote = async (email) => {
    setActionLoading(true);
    try {
      await ownerService.demoteAdmin(email);
      await fetchEmployees();
      toast.success(`Berhasil demote ${email} menjadi User`);
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Gagal melakukan demote";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users,
    admins,
    isLoading,
    actionLoading,
    fetchEmployees,
    handlePromote,
    handleDemote
  };
};
