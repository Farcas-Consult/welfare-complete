import React from 'react';
import { Box, Typography } from '@mui/material';

const LoanDetail = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Loan Detail & Repayments</Typography>
    <Typography variant="body1" color="text.secondary">
      Tracks loan status, repayment schedule, and outstanding balance.
    </Typography>
  </Box>
);

export default LoanDetail;
