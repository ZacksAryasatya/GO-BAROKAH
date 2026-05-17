import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/user/productService';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const useProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const fetchProductDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await productService.getProductById(id);
      const p = response.data || response;
      const imagePath = p.image_url || p.image || p.img || '';
      const cleanBaseUrl = api.defaults.baseURL?.replace(/\/$/, '') || '';
      const cleanImagePath = imagePath.replace(/^\//, '');

      const sanitizedProduct = {
        ...p,
        id: p._id || p.id,
        category: typeof p.category === 'object' ? p.category.name : p.category,
        img: imagePath.startsWith('http')
          ? imagePath
          : imagePath === ''
          ? ''
          : `${cleanBaseUrl}/${cleanImagePath}`,
      };

      setProduct(sanitizedProduct);
      if (sanitizedProduct.name) {
        document.title = `${sanitizedProduct.name} | UD Barokah`;
      }
    } catch (err) {
      console.error('❌ Gagal ambil detail produk:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const increase = () => setQuantity((prev) => (prev === '' ? 1 : prev + 1));
  const decrease = () => setQuantity((prev) => Math.max(1, prev === '' ? 1 : prev - 1));

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (val === '') { setQuantity(''); return; }
    const num = parseInt(val);
    if (!isNaN(num)) setQuantity(Math.max(1, num));
  };

  const handleBlur = () => {
    if (quantity === '' || quantity < 1) setQuantity(1);
  };

  const onAddToCart = async () => {
    if (!product || quantity === '') return;
    setAdding(true);
    try {
      await addToCart({ ...product, id: product._id || product.id }, quantity);
      toast.success(`${product.name} ditambahkan ke keranjang!`, {
        style: {
          borderRadius: '16px',
          background: 'white',
          color: '#2D5A43',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setAdding(false);
    }
  };

  return {
    product,
    loading,
    adding,
    quantity,
    increase,
    decrease,
    handleQuantityChange,
    handleBlur,
    onAddToCart,
    goBack: () => navigate(-1),
  };
};