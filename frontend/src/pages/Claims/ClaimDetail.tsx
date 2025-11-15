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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { claimsService, ApproveClaimDto } from '../../services/claimsService';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

const ClaimDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const { data: claim, isLoading } = useQuery(
    ['claim', id],
    () => claimsService.getById(id!),
    {
      enabled: !!id,
    }
  );

  const approveMutation = useMutation(
    (data?: ApproveClaimDto) => claimsService.approve(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['claim', id]);
        enqueueSnackbar('Claim approved successfully', { variant: 'success' });
        setApproveDialogOpen(false);
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to approve claim', { variant: 'error' });
      },
    }
  );

  const { register, handleSubmit, formState: { errors } } = useForm<ApproveClaimDto>();

  const onSubmitApprove = (data: ApproveClaimDto) => {
    approveMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'disbursed':
        return 'success';
      case 'under_review':
      case 'under review':
        return 'warning';
      case 'rejected':
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = ['Draft', 'Under Review', 'Approved', 'Disbursed'];
    const currentIndex = steps.findIndex((s) => s.toLowerCase() === status?.toLowerCase());
    return { steps, activeStep: currentIndex >= 0 ? currentIndex : 0 };
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!claim?.data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error">
          Claim not found
        </Typography>
      </Box>
    );
  }

  const claimData = claim.data;
  const { steps, activeStep } = getStatusSteps(claimData.status || 'draft');

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/claims')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Claim Details
        </Typography>
        {claimData.status !== 'approved' && claimData.status !== 'disbursed' && (
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => setApproveDialogOpen(true)}
          >
            Approve Claim
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    label={claimData.status || 'draft'}
                    color={getStatusColor(claimData.status || 'draft')}
                    size="medium"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Claim Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Claim ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  #{claimData.id?.slice(0, 8) || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Claim Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {claimData.claimType || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Amount
                </Typography>
                <Typography variant="h6" gutterBottom>
                  KES {claimData.amount?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Description
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {claimData.description || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Member Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {claimData.member?.firstName} {claimData.member?.lastName || claimData.memberName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Member Number
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {claimData.member?.memberNo || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Submitted
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {claimData.createdAt
                    ? format(new Date(claimData.createdAt), 'MMM dd, yyyy HH:mm')
                    : 'N/A'}
                </Typography>
                {claimData.updatedAt && claimData.updatedAt !== claimData.createdAt && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(new Date(claimData.updatedAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Claim</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmitApprove)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Approved Amount (KES)"
              type="number"
              {...register('approvedAmount', { valueAsNumber: true })}
              error={!!errors.approvedAmount}
              helperText={errors.approvedAmount?.message || 'Leave empty to approve full amount'}
              sx={{ mt: 1 }}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              {...register('notes')}
              error={!!errors.notes}
              helperText={errors.notes?.message}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={approveMutation.isLoading}
            >
              {approveMutation.isLoading ? <CircularProgress size={20} /> : 'Approve'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ClaimDetail;
