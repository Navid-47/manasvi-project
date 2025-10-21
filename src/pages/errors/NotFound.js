import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, SearchOff } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-lg hover-card animate-fade-in text-center">
        <div className="text-center animate-slide-in-up">
          <div className="mx-auto h-24 w-24 rounded-full bg-brand/10 flex items-center justify-center mb-6 hover-scale">
            <SearchOff className="h-12 w-12 text-brand" />
          </div>
          <h1 className="mt-6 text-center text-5xl font-extrabold text-text animate-fade-in">
            404
          </h1>
          <h2 className="mt-4 text-center text-2xl font-bold text-text animate-fade-in">
            Page Not Found
          </h2>
          <p className="mt-4 text-center text-text-muted animate-fade-in-delay">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="mt-8 animate-slide-in-up-delay">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/')}
              startIcon={<Home />}
              sx={{
                backgroundColor: 'var(--brand)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--brand-dark)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              className="hover-brand"
            >
              Back to Home
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: 'var(--border)',
                color: 'var(--text)',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--brand)',
                  backgroundColor: 'var(--brand)/10',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              className="hover-scale"
            >
              Go Back
            </Button>
          </Box>
        </div>
        
        <div className="mt-8 text-center animate-fade-in-delay-2">
          <p className="text-text-muted text-sm">
            Need help?{' '}
            <button 
              onClick={() => navigate('/contact')}
              className="text-brand font-medium hover:text-brand-dark transition-colors"
            >
              Contact our support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;