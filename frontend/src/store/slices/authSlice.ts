import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  email: string;
  role: 'member' | 'treasurer' | 'secretary' | 'committee' | 'admin' | 'auditor';
  firstName: string;
  lastName: string;
  memberNo: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const getInitialState = (): AuthState => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  return {
    isAuthenticated: !!(accessToken && refreshToken),
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    user: null,
    status: !!(accessToken && refreshToken) ? 'succeeded' : 'idle',
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) {
      state.status = 'loading';
    },
    setTokens(state, action: PayloadAction<{ accessToken: string, refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setError(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { setLoading, setTokens, setUserProfile, logout, setError } = authSlice.actions;

export default authSlice.reducer;
