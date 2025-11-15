import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Box, CircularProgress, Typography } from '@mui/material';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);

  if (status === 'loading' || status === 'idle') {
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

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
