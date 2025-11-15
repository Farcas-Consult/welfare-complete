import React from 'react';
import { Box, Typography } from '@mui/material';

const LoanApplication = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Loan Application</Typography>
    <Typography variant="body1" color="text.secondary">
      Form for submitting a new loan application and selecting guarantors.
    </Typography>
  </Box>
);

export default LoanApplication;
