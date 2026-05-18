import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; 
import { addressService } from '../../services/user/addressService'; 
import { formatIDR } from '../../utils/formatCurrency';

export const useCheckoutLogic = () => {
  const { cartItems, cartSummary } = useCart();
  const { user } = useAuth(); 
  
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isPickup, setIsPickup] = useState(false);
  const [namaPenerima, setNamaPenerima] = useState('');
  const [alamatDetail, setAlamatDetail] = useState('');

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

  const zones = [
    { name: 'Pangkalan Bun (Kota)', dist: 5, rate: 0 },
    { name: 'Kumai', dist: 15, rate: 0 },
    { name: 'Pangkalan Lada', dist: 45, rate: 0.015 }, 
    { name: 'Pangkalan Banteng', dist: 65, rate: 0.015 }, 
    { name: 'Sukamandang', dist: 110, rate: 0.025 },   
    { name: 'Sukamara', dist: 90, rate: 0.025 },        
    { name: 'Lamandau', dist: 120, rate: 0.025 },       
  ];

  const rawSubtotal = cartSummary?.grand_total ?? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const activeZone = zones.find(z => z.name === selectedLocation);
  const rawShipping = isPickup ? 0 : (activeZone ? rawSubtotal * activeZone.rate : 0);
  const total = rawSubtotal + rawShipping;

  return {
    cartItems,
    zones,
    selectedLocation,
    setSelectedLocation,
    isPickup,         
    setIsPickup,      
    namaPenerima, 
    setNamaPenerima,
    alamatDetail, 
    setAlamatDetail,
    subtotal: formatIDR(rawSubtotal),
    shippingFee: formatIDR(rawShipping),
    total: formatIDR(total),
    activeZone,
    rawShipping
  };
};