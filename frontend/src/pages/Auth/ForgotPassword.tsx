import React from 'react';
import { Box, Typography } from '@mui/material';

const ForgotPassword = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4">Forgot Password</Typography>
    <Typography variant="body1" color="text.secondary">
      Form to request password reset goes here.
    </Typography>
  </Box>
);

export default ForgotPassword;
