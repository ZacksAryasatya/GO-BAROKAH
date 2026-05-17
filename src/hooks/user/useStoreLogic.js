import { useState, useMemo, useCallback, useEffect } from "react";
import { productService } from "../../services/user/productService";
import { API_URL } from "../../utils/api";
 
export const useStoreLogic = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState([]);
  const [limit, setLimit] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
 
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productService.getAllProducts();
      const rawData = response.data || response;
      const sanitizedData = rawData.map((p) => {
        const imagePath = p.image_url || p.image || p.img || '';
        return {
          ...p,
          id: p._id || p.id,
          image_url: imagePath.startsWith('http') ? imagePath : imagePath ? `${API_URL}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1") : '',
        };
      });
      setProducts(sanitizedData);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
 
  const categories = useMemo(() => {
    const allCats = products.map((p) => typeof p.category === 'object' ? p.category.name : p.category);
    return [...new Set(allCats)].filter(Boolean).sort();
  }, [products]);
 
  const handleFilterChange = useCallback((cat) => {
    setFilter((prev) => prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]);
    setLimit(6);
  }, []);
 
  const filteredDataResult = useMemo(() => {
    return filter.length === 0 ? products : products.filter((p) => {
      const categoryName = typeof p.category === 'object' ? p.category.name : p.category;
      return filter.includes(categoryName);
    });
  }, [filter, products]);
 
  return {
    filter, categories, isLoading,
    filteredData: filteredDataResult.slice(0, limit),
    totalCount: filteredDataResult.length,
    currentLimit: limit,
    handleFilterChange,
    loadMore: () => setLimit((prev) => prev + 3),
    clearFilter: () => { setFilter([]); setLimit(6); },
    refreshProducts: fetchProducts,
  };
};