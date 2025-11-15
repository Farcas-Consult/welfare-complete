import React from 'react';
import { Box, Typography } from '@mui/material';

const Settings = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">System Settings</Typography>
    <Typography variant="body1" color="text.secondary">
      Configure global parameters (e.g., plan fees, email credentials, API keys).
    </Typography>
  </Box>
);

export default Settings;
