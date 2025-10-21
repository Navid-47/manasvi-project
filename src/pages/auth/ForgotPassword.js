import React, { useState, useEffect } from 'react';
import { TextField, Button, Link, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Email } from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [animatedSections, setAnimatedSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate sections on load
    const timer = setTimeout(() => {
      setAnimatedSections(['form', 'divider']);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setResetError('');
    
    // Simulate API call
    try {
      // In a real app, you would send a password reset request here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll show success message
      console.log('Password reset request sent to:', email);
      setResetSuccess(true);
    } catch (error) {
      setResetError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-lg hover-card animate-fade-in">
        <div className="text-center animate-slide-in-up">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand flex items-center justify-center mb-4 hover-scale">
            <Email className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text animate-fade-in">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-text-muted animate-fade-in-delay">
            {resetSuccess 
              ? "Check your email for reset instructions" 
              : "Enter your email and we'll send you reset instructions"}
          </p>
        </div>
        
        {resetError && (
          <Alert severity="error" className="mt-4 animate-slide-in-up">
            {resetError}
          </Alert>
        )}
        
        {resetSuccess ? (
          <div className="mt-8 animate-slide-in-up">
            <Alert severity="success" className="mb-6">
              Password reset instructions have been sent to {email}. Please check your inbox.
            </Alert>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
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
              Back to Login
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-6 animate-slide-in-up" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <Email className="text-text-muted mr-2 hover-scale" />
                }}
                className="hover-scale"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
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
                  '&:disabled': {
                    backgroundColor: 'var(--brand)',
                    opacity: 0.7,
                  },
                  transition: 'all 0.3s ease',
                }}
                className="hover-brand"
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
            </Box>
            <div className="flex items-center justify-center animate-slide-in-up-delay">
              <Link 
                href="#" 
                variant="body2" 
                sx={{ color: 'var(--brand)' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                className="text-hover"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
        
        {!resetSuccess && (
          <div className={`mt-6 ${animatedSections.includes('divider') ? 'animate-fade-in' : ''}`}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-muted">
                  Need help?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-muted text-sm">
                Don't have access to your email?{' '}
                <Link 
                  href="#" 
                  variant="body2" 
                  sx={{ color: 'var(--brand)' }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                  className="text-hover"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;