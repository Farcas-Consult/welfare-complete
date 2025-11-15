import React from 'react';
import { Box, Typography } from '@mui/material';

const MeetingDetail = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Meeting Minutes & Attendance</Typography>
    <Typography variant="body1" color="text.secondary">
      Details, agenda, attendance records, and minutes for a meeting.
    </Typography>
  </Box>
);

export default MeetingDetail;
