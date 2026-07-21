import { useState, useEffect, useMemo } from "react";
import { productService } from "../../services/user/productService";
import { useProductFilter } from "./useProductFilter";
import { buildImageUrl } from "../../utils/imageUrl";

export const useHomeLogic = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await productService.getAllProducts();
        const actualData = Array.isArray(response)
          ? response
          : response?.data || response?.products || [];
        
        setProducts(actualData.map((p) => ({
          ...p,
          image_url: buildImageUrl(p.image_url || p.image),
        })));
      } catch (err) {
        console.error("Database Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products?.map((p) => p.category?.name || p.category) || [])].filter(Boolean);
  }, [products]);

  const filteredProducts = useProductFilter(
    Array.isArray(products) ? products : [],
    searchQuery,
    activeFilters,
  );

  const toggleFilter = (catName) => {
    setActiveFilters((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [catName],
    );
  };

  return {
    loading,
    categories,
    activeFilters,
    setActiveFilters,
    toggleFilter,
    filteredProducts
  };
};
