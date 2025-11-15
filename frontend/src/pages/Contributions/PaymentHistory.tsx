import React from 'react';
import { Box, Typography } from '@mui/material';

const PaymentHistory = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Payment History</Typography>
    <Typography variant="body1" color="text.secondary">
      Detailed list of all payments made by all members.
    </Typography>
  </Box>
);

export default PaymentHistory;
