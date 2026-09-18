import { api } from './api';

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.is_active !== undefined) query.append('is_active', params.is_active);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await api.get(`/api/products/${qs}`);
    return res?.products || res || [];
  },

  async getProduct(id) {
    return await api.get(`/api/products/${id}/`);
  },

  async createProduct(payload) {
    return await api.post('/api/products/', payload);
  },

  async updateProduct(id, payload) {
    return await api.put(`/api/products/${id}/`, payload);
  },

  async deleteProduct(id) {
    return await api.delete(`/api/products/${id}/`);
  },
};
