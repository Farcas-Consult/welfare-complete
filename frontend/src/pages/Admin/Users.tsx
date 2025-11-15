import React from 'react';
import { Box, Typography } from '@mui/material';

const Users = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">User & Role Management</Typography>
    <Typography variant="body1" color="text.secondary">
      Manage system users and assign roles (admin, treasurer, etc.).
    </Typography>
  </Box>
);

export default Users;
