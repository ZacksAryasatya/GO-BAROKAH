import api from "../../utils/api";

export const getAllProducts = async () => {
  const res = await api.get("/api/products/admin/all");
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await api.patch(`/api/products/category/${id}`, data);
  return res.data;
};

export const getAllCategories = async () => {
  const res = await api.get("/api/products/category");
  return res.data;
};

export const updateType = async (id, data) => {
  const res = await api.patch(`/api/products/type/${id}`, data);
  return res.data;
};

export const getAllTypes = async () => {
  const res = await api.get("/api/products/type");
  return res.data;
};

export const createProduct = async (formData) => {
 const res = await api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await api.patch(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/api/products/${id}`);
  return res.data;
};

export const toggleProductActive = async (id) => {
  const res = await api.patch(`/api/products/${id}/toggle-active`);
  return res.data;
};

export const createCategory = async (data) => {
  const res = await api.post("/api/products/category", data);
  return res.data;
};

export const createType = async (data) => {
  const res = await api.post("/api/products/type", data);
  return res.data;
};