import { useState, useEffect, useCallback } from "react";
import { addressService } from "../../services/user/addressService";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export const useAddressLogic = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await addressService.getAddresses();
      const actualData = response?.data || response;
      setAddresses(Array.isArray(actualData) ? actualData : []);
    } catch (err) {
      console.error("Gagal fetch alamat:", err);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]); 
    }
  }, [fetchAddresses, user]); 

  const handleSaveAddress = async (formData, editId) => {
    setIsLoading(true);
    
    // PERBAIKAN: Validasi tipe data biar 100% cocok sama Swagger lu
    const payload = {
      label: formData.label,
      recipient_name: formData.recipient_name, 
      recipient_phone: formData.recipient_phone, 
      address_detail: formData.address_detail, 
      courier_note: formData.courier_note || "", 
      latitude: Number(formData.latitude) || 0, // Pastiin float
      longitude: Number(formData.longitude) || 0, // Pastiin float
      is_default: editId ? Boolean(formData.is_default || formData.isDefault) : false, // Pastiin boolean
    };

    try {
      if (editId) {
        await addressService.updateAddress(editId, payload);
        toast.success("Alamat diperbarui!");
      } else {
        await addressService.createAddress(payload);
        toast.success("Alamat berhasil ditambahkan!");
      }
      await fetchAddresses();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    setIsLoading(true);
    try {
      const addr = addresses.find((a) => a.id === id || a._id === id);
      if (!addr) return;

      const payload = {
        label: addr.label,
        recipient_name: addr.recipientName || addr.recipient_name,
        recipient_phone: addr.recipientPhone || addr.recipient_phone,
        address_detail: addr.addressDetail || addr.address_detail,
        courier_note: addr.courierNote || addr.courier_note || "",
        latitude: Number(addr.latitude) || 0,
        longitude: Number(addr.longitude) || 0,
        is_default: true, 
      };

      await addressService.updateAddress(id, payload);
      await fetchAddresses();
      toast.success("Alamat utama berhasil diganti!");
    } catch (err) {
      toast.error("Gagal ganti alamat utama");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    setIsLoading(true);
    try {
      await addressService.deleteAddress(id);
      toast.success("Alamat dihapus");
      await fetchAddresses();
    } catch (err) {
      toast.error("Gagal menghapus alamat");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addresses,
    isLoading,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefault,
  };
};