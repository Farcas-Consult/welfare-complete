import { fetchData, postData } from "@/lib/api/httpClient";
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse,
} from "../types/auth-types";
import { ApiResponse } from "@/types/api-response";

export const authService = {
  login: (data: LoginDto) =>
    postData<LoginDto, ApiResponse<AuthResponse>>("/auth/login", data),
  register: (data: RegisterDto) =>
    postData<RegisterDto, ApiResponse<AuthResponse>>("/auth/register", data),
  refreshToken: (data: RefreshTokenDto) =>
    postData<RefreshTokenDto, ApiResponse<AuthResponse>>("/auth/refresh", data),
  logout: () => postData<{}, { message: string }>("/auth/logout", {}),
  getProfile: () =>
    fetchData<ApiResponse<AuthResponse["user"]>>("/auth/profile"),
  changePassword: (data: ChangePasswordDto) =>
    postData<ChangePasswordDto, { message: string }>(
      "/auth/change-password",
      data
    ),
  forgotPassword: (data: ForgotPasswordDto) =>
    postData<ForgotPasswordDto, { message: string }>(
      "/auth/forgot-password",
      data
    ),
  resetPassword: (data: ResetPasswordDto) =>
    postData<ResetPasswordDto, { message: string }>(
      "/auth/reset-password",
      data
    ),
  sendVerificationEmail: () =>
    postData<{}, { message: string }>("/auth/verify-email", {}),
  verifyEmail: (token: string) =>
    fetchData<{ message: string }>(`/auth/verify-email/${token}`),
  checkUsername: (username: string) =>
    postData<{ username: string }, { available: boolean }>(
      "/auth/check-username",
      { username }
    ),
};
