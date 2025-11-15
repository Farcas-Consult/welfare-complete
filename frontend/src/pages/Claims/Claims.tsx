import React from 'react';
import { Box, Typography } from '@mui/material';

const Claims = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Claims Management</Typography>
    <Typography variant="body1" color="text.secondary">
      List of all claims with status filtering (draft, under review, approved, disbursed).
    </Typography>
  </Box>
);

export default Claims;
