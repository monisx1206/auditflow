import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('gc_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use((r) => r, (e) => {
  if (e.response?.status === 401 && !e.config.url.includes('/auth/login')) {
    localStorage.removeItem('gc_token');
    window.location.href = '/login';
  }
  return Promise.reject(e);
});

export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';
export default api;
