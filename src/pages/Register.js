import React, { useState, useEffect } from 'react';
import { TextField, Button, Link, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Person, Email, Lock } from '@mui/icons-material';

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
    
    // Simulate API call
    try {
      // In a real app, you would register the user here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll just navigate to home
      console.log('Registration attempt with:', { name, email, password, confirmPassword });
      navigate('/');
    } catch (error) {
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-lg hover-card animate-fade-in">
        <div className="text-center animate-slide-in-up">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand flex items-center justify-center mb-4 hover-scale">
            <Person className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text animate-fade-in">
            Create your account
          </h2>
          <p className="mt-2 text-center text-text-muted animate-fade-in-delay">
            Join us to start planning your next adventure
          </p>
        </div>
        
        {registerError && (
          <Alert severity="error" className="mt-4 animate-slide-in-up">
            {registerError}
          </Alert>
        )}
        
        <form className="mt-8 space-y-6 animate-slide-in-up" onSubmit={handleSubmit}>
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
                'Register'
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
              Already have an account? Sign in
            </Link>
          </div>
        </form>
        
        <div className={`mt-6 ${animatedSections.includes('divider') ? 'animate-fade-in' : ''}`}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">
                Or sign up with
              </span>
            </div>
          </div>

          <div className={`mt-6 grid grid-cols-2 gap-3 ${animatedSections.includes('social') ? 'animate-slide-in-up' : ''}`}>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'var(--border)',
                color: 'var(--text)',
                '&:hover': {
                  borderColor: 'var(--brand)',
                  backgroundColor: 'var(--brand)/10',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              className="hover-scale"
            >
              <svg className="w-5 h-5 hover-scale" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              <span className="ml-2 hover-scale">Google</span>
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'var(--border)',
                color: 'var(--text)',
                '&:hover': {
                  borderColor: 'var(--brand)',
                  backgroundColor: 'var(--brand)/10',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              className="hover-scale"
            >
              <svg className="w-5 h-5 hover-scale" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2 hover-scale">Facebook</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;