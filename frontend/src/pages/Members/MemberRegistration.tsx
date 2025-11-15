import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { membersService, CreateMemberDto } from '../../services/membersService';
import { format } from 'date-fns';

const schema: yup.ObjectSchema<CreateMemberDto> = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  middleName: yup.string().optional(),
  nationalId: yup.string().optional(),
  phonePrimary: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email address').optional(),
  dateOfBirth: yup.string().optional(),
  gender: yup.string().optional(),
  status: yup.string().oneOf(['active', 'inactive', 'suspended', 'deceased']).optional(),
  planId: yup.string().optional(),
  kycStatus: yup.boolean().optional(),
}) as yup.ObjectSchema<CreateMemberDto>;

const MemberRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMemberDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'active',
      kycStatus: false,
    },
  });

  const mutation = useMutation(
    (data: CreateMemberDto) => membersService.create(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Member registered successfully', { variant: 'success' });
        navigate('/members');
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to register member',
          { variant: 'error' }
        );
      },
    }
  );

  const onSubmit = async (data: CreateMemberDto) => {
    setIsSubmitting(true);
    try {
      // Remove empty strings for optional UUID fields to avoid backend errors
      const cleanedData: CreateMemberDto = {
        ...data,
        planId: data.planId && data.planId.trim() !== '' ? data.planId : undefined,
      };
      await mutation.mutateAsync(cleanedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Register New Member
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Middle Name"
                {...register('middleName')}
                error={!!errors.middleName}
                helperText={errors.middleName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="National ID"
                {...register('nationalId')}
                error={!!errors.nationalId}
                helperText={errors.nationalId?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                {...register('phonePrimary')}
                error={!!errors.phonePrimary}
                helperText={errors.phonePrimary?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date of Birth"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dateOfBirth,
                          helperText: errors.dateOfBirth?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  {...register('gender')}
                  defaultValue=""
                  error={!!errors.gender}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  {...register('status')}
                  defaultValue="active"
                  error={!!errors.status}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="deceased">Deceased</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plan ID (Optional)"
                {...register('planId')}
                error={!!errors.planId}
                helperText={errors.planId?.message || 'Leave empty if not applicable'}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/members')}>
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
                'Register Member'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MemberRegistration;
