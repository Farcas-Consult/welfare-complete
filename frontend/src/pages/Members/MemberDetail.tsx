import React from 'react';
import { Box, Typography } from '@mui/material';

const MemberDetail = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Member Detail</Typography>
    <Typography variant="body1" color="text.secondary">
      Displays profile, contributions, claims, and loan history for a specific member.
    </Typography>
  </Box>
);

export default MemberDetail;
