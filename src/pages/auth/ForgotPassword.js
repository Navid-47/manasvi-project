import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { Email, ArrowBack } from '@mui/icons-material';
import BackButton from '../../components/common/BackButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Animate sections on load
    const timer = setTimeout(() => {
      // setAnimatedSections(['form', 'divider']);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="p-8 space-y-6">
          <BackButton className="-mt-2 -ml-2" />
          
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4 transform hover:scale-105 transition-transform">
              <Email className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {resetSuccess ? 'Check Your Email' : 'Reset Password'}
            </h2>
            <p className="text-gray-600">
              {resetSuccess 
                ? `We've sent password reset instructions to ${email}` 
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>
          
          {resetError && (
            <Alert 
              severity="error" 
              className="animate-fade-in"
              sx={{ borderRadius: '12px' }}
            >
              {resetError}
            </Alert>
          )}
          
          {resetSuccess ? (
            <div className="space-y-6">
              <Alert 
                severity="success" 
                className="animate-fade-in"
                sx={{ borderRadius: '12px' }}
              >
                We've sent password reset instructions to your email address.
              </Alert>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/login')}
                startIcon={<ArrowBack />}
                sx={{
                  py: 1.5,
                  borderRadius: '8px',
                  background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #4338ca, #6d28d9)',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  height: '48px',
                  transition: 'all 0.3s ease',
                }}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    startAdornment: <Email className="text-gray-400 mr-2" />,
                    sx: {
                      '&:hover fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{
                    py: 1.5,
                    borderRadius: '8px',
                    background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #4338ca, #6d28d9)',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    height: '48px',
                    transition: 'all 0.3s ease',
                    '&:disabled': {
                      background: 'linear-gradient(to right, #a5b4fc, #c4b5fd)',
                      color: 'white',
                    },
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Box>
              <div className="text-center text-sm">
                <Link 
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
          
          {!resetSuccess && (
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Need help?
                </span>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have access to your email?{' '}
                  <Link 
                    to="/contact" 
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Contact support
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;