import React from 'react';
import { Box, Typography } from '@mui/material';

const MakePayment = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Make Payment</Typography>
    <Typography variant="body1" color="text.secondary">
      Interface for initiating manual payments or generating payment links.
    </Typography>
  </Box>
);

export default MakePayment;
