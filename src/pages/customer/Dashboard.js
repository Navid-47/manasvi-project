// src/pages/user/Dashboard.js
import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import CustomerNavbar from '../../components/CustomerNavbar';
import Footer from '../../components/Footer';
//import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const location = useLocation();
  const [showLoginSnackbar, setShowLoginSnackbar] = React.useState(false);
  const [userName, setUserName] = React.useState('User');

  // Show login success snackbar only once on initial login
  React.useEffect(() => {
    if (location.state?.loginSuccess) {
      setShowLoginSnackbar(true);
      setUserName(location.state?.userName || 'User');
      
      // Clear the location state to prevent showing snackbar on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <>
      <CustomerNavbar />

      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'var(--bg)',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Sidebar */}
        <Sidebar sx={{ position: 'static' }} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              animation: 'fadeInUp 400ms ease-out',
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <Footer />

      {/* Login Success Snackbar - Shows only once */}
      <Snackbar 
        open={showLoginSnackbar} 
        autoHideDuration={3000}
        onClose={() => setShowLoginSnackbar(false)}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Login Successful — Welcome back, {userName}!
        </Alert>
      </Snackbar>
    </>
  );
}