import api from "../../utils/api";

export const getAllExpenses = (params) => {
  return api.get("/api/owner/expenses", { params });
};

export const getExpenseDetail = (id) => {
  return api.get(`/api/owner/expenses/${id}`);
};

export const createExpense = (data) => {
  return api.post("/api/owner/expenses", data);
};

export const updateExpense = (id, data) => {
  return api.put(`/api/owner/expenses/${id}`, data);
};

export const deleteExpense = (id) => {
  return api.delete(`/api/owner/expenses/${id}`);
};

export const getOmzet = (params) => {
  return api.get("/api/owner/analytics/omzet", { params });
};

export const getNetProfit = (params) => {
  return api.get("/api/owner/analytics/net-profit", { params });
};

export const getCashFlow = (params) => {
  return api.get("/api/owner/analytics/cash-flow", { params });
};

export const getCostAnalysis = (params) => {
  return api.get("/api/owner/analytics/cost-analysis", { params });
};

export const getAllUsers = () => {
  return api.get("/api/owner/employee/users");
};

export const getAllAdmins = () => {
  return api.get("/api/owner/employee/admins");
};

export const promoteUser = (email) => {
  return api.patch("/api/owner/employee/promote", { email });
};

export const demoteAdmin = (email) => {
  return api.patch("/api/owner/employee/demote", { email });
};
