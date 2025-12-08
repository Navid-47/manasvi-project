import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <LockIcon sx={{ fontSize: 50, color: 'white' }} />
        </Box>
        
        <Typography variant="h3" component="h1" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography variant="h6" color="textSecondary" paragraph>
          You don't have permission to access this page.
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph sx={{ maxWidth: 600, mb: 4 }}>
          The page you are trying to access requires special permissions. Please contact the 
          administrator if you believe this is a mistake or sign in with a different account.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            sx={{ minWidth: 160 }}
          >
            Back to Home
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/login"
            sx={{ minWidth: 160 }}
          >
            Sign In
          </Button>
          
          <Button
            variant="text"
            color="primary"
            component={RouterLink}
            to="/contact"
          >
            Contact Support
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
