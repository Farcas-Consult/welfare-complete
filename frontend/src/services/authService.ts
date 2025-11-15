import api from './api';

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    memberNo?: string;
  };
}

export const authService = {
  login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterDto) => api.post<AuthResponse>('/auth/register', data),
  refreshToken: (data: RefreshTokenDto) => api.post<AuthResponse>('/auth/refresh', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data: ChangePasswordDto) => api.post('/auth/change-password', data),
  forgotPassword: (data: ForgotPasswordDto) => api.post('/auth/forgot-password', data),
  resetPassword: (data: ResetPasswordDto) => api.post('/auth/reset-password', data),
  sendVerificationEmail: () => api.post('/auth/verify-email'),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
};

