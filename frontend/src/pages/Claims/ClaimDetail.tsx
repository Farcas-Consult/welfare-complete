import React from 'react';
import { Box, Typography } from '@mui/material';

const ClaimDetail = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Claim Detail & Approval Workflow</Typography>
    <Typography variant="body1" color="text.secondary">
      View claim details and manage the multi-level approval process.
    </Typography>
  </Box>
);

export default ClaimDetail;
