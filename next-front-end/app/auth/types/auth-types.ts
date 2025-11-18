export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  phonePrimary: string;
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

export interface UserProfile {
  id: string;
  email: string;
  role:
    | "member"
    | "treasurer"
    | "secretary"
    | "committee"
    | "admin"
    | "auditor";
  firstName: string;
  lastName: string;
  memberNo: string;
}
