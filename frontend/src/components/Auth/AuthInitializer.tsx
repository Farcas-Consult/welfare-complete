import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { setUserProfile, logout, setError } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery(
    'auth-profile',
    () => authService.getProfile(),
    {
      enabled: !!localStorage.getItem('accessToken'),
      retry: false,
      onError: () => {
        // If profile fetch fails, token is invalid - logout
        dispatch(logout());
      },
    }
  );

  useEffect(() => {
    if (data?.data) {
      const user = data.data;
      dispatch(setUserProfile({
        id: user.id,
        email: user.email,
        role: user.role as 'member' | 'treasurer' | 'secretary' | 'committee' | 'admin' | 'auditor',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        memberNo: user.memberNo || '',
      }));
    }
  }, [data, dispatch]);

  return null;
};

export default AuthInitializer;

