import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data),
  updatePassword: (data) => API.put('/auth/password', data),
  getMe: () => API.get('/auth/me'),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  getUserDetails: (id) => API.get(`/admin/users/${id}`),
  createUser: (data) => API.post('/admin/users', data),
  getStores: (params) => API.get('/admin/stores', { params }),
  createStore: (data) => API.post('/admin/stores', data),
};

export const storeAPI = {
  getStores: (params) => API.get('/stores', { params }),
  submitRating: (storeId, data) => API.post(`/stores/${storeId}/rating`, data),
};

export const storeOwnerAPI = {
  getDashboard: () => API.get('/store-owner/dashboard'),
};

export default API;
