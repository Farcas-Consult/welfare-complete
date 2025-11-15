import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { paymentsService } from '../../services/paymentsService';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';

const PaymentHistory: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  const { data, isLoading, error } = useQuery(
    ['payments', page, rowsPerPage, searchTerm, paymentMethodFilter],
    () =>
      paymentsService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        paymentMethod: paymentMethodFilter !== 'all' ? paymentMethodFilter : undefined,
      }),
    {
      keepPreviousData: true,
    }
  );

  // Backend returns: { message: "...", data: { payments: [...], pagination: {...} } }
  const responseData = (data?.data as any)?.data || data?.data || {};
  const payments = Array.isArray(responseData.payments) 
    ? responseData.payments 
    : (Array.isArray(responseData) ? responseData : []);
  const totalCount = responseData.pagination?.total || responseData.total || payments.length;

  const csvData = payments.map((payment: any) => ({
    'Payment ID': payment.id,
    'Member': payment.memberName || 'N/A',
    'Amount': payment.amount,
    'Payment Method': payment.paymentMethod,
    'Reference Number': payment.referenceNumber || 'N/A',
    'Date': payment.paymentDate ? format(new Date(payment.paymentDate), 'yyyy-MM-dd') : 'N/A',
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payment History</Typography>
        <CSVLink data={csvData} filename="payment-history.csv" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export CSV
          </Button>
        </CSVLink>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search payments..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethodFilter}
              label="Payment Method"
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="mpesa">M-Pesa</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="error">Error loading payments. Please try again.</Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Reference Number</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No payments found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment: any) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>#{payment.id?.slice(0, 8) || 'N/A'}</TableCell>
                      <TableCell>{payment.memberName || 'N/A'}</TableCell>
                      <TableCell>
                        KES {payment.amount?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                      <TableCell>{payment.referenceNumber || 'N/A'}</TableCell>
                      <TableCell>
                        {payment.paymentDate
                          ? format(new Date(payment.paymentDate), 'MMM dd, yyyy')
                          : 'N/A'}
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

export default PaymentHistory;
