import axios from 'axios';
import { store } from '../store/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized (typical token expiry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // In a functional application, this is where you'd dispatch a refresh token action
      // to automatically get a new access token and retry the original request.
      console.warn('Access token expired. Attempting refresh token flow (logic placeholder).');
    }

    return Promise.reject(error);
  }
);

export default api;
