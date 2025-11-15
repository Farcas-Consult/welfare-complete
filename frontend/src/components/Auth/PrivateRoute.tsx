import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { setUserProfile, logout, setTokens } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, status, accessToken, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // If we have a token but no user profile, fetch it
  const shouldFetchProfile = !!accessToken && !user && status === 'succeeded';

  const { isLoading: isCheckingProfile } = useQuery(
    'auth-profile-check',
    () => authService.getProfile(),
    {
      enabled: shouldFetchProfile,
      retry: false,
      onSuccess: (response) => {
        const userData = response.data?.data || response.data;
        if (userData) {
          dispatch(setUserProfile({
            id: userData.id || '',
            email: userData.email || '',
            role: (userData.role || 'member') as 'member' | 'treasurer' | 'secretary' | 'committee' | 'admin' | 'auditor',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            memberNo: userData.memberNo || '',
          }));
        }
      },
      onError: () => {
        // Token is invalid, logout
        dispatch(logout());
      },
    }
  );

  // Show loading only if we're actively checking the profile
  if (isCheckingProfile) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking session...
        </Typography>
      </Box>
    );
  }

  // If authenticated (has token and optionally user profile), allow access
  if (isAuthenticated) {
    return <Outlet />;
  }

  // No token or not authenticated, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
