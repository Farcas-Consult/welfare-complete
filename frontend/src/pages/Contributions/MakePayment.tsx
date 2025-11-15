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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { paymentsService, CreatePaymentDto } from '../../services/paymentsService';
import { membersService } from '../../services/membersService';
import { contributionsService } from '../../services/contributionsService';
import { format } from 'date-fns';

const schema = yup.object({
  memberId: yup.string(),
  invoiceId: yup.string(),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  referenceNumber: yup.string(),
  paymentDate: yup.string(),
  notes: yup.string(),
});

const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  const { data: membersData } = useQuery('members', () => membersService.getAll({ limit: 1000 }));
  const { data: invoicesData } = useQuery(
    ['invoices', selectedMemberId],
    () => contributionsService.getInvoices({ memberId: selectedMemberId }),
    {
      enabled: !!selectedMemberId,
    }
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePaymentDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const mutation = useMutation(
    (data: CreatePaymentDto) => paymentsService.create(data),
    {
      onSuccess: () => {
        enqueueSnackbar('Payment recorded successfully', { variant: 'success' });
        navigate('/contributions');
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to record payment',
          { variant: 'error' }
        );
      },
    }
  );

  const onSubmit = async (data: CreatePaymentDto) => {
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
  
  // Backend returns: { message: "...", data: { invoices: [...], pagination: {...} } }
  const invoicesResponseData = (invoicesData?.data as any)?.data || invoicesData?.data || {};
  const invoices = Array.isArray(invoicesResponseData.invoices) 
    ? invoicesResponseData.invoices 
    : (Array.isArray(invoicesResponseData) ? invoicesResponseData : []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Make Payment
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Member (Optional)</InputLabel>
                <Select
                  label="Member (Optional)"
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {members.map((member: any) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} ({member.memberNo || member.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {selectedMemberId && invoices.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Invoice (Optional)</InputLabel>
                  <Controller
                    name="invoiceId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Invoice (Optional)">
                        <MenuItem value="">None</MenuItem>
                        {invoices.map((invoice: any) => (
                          <MenuItem key={invoice.id} value={invoice.id}>
                            Invoice #{invoice.id?.slice(0, 8)} - KES {invoice.amount?.toLocaleString()}
                            {invoice.dueDate && ` (Due: ${format(new Date(invoice.dueDate), 'MMM dd, yyyy')})`}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.paymentMethod}>
                <InputLabel>Payment Method</InputLabel>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Payment Method">
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="mpesa">M-Pesa</MenuItem>
                      <MenuItem value="cheque">Cheque</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              {errors.paymentMethod && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.paymentMethod.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference Number"
                {...register('referenceNumber')}
                error={!!errors.referenceNumber}
                helperText={errors.referenceNumber?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="paymentDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Payment Date"
                      value={field.value ? new Date(field.value) : new Date()}
                      onChange={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.paymentDate,
                          helperText: errors.paymentDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                {...register('notes')}
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/contributions')}>
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
                'Record Payment'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MakePayment;
