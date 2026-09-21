import { api } from './api';

export const restockService = {
  /**
   * Mengambil daftar rekomendasi restock untuk seluruh produk atau filter tertentu.
   * @param {Object} params - { status: 'critical'|'warning'|'ok', product_id: number }
   */
  async getRecommendations(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') {
      query.append('status', params.status);
    }
    if (params.product_id) {
      query.append('product_id', params.product_id);
    }

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await api.get(`/api/restock-recommendations/${qs}`);
    return res?.recommendations || res || [];
  },
};
