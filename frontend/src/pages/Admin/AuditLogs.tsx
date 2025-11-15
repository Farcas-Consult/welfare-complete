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
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import { auditService } from '../../services/auditService';
import { format } from 'date-fns';

const AuditLogs: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const { data, isLoading, error } = useQuery(
    ['audit-logs', page, rowsPerPage, searchTerm, actionFilter],
    () =>
      auditService.getLogs({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        action: actionFilter !== 'all' ? actionFilter : undefined,
      }),
    {
      keepPreviousData: true,
    }
  );

  // Backend returns: { message: "...", data: { logs: [...], pagination: {...} } }
  const responseData = (data?.data as any)?.data || data?.data || {};
  const logs = Array.isArray(responseData.logs) 
    ? responseData.logs 
    : (Array.isArray(responseData) ? responseData : []);
  const totalCount = responseData.pagination?.total || responseData.total || logs.length;

  const getActionColor = (action: string) => {
    if (action?.toLowerCase().includes('create') || action?.toLowerCase().includes('add')) {
      return 'success';
    }
    if (action?.toLowerCase().includes('update') || action?.toLowerCase().includes('edit')) {
      return 'info';
    }
    if (action?.toLowerCase().includes('delete') || action?.toLowerCase().includes('remove')) {
      return 'error';
    }
    return 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Audit Logs
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search audit logs..."
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
            <InputLabel>Action</InputLabel>
            <Select
              value={actionFilter}
              label="Action"
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="create">Create</MenuItem>
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="delete">Delete</MenuItem>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="logout">Logout</MenuItem>
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
          <Typography color="error">Error loading audit logs. Please try again.</Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No audit logs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        {log.timestamp
                          ? format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{log.userName || log.user || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.action || 'N/A'}
                          color={getActionColor(log.action || '')}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{log.entityType || 'N/A'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.details || log.description || 'N/A'}
                        </Typography>
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

export default AuditLogs;
