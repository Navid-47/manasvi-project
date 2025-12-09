import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Person, Email, Lock } from '@mui/icons-material';
import { createUser, getUserByEmail } from '../../services/userService';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
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
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    setRegisterError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const existing = await getUserByEmail(email);
      if (existing) {
        setRegisterError('An account with this email already exists');
        return;
      }

      const created = await createUser({ name, email, password, role: 'customer' });
      console.log('Registration attempt with:', { name, email, password, confirmPassword });
      navigate('/login', { state: { registeredEmail: created.email } });
    } catch (error) {
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
            <Person className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 mb-8">
            Join us to start planning your next adventure
          </p>
        </div>
        
        {registerError && (
          <Alert 
            severity="error" 
            className="mb-6 animate-fade-in"
            sx={{ borderRadius: '12px' }}
          >
            {registerError}
          </Alert>
        )}
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Why Register?</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p className="flex items-center"><span className="mr-2">✓</span> Save your travel preferences</p>
                <p className="flex items-center"><span className="mr-2">✓</span> Get exclusive deals</p>
                <p className="flex items-center"><span className="mr-2">✓</span> Manage your bookings easily</p>
              </div>
            </div>
          </div>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: '' }));
                }
              }}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: <Person className="text-text-muted mr-2 hover-scale" />
              }}
              className="hover-scale"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
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
              {isLoading ? 'Creating your account...' : 'Create Account'}
            </Button>
          </Box>
        </form>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or sign up with
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

export default Register;