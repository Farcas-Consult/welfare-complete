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
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { membersService } from '../../services/membersService';
import { loansService, CreateLoanDto } from '../../services/loansService';

const schema = yup.object({
  memberId: yup.string().required('Member selection is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  purpose: yup.string(),
  repaymentPeriod: yup.number().positive('Repayment period must be positive'),
  interestRate: yup.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate cannot exceed 100%'),
});

const LoanApplication: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedMonthlyPayment, setCalculatedMonthlyPayment] = useState<number | null>(null);

  const { data: membersData } = useQuery('members', () => membersService.getAll({ limit: 1000 }));

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateLoanDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      interestRate: 5,
      repaymentPeriod: 12,
    },
  });

  const amount = watch('amount');
  const interestRate = watch('interestRate') || 5;
  const repaymentPeriod = watch('repaymentPeriod') || 12;

  React.useEffect(() => {
    if (amount && interestRate && repaymentPeriod) {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, repaymentPeriod)) /
        (Math.pow(1 + monthlyRate, repaymentPeriod) - 1);
      setCalculatedMonthlyPayment(monthlyPayment);
    } else {
      setCalculatedMonthlyPayment(null);
    }
  }, [amount, interestRate, repaymentPeriod]);

  const mutation = useMutation(
    (data: CreateLoanDto) => loansService.create(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Loan application submitted successfully', { variant: 'success' });
        navigate('/loans');
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to submit loan application',
          { variant: 'error' }
        );
      },
    }
  );

  const onSubmit = async (data: CreateLoanDto) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
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
        Apply for Loan
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
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
                  <TextField
                    required
                    fullWidth
                    label="Loan Amount (KES)"
                    type="number"
                    {...register('amount', { valueAsNumber: true })}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Interest Rate (%)"
                    type="number"
                    {...register('interestRate', { valueAsNumber: true })}
                    error={!!errors.interestRate}
                    helperText={errors.interestRate?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Repayment Period (Months)"
                    type="number"
                    {...register('repaymentPeriod', { valueAsNumber: true })}
                    error={!!errors.repaymentPeriod}
                    helperText={errors.repaymentPeriod?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Purpose"
                    multiline
                    rows={3}
                    {...register('purpose')}
                    error={!!errors.purpose}
                    helperText={errors.purpose?.message}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/loans')}>
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
                    'Submit Application'
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Calculator
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {calculatedMonthlyPayment ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Payment
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    KES {calculatedMonthlyPayment.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Total Amount
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    KES {(
                      calculatedMonthlyPayment * (repaymentPeriod || 12)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Total Interest
                  </Typography>
                  <Typography variant="body1">
                    KES {(
                      calculatedMonthlyPayment * (repaymentPeriod || 12) - (amount || 0)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Enter loan details to see calculation
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanApplication;
