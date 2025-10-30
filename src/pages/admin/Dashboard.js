import React from 'react';
import { AppBar, Box, Toolbar, Typography, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function AdminDashboard() {
  const location = useLocation();
  const loginSuccess = location.state?.loginSuccess;
  const userName = location.state?.userName || 'Admin';

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--bg)' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Welcome, {userName}</Typography>
        <Typography color="text.secondary">Use the sidebar (coming soon) to manage packages, bookings, and reports.</Typography>
      </Box>

      <Snackbar open={!!loginSuccess} autoHideDuration={3000}>
        <Alert severity="success" variant="filled">
          Login Successful — Welcome back, {userName}!
        </Alert>
      </Snackbar>
    </Box>
  );
}

