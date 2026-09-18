import { api } from './api';

export const categoryService = {
  async getCategories() {
    const res = await api.get('/api/categories/');
    return res?.categories || res || [];
  },

  async getCategory(id) {
    return await api.get(`/api/categories/${id}/`);
  },

  async createCategory(payload) {
    return await api.post('/api/categories/', payload);
  },

  async updateCategory(id, payload) {
    return await api.put(`/api/categories/${id}/`, payload);
  },

  async deleteCategory(id) {
    return await api.delete(`/api/categories/${id}/`);
  },
};
