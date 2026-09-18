import { api } from './api';

export const stockService = {
  async getStockList(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.status) query.append('status', params.status);
    if (params.is_active !== undefined) query.append('is_active', params.is_active);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await api.get(`/api/stock/${qs}`);
    return res?.stock || res || [];
  },

  async getStockMovements(params = {}) {
    const query = new URLSearchParams();
    if (params.product) query.append('product', params.product);
    if (params.type) query.append('type', params.type);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await api.get(`/api/stock-movements/${qs}`);
    return res?.stock_movements || res || [];
  },

  async createStockMovement(payload) {
    return await api.post('/api/stock-movements/', payload);
  },
};
