import { api } from './api';

export const saleService = {
  async getSales(params = {}) {
    const query = new URLSearchParams();
    if (params.start_date) query.append('start_date', params.start_date);
    if (params.end_date) query.append('end_date', params.end_date);
    if (params.user) query.append('user', params.user);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await api.get(`/api/sales/${qs}`);
    return res?.sales || res || [];
  },

  async getSale(id) {
    return await api.get(`/api/sales/${id}/`);
  },

  async createSale(payload) {
    return await api.post('/api/sales/', payload);
  },
};
