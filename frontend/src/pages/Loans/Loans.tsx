import React from 'react';
import { Box, Typography } from '@mui/material';

const Loans = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Loans Overview</Typography>
    <Typography variant="body1" color="text.secondary">
      Summary of all active loans, defaults, and loan products.
    </Typography>
  </Box>
);

export default Loans;
