const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  constructor(message, code, fields = {}, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fields = fields;
    this.status = status;
  }
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const accessToken = localStorage.getItem('access_token');
  if (accessToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new ApiError('Gagal terhubung ke server. Periksa koneksi backend Anda.', 'NETWORK_ERROR', {}, 0);
  }

  // Handle 401 Unauthorized (Token expired)
  if (response.status === 401 && !options.isRetry && !options.skipAuth) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.dispatchEvent(new Event('auth:unauthorized'));
      throw new ApiError('Sesi berakhir. Silakan masuk kembali.', 'UNAUTHORIZED', {}, 401);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        const refreshData = await refreshRes.json();
        if (refreshRes.ok && refreshData.data?.access) {
          const newAccess = refreshData.data.access;
          localStorage.setItem('access_token', newAccess);
          isRefreshing = false;
          onRefreshed(newAccess);
        } else {
          throw new Error('Refresh failed');
        }
      } catch {
        isRefreshing = false;
        refreshSubscribers = [];
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
        throw new ApiError('Sesi berakhir. Silakan masuk kembali.', 'UNAUTHORIZED', {}, 401);
      }
    }

    // Wait for ongoing refresh
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((newToken) => {
        config.headers['Authorization'] = `Bearer ${newToken}`;
        config.isRetry = true;
        fetch(url, config)
          .then((res) => parseResponse(res))
          .then(resolve)
          .catch(reject);
      });
    });
  }

  return parseResponse(response);
}

async function parseResponse(response) {
  let json;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(`Terjadi kesalahan server (${response.status})`, 'SERVER_ERROR', {}, response.status);
    }
    return null;
  }

  // Contract envelope check
  if (!response.ok || json.status === 'error') {
    const message = json.message || 'Terjadi kesalahan pada permintaan.';
    const code = json.code || 'API_ERROR';
    const fields = json.fields || {};
    throw new ApiError(message, code, fields, response.status);
  }

  // Return payload in data property or fallback to whole json
  return json.data !== undefined ? json.data : json;
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body }),
  patch: (url, body, options) => request(url, { ...options, method: 'PATCH', body }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};

export { ApiError };
