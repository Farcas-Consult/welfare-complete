import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from 'react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { meetingsService, CreateMeetingDto } from '../../services/meetingsService';
import { membersService } from '../../services/membersService';
import { format } from 'date-fns';

const schema: yup.ObjectSchema<CreateMeetingDto> = yup.object({
  title: yup.string().required('Title is required'),
  date: yup.string().required('Date is required'),
  time: yup.string().optional(),
  location: yup.string().optional(),
  type: yup.string().optional(),
  agenda: yup.string().optional(),
  attendeeIds: yup.array().of(yup.string()).optional(),
}) as yup.ObjectSchema<CreateMeetingDto>;

const ScheduleMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  const { data: membersData } = useQuery('members', () => membersService.getAll({ limit: 1000 }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMeetingDto>({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation(
    (data: CreateMeetingDto) => meetingsService.create(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Meeting scheduled successfully', { variant: 'success' });
        navigate('/meetings');
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to schedule meeting',
          { variant: 'error' }
        );
      },
    }
  );

  const onSubmit = async (data: CreateMeetingDto) => {
    setIsSubmitting(true);
    try {
      const meetingData = {
        ...data,
        attendeeIds: selectedAttendees,
      };
      await mutation.mutateAsync(meetingData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Backend returns: { message: "...", data: { members: [...], pagination: {...} } }
  const membersResponseData = (membersData?.data as any)?.data || membersData?.data || {};
  const members = Array.isArray(membersResponseData.members) 
    ? membersResponseData.members 
    : (Array.isArray(membersResponseData) ? membersResponseData : []);

  const handleAttendeeToggle = (memberId: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Schedule Meeting
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Meeting Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Date & Time"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.date,
                          helperText: errors.date?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                {...register('location')}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Meeting Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Meeting Type">
                      <MenuItem value="general">General Meeting</MenuItem>
                      <MenuItem value="committee">Committee Meeting</MenuItem>
                      <MenuItem value="annual">Annual Meeting</MenuItem>
                      <MenuItem value="special">Special Meeting</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agenda"
                multiline
                rows={4}
                {...register('agenda')}
                error={!!errors.agenda}
                helperText={errors.agenda?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Select Attendees (Optional)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                {members.map((member: any) => (
                  <Chip
                    key={member.id}
                    label={`${member.firstName} ${member.lastName}`}
                    onClick={() => handleAttendeeToggle(member.id)}
                    color={selectedAttendees.includes(member.id) ? 'primary' : 'default'}
                    variant={selectedAttendees.includes(member.id) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/meetings')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || mutation.isLoading}
            >
              {isSubmitting || mutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Schedule Meeting'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ScheduleMeeting;
