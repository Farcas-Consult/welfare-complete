import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarTodayIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalContributions: number;
  monthlyTarget: number;
  collectionRate: number;
  pendingClaims: number;
  activeLoans: number;
  upcomingMeetings: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>(
    'dashboardStats',
    () => api.get('/dashboard/stats').then(res => res.data),
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  // Fetch recent activities
  const { data: activities } = useQuery(
    'recentActivities',
    () => api.get('/dashboard/activities').then(res => res.data)
  );

  // Fetch contribution trends
  const { data: trends } = useQuery(
    'contributionTrends',
    () => api.get('/dashboard/trends').then(res => res.data)
  );

  const statsCards = [
    {
      title: 'Total Members',
      value: stats?.totalMembers || 0,
      change: '+12%',
      trend: 'up',
      icon: <PeopleIcon />,
      color: '#1976d2',
      action: () => navigate('/members'),
    },
    {
      title: 'Monthly Collections',
      value: `KES ${stats?.totalContributions?.toLocaleString() || 0}`,
      change: '+8%',
      trend: 'up',
      icon: <AttachMoneyIcon />,
      color: '#2e7d32',
      action: () => navigate('/contributions'),
    },
    {
      title: 'Pending Claims',
      value: stats?.pendingClaims || 0,
      change: '-5%',
      trend: 'down',
      icon: <AssignmentIcon />,
      color: '#ed6c02',
      action: () => navigate('/claims'),
    },
    {
      title: 'Active Loans',
      value: stats?.activeLoans || 0,
      change: '+3%',
      trend: 'up',
      icon: <AccountBalanceIcon />,
      color: '#9c27b0',
      action: () => navigate('/loans'),
    },
  ];

  // Chart data for contributions
  const contributionChartData = {
    labels: trends?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Target',
        data: trends?.target || [100000, 100000, 100000, 100000, 100000, 100000],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderDash: [5, 5],
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Actual',
        data: trends?.actual || [85000, 92000, 88000, 95000, 98000, 102000],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Pie chart data for member status
  const memberStatusData = {
    labels: ['Active', 'Inactive', 'Suspended'],
    datasets: [
      {
        data: [stats?.activeMembers || 0, 15, 5],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's an overview of your welfare system
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={card.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: card.color }}>
                    {card.icon}
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {card.trend === 'up' ? (
                      <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: 16 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={card.trend === 'up' ? 'success.main' : 'error.main'}
                    >
                      {card.change}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Contribution Trends */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Contribution Trends</Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: 320 }}>
              <Line data={contributionChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Member Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Member Status
            </Typography>
            <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={memberStatusData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activities and Upcoming Events */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List sx={{ overflow: 'auto', height: 320 }}>
              {activities?.map((activity: any, index: number) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: activity.color }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {activity.user}
                          </Typography>
                          {' — '}{activity.description}
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Meetings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Upcoming Meetings</Typography>
              <Button
                size="small"
                startIcon={<CalendarTodayIcon />}
                onClick={() => navigate('/meetings/schedule')}
              >
                Schedule
              </Button>
            </Box>
            <List sx={{ overflow: 'auto', height: 320 }}>
              {[1, 2, 3].map((meeting) => (
                <ListItem key={meeting} sx={{ mb: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <ListItemText
                    primary={`Monthly General Meeting ${meeting}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(), 'EEEE, MMMM dd, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          2:00 PM - Conference Room A
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip label="In Person" size="small" sx={{ mr: 1 }} />
                          <Chip label="15 Attendees" size="small" variant="outlined" />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Collection Progress */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Collection Progress
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                KES {stats?.totalContributions?.toLocaleString() || 0} collected
              </Typography>
              <Typography variant="body2">
                Target: KES {stats?.monthlyTarget?.toLocaleString() || 100000}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={stats?.collectionRate || 75} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {stats?.collectionRate || 75}% of monthly target achieved
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
