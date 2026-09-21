import { api } from './api';

export const forecastService = {
  /**
   * Mengambil daftar hasil peramalan untuk semua produk aktif.
   * @param {boolean} forceRefresh - Paksa hitung ulang tanpa menggunakan cache 6 jam
   */
  async getForecasts(forceRefresh = false) {
    const url = `/api/forecasts/${forceRefresh ? '?force_refresh=true' : ''}`;
    return await api.get(url);
  },

  /**
   * Mengambil hasil peramalan spesifik untuk satu produk.
   * @param {number|string} productId - ID unik produk
   * @param {boolean} forceRefresh - Paksa hitung ulang tanpa menggunakan cache 6 jam
   */
  async getProductForecast(productId, forceRefresh = false) {
    const url = `/api/forecasts/?product_id=${productId}${forceRefresh ? '&force_refresh=true' : ''}`;
    return await api.get(url);
  },
};
