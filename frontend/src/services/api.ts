import axios from 'axios';
import { store } from '../store/store';
import { setTokens, logout, setUserProfile } from '../store/slices/authSlice';
import { authService } from './authService';

const API_URL = 'http://3.6.115.190:3001';

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

      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          const response = await authService.refreshToken({ refreshToken });
          // Handle both wrapped and unwrapped response structures
          const responseData: any = (response.data as any)?.data || response.data;
          const { accessToken, refreshToken: newRefreshToken, user } = responseData;

          if (accessToken && newRefreshToken) {
            store.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));
            if (user) {
              store.dispatch(setUserProfile({
                id: user.id || '',
                email: user.email || '',
                role: (user.role || 'member') as 'member' | 'treasurer' | 'secretary' | 'committee' | 'admin' | 'auditor',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                memberNo: user.memberNo || '',
              }));
            }
          }

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          // No refresh token, logout user
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
