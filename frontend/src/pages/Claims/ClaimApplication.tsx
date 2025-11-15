import React from 'react';
import { Box, Typography } from '@mui/material';

const ClaimApplication = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">New Claim Application</Typography>
    <Typography variant="body1" color="text.secondary">
      Form for submitting a new claim (e.g., bereavement, medical, emergency).
    </Typography>
  </Box>
);

export default ClaimApplication;
