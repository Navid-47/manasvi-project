import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';

export default function AdminLayout() {
  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Box sx={{ display: 'flex', backgroundColor: 'var(--bg)', minHeight: 'calc(100vh - 120px)' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Box sx={{ animation: 'fadeInUp 400ms ease-out', '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
