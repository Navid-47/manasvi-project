import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Email, Lock } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [animatedSections, setAnimatedSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate sections on load
    const timer = setTimeout(() => {
      setAnimatedSections(['form', 'divider', 'social']);
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
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    setLoginError('');
    
    // Simulate API call
    try {
      // In a real app, you would authenticate the user here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo auth: set user in localStorage and redirect based on role
      const role = email.trim().toLowerCase() === 'admin@travelmanasvi.com' ? 'admin' : 'user';
      const userName = email.split('@')[0] || 'User';
      localStorage.setItem('tm_user', JSON.stringify({ email, role, userName }));

      const target = role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
      console.log('Login success →', { email, role, target });
      navigate(target, { state: { loginSuccess: true, userName } });
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to access your personalized travel dashboard
          </p>
        </div>
        
        {loginError && (
          <Alert 
            severity="error" 
            className="mb-6 animate-fade-in"
            sx={{ borderRadius: '12px' }}
          >
            {loginError}
          </Alert>
        )}
        
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
                startAdornment: <Email className="text-text-muted mr-2 hover-scale" />
              }}
              className="hover-scale"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: <Lock className="text-text-muted mr-2 hover-scale" />
              }}
              className="hover-scale"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: '8px',
                background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                '&:hover': {
                  background: 'linear-gradient(to right, #4338ca, #6d28d9)',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                },
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                height: '48px'
              }}
            >
              {isLoading ? 'Signing in...' : 'Continue to Your Account'}
            </Button>
          </Box>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <Link 
            href="/forgot-password" 
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className={`mt-6 ${animatedSections.includes('social') ? 'animate-slide-in-up' : ''}`}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#e5e7eb',
              color: '#1f2937',
              '&:hover': {
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            className="hover-scale"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            <span className="ml-2">Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;