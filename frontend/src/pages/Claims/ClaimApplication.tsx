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
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { membersService } from '../../services/membersService';
import { claimsService, CreateClaimDto } from '../../services/claimsService';

const schema = yup.object({
  memberId: yup.string().required('Member selection is required'),
  claimType: yup.string().required('Claim type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  description: yup.string(),
});

const ClaimApplication: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { data: membersData } = useQuery('members', () => membersService.getAll({ limit: 1000 }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateClaimDto>({
    resolver: yupResolver(schema),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
  });

  const mutation = useMutation(
    (data: CreateClaimDto) => claimsService.create(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Claim submitted successfully', { variant: 'success' });
        navigate('/claims');
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to submit claim',
          { variant: 'error' }
        );
      },
    }
  );

  const onSubmit = async (data: CreateClaimDto) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, you would upload files first and get URLs
      const claimData = {
        ...data,
        supportingDocuments: files.map((f) => f.name), // Placeholder - should be file URLs
      };
      await mutation.mutateAsync(claimData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Backend returns: { message: "...", data: { members: [...], pagination: {...} } }
  const membersResponseData = (membersData?.data as any)?.data || membersData?.data || {};
  const members = Array.isArray(membersResponseData.members) 
    ? membersResponseData.members 
    : (Array.isArray(membersResponseData) ? membersResponseData : []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Submit New Claim
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.memberId}>
                <InputLabel>Member</InputLabel>
                <Controller
                  name="memberId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Member">
                      {members.map((member: any) => (
                        <MenuItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName} ({member.memberNo || member.id})
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              {errors.memberId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.memberId.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.claimType}>
                <InputLabel>Claim Type</InputLabel>
                <Controller
                  name="claimType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Claim Type">
                      <MenuItem value="medical">Medical</MenuItem>
                      <MenuItem value="funeral">Funeral</MenuItem>
                      <MenuItem value="education">Education</MenuItem>
                      <MenuItem value="emergency">Emergency</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              {errors.claimType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.claimType.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Amount (KES)"
                type="number"
                {...register('amount', { valueAsNumber: true })}
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Supporting Documents
                </Typography>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography variant="body2" color="text.secondary">
                    {isDragActive
                      ? 'Drop files here...'
                      : 'Drag and drop files here, or click to select files'}
                  </Typography>
                </Box>
                {files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {files.map((file, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        {file.name}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/claims')}>
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
                'Submit Claim'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ClaimApplication;
