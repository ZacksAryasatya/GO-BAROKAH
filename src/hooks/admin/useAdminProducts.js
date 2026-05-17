import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api, { API_URL } from "../../utils/api";
import { getAllProducts, getAllCategories, createProduct, updateProduct, deleteProduct, getAllTypes } from "../../services/admin/productService";
 
const buildImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};
 
const normalizeProduct = (p) => ({
  ...p,
  id: String(p?.id || p?._id || Math.random()),
  category: p.category || { name: "Tanpa Kategori" },
  type: p.type || { name: "Tanpa Satuan" },
  image_url: buildImageUrl(p.image_url || p.image),
});
 
const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;
 
export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
 
  const fetchProducts = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const [prodRes, catRes, typeRes] = await Promise.all([getAllProducts(), getAllCategories(), getAllTypes()]);
      const prodData = prodRes?.data?.data || prodRes?.data || prodRes || [];
      const catData = catRes?.data?.data || catRes?.data || catRes || [];
      const typeData = typeRes?.data?.data || typeRes?.data || typeRes || [];
      setProducts(prodData.map(normalizeProduct));
      setCategories(catData);
      setTypes(typeData);
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memuat daftar produk"));
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchProducts(true); }, [fetchProducts]);
 
  const handleAddCategory = async (data) => {
    try {
      const response = await api.post("/api/products/category", data);
      const newCat = response.data?.data || response.data;
      toast.success("Kategori baru berhasil ditambahkan");
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    } catch (err) {
      const msg = getErrorMessage(err, "Gagal menambah kategori");
      toast.error(msg); throw new Error(msg);
    }
  };
 
  const handleAddType = async (data) => {
    try {
      const response = await api.post("/api/products/type", data);
      const newType = response.data?.data || response.data;
      toast.success("Satuan baru berhasil ditambahkan");
      setTypes((prev) => [...prev, newType]);
      return newType;
    } catch (err) {
      const msg = getErrorMessage(err, "Gagal menambah satuan");
      toast.error(msg); throw new Error(msg);
    }
  };
 
  const handleCreate = async (productData) => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      ["name", "category_id", "type_id", "price", "description", "stock", "discount_amount"].forEach((key) => {
        if (productData[key] !== undefined && productData[key] !== null) formData.append(key, productData[key]);
      });
      if (productData.image instanceof File) formData.append("image", productData.image);
      await createProduct(formData);
      await fetchProducts();
      toast.success("Produk berhasil ditambah!");
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, "Gagal upload produk");
      toast.error(msg); return { success: false, message: msg };
    } finally { setActionLoading(false); }
  };
 
  const handleUpdate = async (id, productData) => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      ["name", "category_id", "type_id", "price", "description", "stock", "discount_amount"].forEach((key) => {
        if (productData[key] !== undefined && productData[key] !== null) formData.append(key, productData[key]);
      });
      if (productData.image instanceof File) formData.append("image", productData.image);
      const response = await updateProduct(id, formData);
      const updated = response?.data?.data || response?.data || response;
      setProducts((prev) => prev.map((p) => (p.id === String(id) ? normalizeProduct(updated) : p)));
      toast.success("Produk berhasil diperbarui");
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, "Gagal memperbarui produk");
      toast.error(msg); return { success: false, message: msg };
    } finally { setActionLoading(false); }
  };
 
  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== String(id)));
      toast.success("Produk telah dihapus secara permanen");
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, "Gagal menghapus produk");
      toast.error(msg); return { success: false, message: msg };
    } finally { setActionLoading(false); }
  };
 
  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/api/products/category/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Kategori berhasil dihapus");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus kategori"));
    }
  };
 
  const handleDeleteType = async (id) => {
    try {
      await api.delete(`/api/products/type/${id}`);
      setTypes((prev) => prev.filter((t) => t.id !== id));
      toast.success("Satuan berhasil dihapus");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus satuan"));
    }
  };
 
  return { products, categories, types, isLoading, actionLoading, fetchProducts, handleCreate, handleUpdate, handleDelete, handleAddCategory, handleAddType, handleDeleteCategory, handleDeleteType };
};