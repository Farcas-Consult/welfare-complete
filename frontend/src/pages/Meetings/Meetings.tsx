import React from 'react';
import { Box, Typography } from '@mui/material';

const Meetings = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Meetings Calendar</Typography>
    <Typography variant="body1" color="text.secondary">
      View scheduled, in-progress, and completed meetings.
    </Typography>
  </Box>
);

export default Meetings;
