import React from 'react';
import { Box, Typography } from '@mui/material';

const ScheduleMeeting = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Schedule New Meeting</Typography>
    <Typography variant="body1" color="text.secondary">
      Form to set up a new in-person or virtual meeting.
    </Typography>
  </Box>
);

export default ScheduleMeeting;
