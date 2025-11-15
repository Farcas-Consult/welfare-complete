import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Members', icon: <PeopleIcon />, path: '/members' },
  { text: 'Contributions', icon: <AttachMoneyIcon />, path: '/contributions' },
  { text: 'Claims', icon: <AssignmentIcon />, path: '/claims' },
  { text: 'Loans', icon: <AccountBalanceIcon />, path: '/loans' },
  { text: 'Meetings', icon: <EventIcon />, path: '/meetings' },
];

const adminItems = [
  { text: 'Reports', icon: <AssignmentIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Audit Logs', icon: <EventIcon />, path: '/admin/audit-logs' },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const DrawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Welfare System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding onClick={() => navigate(item.path)}>
            <ListItemButton selected={location.pathname.startsWith(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {adminItems.map((item) => (
          <ListItem key={item.text} disablePadding onClick={() => navigate(item.path)}>
            <ListItemButton selected={location.pathname.startsWith(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {navItems.find(item => location.pathname.startsWith(item.path))?.text || 'Admin'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2">
            Welcome, Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {DrawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {DrawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
