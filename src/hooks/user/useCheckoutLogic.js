import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; 
import { addressService } from '../../services/user/addressService'; 
import orderService from '../../services/user/orderService'; 
import { formatIDR } from '../../utils/formatCurrency';

export const useCheckoutLogic = () => {
  const { cartItems, cartSummary } = useCart();
  const { user } = useAuth(); 
  
  const [isPickup, setIsPickup] = useState(false);
  const [namaPenerima, setNamaPenerima] = useState('');
  const [alamatDetail, setAlamatDetail] = useState('');

  const [rawShipping, setRawShipping] = useState(0);
  const [rawTotal, setRawTotal] = useState(0);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  const rawSubtotal = cartSummary?.grand_total ?? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (user && user.username) {
      setNamaPenerima(user.username);
    }
    const loadDefaultAddress = async () => {
      try {
        const response = await addressService.getAddresses();
        const addresses = response?.data || response;
        const defaultAddr = addresses.find(addr => addr.isDefault || addr.is_default);
        
        if (defaultAddr) {
          setAlamatDetail(defaultAddr.addressDetail || defaultAddr.address_detail || "");
        }
      } catch (err) {
        console.error("Gagal ambil alamat otomatis:", err);
      }
    };

    if (user) loadDefaultAddress();
  }, [user]);

  useEffect(() => {
    if (isPickup) {
      setRawShipping(0);
      setRawTotal(rawSubtotal);
    }
  }, [isPickup, rawSubtotal]);

  const hitungOngkir = useCallback(async (addressId) => {
    if (!addressId || isPickup) {
      setRawShipping(0);
      setRawTotal(rawSubtotal);
      return;
    }

    try {
      setIsLoadingShipping(true);
      const response = await orderService.calculateShippingFee(addressId);
      
      if (response && response.data) {
        setRawShipping(response.data.shippingFee);
        setRawTotal(response.data.grandTotal);
      }
    } catch (error) {
      console.error("Gagal kalkulasi ongkos kirim:", error);
      setRawShipping(0);
      setRawTotal(rawSubtotal);
    } finally {
      setIsLoadingShipping(false);
    }
  }, [isPickup, rawSubtotal]);

  return {
    cartItems,
    isPickup,         
    setIsPickup,      
    namaPenerima, 
    setNamaPenerima,
    alamatDetail, 
    setAlamatDetail,
    subtotal: formatIDR(rawSubtotal),
    shippingFee: formatIDR(rawShipping),
    total: formatIDR(rawTotal),
    hitungOngkir,
    isLoadingShipping
  };
};