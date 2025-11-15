import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { meetingsService } from '../../services/meetingsService';
import { format } from 'date-fns';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Meetings: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const { data, isLoading, error } = useQuery(
    ['meetings', page, rowsPerPage, searchTerm],
    () =>
      meetingsService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
      }),
    {
      keepPreviousData: true,
    }
  );

  // Backend returns: { message: "...", data: { meetings: [...], pagination: {...} } }
  const responseData = (data?.data as any)?.data || data?.data || {};
  const meetings = Array.isArray(responseData.meetings) 
    ? responseData.meetings 
    : (Array.isArray(responseData) ? responseData : []);
  const totalCount = responseData.pagination?.total || responseData.total || meetings.length;

  const calendarEvents = meetings.map((meeting: any) => ({
    id: meeting.id,
    title: meeting.title,
    start: meeting.meetingDate || meeting.date ? new Date(meeting.meetingDate || meeting.date) : new Date(),
    end: meeting.meetingDate || meeting.date ? new Date(new Date(meeting.meetingDate || meeting.date).getTime() + 2 * 60 * 60 * 1000) : new Date(),
    resource: meeting.id,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Meetings Calendar</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/meetings/schedule')}
          >
            Schedule Meeting
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search meetings..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%', maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="error">Error loading meetings. Please try again.</Typography>
        </Paper>
      ) : viewMode === 'calendar' ? (
        <Paper sx={{ p: 2, height: 600 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={(event: any) => navigate(`/meetings/${event.resource || event.id}`)}
          />
        </Paper>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {meetings.slice(0, 3).map((meeting: any) => (
              <Grid item xs={12} sm={6} md={4} key={meeting.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {meeting.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {meeting.meetingDate || meeting.date
                          ? format(new Date(meeting.meetingDate || meeting.date), 'MMM dd, yyyy HH:mm')
                          : 'N/A'}
                      </Typography>
                    </Box>
                    {meeting.location && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Location: {meeting.location}
                      </Typography>
                    )}
                    {meeting.type && (
                      <Chip label={meeting.type} size="small" sx={{ mt: 1 }} />
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/meetings/${meeting.id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No meetings found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  meetings.map((meeting: any) => (
                    <TableRow key={meeting.id} hover>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>
                        {meeting.meetingDate || meeting.date
                          ? format(new Date(meeting.meetingDate || meeting.date), 'MMM dd, yyyy HH:mm')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{meeting.location || 'N/A'}</TableCell>
                      <TableCell>
                        {meeting.type ? (
                          <Chip label={meeting.type} size="small" />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/meetings/${meeting.id}`)}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}
    </Box>
  );
};

export default Meetings;
