import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "@/store/store";
import { setTokens, logout, setUserProfile } from "@/store/slices/authSlice";
import { authService } from "@/app/auth/services/authService";
import { AuthResponse } from "@/app/auth/types/auth-types";

// Get API URL from environment variable or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://3.6.115.190:3001";

const AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
AxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check for 401 Unauthorized (typical token expiry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          const response = await authService.refreshToken({ refreshToken });
          // API response structure: { statusCode, message, data: { accessToken, refreshToken, user } }
          const responseData = (
            response as unknown as {
              statusCode?: number;
              message?: string;
              data?: AuthResponse;
            }
          ).data;

          if (!responseData) {
            throw new Error("Invalid refresh token response");
          }

          const {
            accessToken,
            refreshToken: newRefreshToken,
            user,
          } = responseData;

          if (accessToken && newRefreshToken) {
            store.dispatch(
              setTokens({ accessToken, refreshToken: newRefreshToken })
            );
            if (user) {
              store.dispatch(
                setUserProfile({
                  id: user.id || "",
                  email: user.email || "",
                  role: (user.role || "member") as
                    | "member"
                    | "treasurer"
                    | "secretary"
                    | "committee"
                    | "admin"
                    | "auditor",
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  memberNo: user.memberNo || "",
                })
              );
            }
          }

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return AxiosInstance(originalRequest);
        } else {
          // No refresh token, logout user
          store.dispatch(logout());
          // COMMENTED OUT - This causes full page reload
          // if (typeof window !== "undefined") {
          //   window.location.href = "/auth/login";
          // }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        // COMMENTED OUT - This causes full page reload
        // if (typeof window !== "undefined") {
        //   window.location.href = "/auth/login";
        // }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiErrorDetails {
  [key: string]: unknown;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: ApiErrorDetails;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: ApiErrorDetails
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }
}

export default AxiosInstance;
