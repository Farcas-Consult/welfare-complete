import React from 'react';
import { Box, Typography } from '@mui/material';

const AuditLogs = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Audit Logs</Typography>
    <Typography variant="body1" color="text.secondary">
      Review chronological records of all significant system events and user actions.
    </Typography>
  </Box>
);

export default AuditLogs;
