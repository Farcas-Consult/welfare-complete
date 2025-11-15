import React from 'react';
import { Box, Typography } from '@mui/material';

const Members = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Member Management</Typography>
    <Typography variant="body1" color="text.secondary">
      List of all active, inactive, and suspended members.
    </Typography>
  </Box>
);

export default Members;
