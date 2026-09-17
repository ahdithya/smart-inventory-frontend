import { api } from './api';

export const authService = {
  async login(credentials) {
    const data = await api.post('/api/auth/login/', credentials, { skipAuth: true });
    if (data?.access) {
      localStorage.setItem('access_token', data.access);
    }
    if (data?.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    return data;
  },

  async register(registrationData) {
    const data = await api.post('/api/auth/register/', registrationData, { skipAuth: true });
    if (data?.access) {
      localStorage.setItem('access_token', data.access);
    }
    if (data?.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    return data;
  },

  async getMe() {
    return await api.get('/api/auth/me/');
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
