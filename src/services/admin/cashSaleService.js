import api from "../../utils/api";

const cashSaleService = {
  getCashSales: async (params = {}) => {
    const response = await api.get("/api/cash-sales", { params });
    return response.data;
  },

  getCashSaleByNumber: async (saleNumber) => {
    const response = await api.get(`/api/cash-sales/${encodeURIComponent(saleNumber)}`);
    return response.data;
  },
};

export default cashSaleService;
