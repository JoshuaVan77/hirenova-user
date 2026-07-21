import axios from 'axios';

// ✅ 1. Dynamic API Base URL (Production Ready)
const BASE_URL = import.meta.env.VITE_API_URL || 'https://hirenova-backend-production-32b1.up.railway.app';
const API_BASE_URL = `${BASE_URL}/api`; // ✅ /api prefix ထည့်ထားသည်

// ✅ 2. Axios Instance န်တီးခြင်း
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 3. Request Interceptor (Token ထည့်သွင်းရန်)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ 4. Response Interceptor (Error Handle လုပ်ရန်)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token သက်တမ်းကုန်ရင် Logout လုပ်မယ်
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ 5. Auth API Functions
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ✅ 6. Export default api instance
export default api;