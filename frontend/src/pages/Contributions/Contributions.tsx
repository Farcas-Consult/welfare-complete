import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TablePagination,
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { contributionsService } from '../../services/contributionsService';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';

const Contributions: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: invoices, isLoading } = useQuery(
    ['invoices', page, rowsPerPage],
    () =>
      contributionsService.getInvoices({
        page: page + 1,
        limit: rowsPerPage,
      }),
    {
      keepPreviousData: true,
    }
  );

  // Backend returns: { message: "...", data: { invoices: [...], pagination: {...} } }
  const responseData = (invoices?.data as any)?.data || invoices?.data || {};
  const invoicesList = Array.isArray(responseData.invoices) 
    ? responseData.invoices 
    : (Array.isArray(responseData) ? responseData : []);
  const totalCount = responseData.pagination?.total || responseData.total || invoicesList.length;

  // Calculate summary statistics
  const totalCollected = invoicesList
    .filter((inv: any) => inv.status === 'paid')
    .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

  const totalOutstanding = invoicesList
    .filter((inv: any) => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

  const collectionRate = invoicesList.length > 0
    ? ((invoicesList.filter((inv: any) => inv.status === 'paid').length / invoicesList.length) * 100).toFixed(1)
    : '0';

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  // Chart data for contribution trends (mock data - should come from API)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Collections',
        data: [85000, 92000, 88000, 95000, 98000, totalCollected / 1000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Contributions Overview</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/contributions/payment-history')}>
            Payment History
          </Button>
          <Button variant="contained" onClick={() => navigate('/contributions/make-payment')}>
            Make Payment
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Collected</Typography>
              </Box>
              <Typography variant="h4">
                KES {totalCollected.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaymentIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Outstanding</Typography>
              </Box>
              <Typography variant="h4">
                KES {totalOutstanding.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Collection Rate</Typography>
              </Box>
              <Typography variant="h4">{collectionRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contribution Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Invoices
            </Typography>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Box>
                {invoicesList.slice(0, 5).map((invoice: any) => (
                  <Box key={invoice.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2" color="text.secondary">
                      {invoice.memberName || 'Member'}
                    </Typography>
                    <Typography variant="body1">
                      KES {invoice.amount?.toLocaleString() || '0'}
                    </Typography>
                    <Chip
                      label={invoice.status || 'pending'}
                      color={getStatusColor(invoice.status || 'pending')}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Invoices</Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Member</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoicesList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No invoices found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoicesList.map((invoice: any) => (
                      <TableRow key={invoice.id} hover>
                        <TableCell>#{invoice.id?.slice(0, 8) || 'N/A'}</TableCell>
                        <TableCell>{invoice.memberName || 'N/A'}</TableCell>
                        <TableCell>
                          KES {invoice.amount?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell>
                          {invoice.dueDate
                            ? format(new Date(invoice.dueDate), 'MMM dd, yyyy')
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status || 'pending'}
                            color={getStatusColor(invoice.status || 'pending')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/contributions/invoices/${invoice.id}`)}
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
      </Paper>
    </Box>
  );
};

export default Contributions;
