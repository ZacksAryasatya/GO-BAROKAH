import api from "../../utils/api";

const ownerService = {
  getAllExpenses: async (params) => {
    const response = await api.get("/api/owner/expenses", { params });
    return response.data;
  },
  getExpenseDetail: async (id) => {
    const response = await api.get(`/api/owner/expenses/${id}`);
    return response.data;
  },
  createExpense: async (data) => {
    const response = await api.post("/api/owner/expenses", data);
    return response.data;
  },
  updateExpense: async (id, data) => {
    const response = await api.put(`/api/owner/expenses/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id) => {
    const response = await api.delete(`/api/owner/expenses/${id}`);
    return response.data;
  },
  getOmzet: async (params) => {
    const response = await api.get("/api/owner/analytics/omzet", { params });
    return response.data;
  },
  getNetProfit: async (params) => {
    const response = await api.get("/api/owner/analytics/net-profit", { params });
    return response.data;
  },
  getCashFlow: async (params) => {
    const response = await api.get("/api/owner/analytics/cash-flow", { params });
    return response.data;
  },
  getExpenseAnalysis: async (params) => {
    const response = await api.get("/api/owner/analytics/cost-analysis", { params });
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get("/api/owner/employee/users");
    return response.data;
  },
  getAllAdmins: async () => {
    const response = await api.get("/api/owner/employee/admins");
    return response.data;
  },
  promoteUser: async (email) => {
    const response = await api.patch("/api/owner/employee/promote", { email });
    return response.data;
  },
  demoteAdmin: async (email) => {
    const response = await api.patch("/api/owner/employee/demote", { email });
    return response.data;
  },
};

export default ownerService;
