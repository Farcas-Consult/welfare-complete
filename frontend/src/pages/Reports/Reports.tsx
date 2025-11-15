import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { reportsService } from '../../services/reportsService';
import { format } from 'date-fns';
import { Bar, Pie } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: summaryData, isLoading: summaryLoading } = useQuery(
    ['reports-summary', dateRange],
    () => reportsService.getSummary(dateRange)
  );

  const { data: contributionsData, isLoading: contributionsLoading } = useQuery(
    ['reports-contributions', dateRange],
    () => reportsService.getContributionsReport(dateRange)
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const summary = summaryData?.data || {};
  const contributions = contributionsData?.data || {};

  const summaryChartData = {
    labels: ['Members', 'Contributions', 'Claims', 'Loans'],
    datasets: [
      {
        label: 'Count',
        data: [
          summary.totalMembers || 0,
          summary.totalContributions || 0,
          summary.totalClaims || 0,
          summary.totalLoans || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  const contributionsChartData = {
    labels: contributions.monthlyData?.map((m: any) => m.month) || [],
    datasets: [
      {
        label: 'Contributions (KES)',
        data: contributions.monthlyData?.map((m: any) => m.amount) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const csvData = contributions.monthlyData?.map((m: any) => ({
    Month: m.month,
    'Total Contributions': m.amount,
  })) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Summary Report" />
          <Tab label="Contributions Report" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {summaryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Summary Statistics
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Members
                        </Typography>
                        <Typography variant="h5">
                          {summary.totalMembers || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Contributions
                        </Typography>
                        <Typography variant="h5">
                          KES {summary.totalContributions?.toLocaleString() || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Claims
                        </Typography>
                        <Typography variant="h5">
                          {summary.totalClaims || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Active Loans
                        </Typography>
                        <Typography variant="h5">
                          {summary.totalLoans || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Overview Chart
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar data={summaryChartData} options={{ maintainAspectRatio: false }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {contributionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Contributions by Month</Typography>
                  <CSVLink data={csvData} filename="contributions-report.csv" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                      Export CSV
                    </Button>
                  </CSVLink>
                </Box>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ height: 400 }}>
                    <Bar data={contributionsChartData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Total Contributions (KES)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contributions.monthlyData?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        contributions.monthlyData?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.month}</TableCell>
                            <TableCell align="right">
                              KES {item.amount?.toLocaleString() || '0'}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Reports;
