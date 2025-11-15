import React from 'react';
import { Box, Typography } from '@mui/material';

const Reports = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Financial & Operational Reports</Typography>
    <Typography variant="body1" color="text.secondary">
      Interface for generating PDF/Excel reports (e.g., contribution summary, loan aging).
    </Typography>
  </Box>
);

export default Reports;
