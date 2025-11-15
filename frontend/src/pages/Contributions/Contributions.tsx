import React from 'react';
import { Box, Typography } from '@mui/material';

const Contributions = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Contributions Overview</Typography>
    <Typography variant="body1" color="text.secondary">
      Summary of monthly collections and outstanding invoices.
    </Typography>
  </Box>
);

export default Contributions;
