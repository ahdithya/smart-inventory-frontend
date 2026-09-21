import { api } from './api';

export const settingsService = {
  /**
   * Mengambil data profil bisnis UMKM saat ini.
   */
  async getBusinessProfile() {
    return await api.get('/api/business-profile/');
  },

  /**
   * Memperbarui profil bisnis UMKM (Khusus Owner).
   * @param {Object} payload - { business_name, business_type, address, phone }
   */
  async updateBusinessProfile(payload) {
    return await api.put('/api/business-profile/', payload);
  },

  /**
   * Mengambil daftar seluruh user toko (Khusus Owner).
   */
  async getUsers() {
    const res = await api.get('/api/users/');
    return res?.users || res || [];
  },

  /**
   * Mendaftarkan staf / user baru (Khusus Owner).
   * @param {Object} payload - { username, email, password, role }
   */
  async createUser(payload) {
    return await api.post('/api/users/', payload);
  },

  /**
   * Memperbarui role dan/atau status aktif user (Khusus Owner).
   * @param {number|string} userId
   * @param {Object} payload - { role?: 'owner'|'staff', is_active?: boolean }
   */
  async updateUser(userId, payload) {
    return await api.patch(`/api/users/${userId}/role/`, payload);
  },
};
