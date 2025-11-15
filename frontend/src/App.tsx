import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Store
import { store } from './store/store';

// Layout Components
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Member Pages
import Members from './pages/Members/Members';
import MemberDetail from './pages/Members/MemberDetail';
import MemberRegistration from './pages/Members/MemberRegistration';

// Contribution Pages
import Contributions from './pages/Contributions/Contributions';
import PaymentHistory from './pages/Contributions/PaymentHistory';
import MakePayment from './pages/Contributions/MakePayment';

// Claims Pages
import Claims from './pages/Claims/Claims';
import ClaimApplication from './pages/Claims/ClaimApplication';
import ClaimDetail from './pages/Claims/ClaimDetail';

// Loans Pages
import Loans from './pages/Loans/Loans';
import LoanApplication from './pages/Loans/LoanApplication';
import LoanDetail from './pages/Loans/LoanDetail';

// Meetings Pages
import Meetings from './pages/Meetings/Meetings';
import MeetingDetail from './pages/Meetings/MeetingDetail';
import ScheduleMeeting from './pages/Meetings/ScheduleMeeting';

// Reports Pages
import Reports from './pages/Reports/Reports';

// Admin Pages
import Settings from './pages/Admin/Settings';
import Users from './pages/Admin/Users';
import AuditLogs from './pages/Admin/AuditLogs';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#f50057',
      dark: '#c51162',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
        },
      },
    },
  },
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider 
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              autoHideDuration={5000}
            >
              <CssBaseline />
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                      {/* Dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Members */}
                      <Route path="/members" element={<Members />} />
                      <Route path="/members/new" element={<MemberRegistration />} />
                      <Route path="/members/:id" element={<MemberDetail />} />
                      
                      {/* Contributions */}
                      <Route path="/contributions" element={<Contributions />} />
                      <Route path="/contributions/payment-history" element={<PaymentHistory />} />
                      <Route path="/contributions/make-payment" element={<MakePayment />} />
                      
                      {/* Claims */}
                      <Route path="/claims" element={<Claims />} />
                      <Route path="/claims/new" element={<ClaimApplication />} />
                      <Route path="/claims/:id" element={<ClaimDetail />} />
                      
                      {/* Loans */}
                      <Route path="/loans" element={<Loans />} />
                      <Route path="/loans/apply" element={<LoanApplication />} />
                      <Route path="/loans/:id" element={<LoanDetail />} />
                      
                      {/* Meetings */}
                      <Route path="/meetings" element={<Meetings />} />
                      <Route path="/meetings/schedule" element={<ScheduleMeeting />} />
                      <Route path="/meetings/:id" element={<MeetingDetail />} />
                      
                      {/* Reports */}
                      <Route path="/reports" element={<Reports />} />
                      
                      {/* Admin */}
                      <Route path="/admin/settings" element={<Settings />} />
                      <Route path="/admin/users" element={<Users />} />
                      <Route path="/admin/audit-logs" element={<AuditLogs />} />
                    </Route>
                  </Route>
                </Routes>
              </Router>
              <ReactQueryDevtools initialIsOpen={false} />
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
