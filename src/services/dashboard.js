import { api } from './api';

export const dashboardService = {
  async getSummary() {
    return await api.get('/api/dashboard/summary/');
  },

  async getTrend(period = 'weekly') {
    return await api.get(`/api/dashboard/trend/?period=${period}`);
  },

  async getCriticalStock() {
    try {
      const [kritisRes, menipisRes] = await Promise.all([
        api.get('/api/stock/?status=kritis'),
        api.get('/api/stock/?status=menipis'),
      ]);

      const kritisList = (kritisRes?.stock || []).map((item) => ({
        ...item,
        status: 'kritis',
      }));

      const menipisList = (menipisRes?.stock || []).map((item) => ({
        ...item,
        status: 'menipis',
      }));

      return [...kritisList, ...menipisList];
    } catch {
      return [];
    }
  },
};
