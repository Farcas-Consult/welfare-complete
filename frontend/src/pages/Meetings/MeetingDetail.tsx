import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { meetingsService, UpdateMeetingDto } from '../../services/meetingsService';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

const MeetingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: meeting, isLoading } = useQuery(
    ['meeting', id],
    () => meetingsService.getById(id!),
    {
      enabled: !!id,
    }
  );

  const updateMutation = useMutation(
    (data: UpdateMeetingDto) => meetingsService.update(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['meeting', id]);
        enqueueSnackbar('Meeting updated successfully', { variant: 'success' });
        setEditDialogOpen(false);
        setIsEditMode(false);
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to update meeting', { variant: 'error' });
      },
    }
  );

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateMeetingDto>({
    defaultValues: meeting?.data || {},
  });

  const onSubmitEdit = (data: UpdateMeetingDto) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!meeting?.data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error">
          Meeting not found
        </Typography>
      </Box>
    );
  }

  const meetingData = meeting.data;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/meetings')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Meeting Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setEditDialogOpen(true)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {meetingData.title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {meetingData.meetingDate || meetingData.date
                    ? format(new Date(meetingData.meetingDate || meetingData.date), 'EEEE, MMMM dd, yyyy HH:mm')
                    : 'N/A'}
                </Typography>
                {meetingData.location && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Location
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {meetingData.location}
                    </Typography>
                  </>
                )}
                {meetingData.type && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Type
                    </Typography>
                    <Chip label={meetingData.type} sx={{ mt: 1 }} />
                  </>
                )}
                {meetingData.agenda && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Agenda
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {meetingData.agenda}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Meeting Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Scheduled
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {meetingData.createdAt
                    ? format(new Date(meetingData.createdAt), 'MMM dd, yyyy')
                    : 'N/A'}
                </Typography>
                {meetingData.attendees && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Attendees
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {Array.isArray(meetingData.attendees)
                        ? meetingData.attendees.length
                        : meetingData.attendeeCount || 0}{' '}
                      attendees
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Meeting</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmitEdit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              {...register('title', { required: true })}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mt: 1 }}
            />
            <TextField
              fullWidth
              label="Location"
              {...register('location')}
              error={!!errors.location}
              helperText={errors.location?.message}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Agenda"
              multiline
              rows={4}
              {...register('agenda')}
              error={!!errors.agenda}
              helperText={errors.agenda?.message}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? <CircularProgress size={20} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MeetingDetail;
