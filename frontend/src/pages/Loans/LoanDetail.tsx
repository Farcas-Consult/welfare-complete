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
  IconButton,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { loansService } from '../../services/loansService';
import { format } from 'date-fns';

const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const { data: loan, isLoading } = useQuery(
    ['loan', id],
    () => loansService.getById(id!),
    {
      enabled: !!id,
    }
  );

  const approveMutation = useMutation(
    () => loansService.approve(id!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['loan', id]);
        enqueueSnackbar('Loan approved successfully', { variant: 'success' });
        setApproveDialogOpen(false);
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.data?.message || 'Failed to approve loan', { variant: 'error' });
      },
    }
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'defaulted':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const calculateRepaymentSchedule = (loanData: any) => {
    if (!loanData?.amount || !loanData?.interestRate || !loanData?.repaymentPeriod) {
      return [];
    }

    const monthlyRate = loanData.interestRate / 100 / 12;
    const monthlyPayment =
      (loanData.amount * monthlyRate * Math.pow(1 + monthlyRate, loanData.repaymentPeriod)) /
      (Math.pow(1 + monthlyRate, loanData.repaymentPeriod) - 1);

    const schedule = [];
    let balance = loanData.amount;

    for (let i = 1; i <= loanData.repaymentPeriod; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;

      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal,
        interest,
        balance: Math.max(0, balance),
      });
    }

    return schedule;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loan?.data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error">
          Loan not found
        </Typography>
      </Box>
    );
  }

  const loanData = loan.data;
  const repaymentSchedule = calculateRepaymentSchedule(loanData);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/loans')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Loan Details
        </Typography>
        {loanData.status === 'pending' && (
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => setApproveDialogOpen(true)}
          >
            Approve Loan
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Loan Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Loan ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  #{loanData.id?.slice(0, 8) || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Amount
                </Typography>
                <Typography variant="h6" gutterBottom>
                  KES {loanData.amount?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Interest Rate
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {loanData.interestRate || 'N/A'}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Repayment Period
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {loanData.repaymentPeriod || 'N/A'} months
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Purpose
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {loanData.purpose || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status & Member
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={loanData.status || 'pending'}
                    color={getStatusColor(loanData.status || 'pending')}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Member
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {loanData.member?.firstName} {loanData.member?.lastName || loanData.memberName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Member Number
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {loanData.member?.memberNo || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Application Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {loanData.createdAt
                    ? format(new Date(loanData.createdAt), 'MMM dd, yyyy')
                    : 'N/A'}
                </Typography>
                {loanData.dueDate && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Due Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(new Date(loanData.dueDate), 'MMM dd, yyyy')}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {repaymentSchedule.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Repayment Schedule
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell align="right">Payment</TableCell>
                          <TableCell align="right">Principal</TableCell>
                          <TableCell align="right">Interest</TableCell>
                          <TableCell align="right">Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {repaymentSchedule.slice(0, 12).map((payment) => (
                          <TableRow key={payment.month}>
                            <TableCell>{payment.month}</TableCell>
                            <TableCell align="right">
                              KES {payment.payment.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell align="right">
                              KES {payment.principal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell align="right">
                              KES {payment.interest.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell align="right">
                              KES {payment.balance.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                        {repaymentSchedule.length > 12 && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <Typography variant="body2" color="text.secondary">
                                ... and {repaymentSchedule.length - 12} more months
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Approve Loan</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve this loan application?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => approveMutation.mutate()}
            variant="contained"
            disabled={approveMutation.isLoading}
          >
            {approveMutation.isLoading ? <CircularProgress size={20} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanDetail;
