// src/pages/user/profile.js
import React, { useMemo, useState } from 'react';

import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Button,
  Snackbar,
  Alert,
  Avatar,
  Stack,
  MenuItem,
  Divider,
  Grow,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getUserByEmail, updateUser } from '../../services/userService';

export default function Profile() {

  const [form, setForm] = useState({
    firstName: 'Alex',
    lastName: 'Traveler',
    gender: 'Male',
    dob: '',
    nationality: 'Indian',
    maritalStatus: 'Single',
    anniversary: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 98765 43210',
    email: 'alex@example.com',
    passportNumber: '',
    passportExpiry: '',
    issuingCountry: 'India',
    panNumber: '',
  });
  const [snack, setSnack] = useState(false);
  const { user, login } = useAuth();

  React.useEffect(() => {
    if (!user?.email) return;
    try {
      const u = getUserByEmail(user.email);
      if (!u) return;
      const fallbackName = String(u.name || '')
        .trim();
      const [firstDefault, ...rest] = fallbackName.split(' ').filter(Boolean);
      const lastDefault = rest.join(' ');
      setForm((prev) => ({
        ...prev,
        firstName: u.firstName || firstDefault || prev.firstName,
        lastName: u.lastName || lastDefault || prev.lastName,
        gender: u.gender || prev.gender,
        dob: u.dob || prev.dob,
        nationality: u.nationality || prev.nationality,
        maritalStatus: u.maritalStatus || prev.maritalStatus,
        anniversary: u.anniversary || prev.anniversary,
        city: u.city || prev.city,
        state: u.state || prev.state,
        phone: u.phone || prev.phone,
        email: u.email || prev.email,
        passportNumber: u.passportNumber || prev.passportNumber,
        passportExpiry: u.passportExpiry || prev.passportExpiry,
        issuingCountry: u.issuingCountry || prev.issuingCountry,
        panNumber: u.panNumber || prev.panNumber,
      }));
    } catch {}
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const displayName = useMemo(
    () => `${form.firstName || ''} ${form.lastName || ''}`.trim() || 'User',
    [form.firstName, form.lastName]
  );
  const initials = displayName
    .split('.')
    .join(' ')
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Grow in timeout={300}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', my: 4, px: { xs: 2, md: 3 } }}>
        {/* Header with Save button */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={4}
          gap={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: 'var(--brand)', 
                width: 56, 
                height: 56,
                fontSize: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, var(--primary) 30%, var(--primary-dark) 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5
              }}>
                My Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
                Keep your details up to date for a smoother booking experience. Your information is secure and only used to enhance your travel experience.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="large"
            disableElevation
            sx={{
              background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: '#fff',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.2)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
                background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%) !important',
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.15)',
                background: 'linear-gradient(45deg, var(--primary-dark) 0%, var(--primary-darker) 100%)',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
                boxShadow: 'none',
              },
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 2, sm: 0 }
            }}
            onClick={() => {
              const computedName = `${form.firstName || ''} ${form.lastName || ''}`.trim();
              const userName = computedName || (user && user.userName) || 'User';
              try {
                if (user?.id) {
                  updateUser(user.id, {
                    name: userName,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    gender: form.gender,
                    dob: form.dob,
                    nationality: form.nationality,
                    maritalStatus: form.maritalStatus,
                    anniversary: form.anniversary,
                    city: form.city,
                    state: form.state,
                    phone: form.phone,
                    passportNumber: form.passportNumber,
                    passportExpiry: form.passportExpiry,
                    issuingCountry: form.issuingCountry,
                    panNumber: form.panNumber,
                  });
                }
              } catch {}
              if (login) {
                if (user) {
                  login({ ...user, userName });
                } else {
                  login({ userName, role: 'user' });
                }
              }
              setSnack(true);
            }}
          >
            Save Changes
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            background: '#fff',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 300ms ease',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* General Information */}
          <Box sx={{ 
            mb: 4,
            pb: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Box component="span" sx={{ 
                width: 6, 
                height: 24, 
                bgcolor: 'var(--brand)', 
                borderRadius: '0 3px 3px 0',
                display: 'inline-block'
              }} />
              General Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, pl: 2.5 }}>
              Your basic profile information
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First & Middle Name"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--brand)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--brand)',
                      boxShadow: '0 0 0 3px rgba(0, 118, 255, 0.1)'
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    '&.Mui-focused': {
                      color: 'var(--brand)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--brand)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--brand)',
                      boxShadow: '0 0 0 3px rgba(0, 118, 255, 0.1)'
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    '&.Mui-focused': {
                      color: 'var(--brand)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={form.gender}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--brand)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--brand)',
                      boxShadow: '0 0 0 3px rgba(0, 118, 255, 0.1)'
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    '&.Mui-focused': {
                      color: 'var(--brand)',
                    },
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        borderRadius: 2,
                        mt: 1,
                        boxShadow: '0 8px 24px 0 rgba(0,0,0,0.08)',
                        '& .MuiMenuItem-root': {
                          padding: '8px 16px',
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(0, 118, 255, 0.08)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 118, 255, 0.12)',
                            },
                          },
                        },
                      },
                    },
                  },
                }}
                onChange={onChange}
              >
                {['Male', 'Female', 'Other'].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                name="dob"
                value={form.dob}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nationality"
                name="nationality"
                value={form.nationality}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Marital Status"
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={onChange}
              >
                {['Single', 'Married', 'Divorced', 'Widowed'].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Anniversary"
                name="anniversary"
                value={form.anniversary}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City of Residence"
                name="city"
                value={form.city}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={form.state}
                onChange={onChange}
                helperText="Required for GST purpose on your tax invoice"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <hr />

          {/* Contact Details */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Contact Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="phone"
                value={form.phone}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email ID"
                name="email"
                value={form.email}
                onChange={onChange}
                disabled
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <hr />

          {/* Documents Details */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Documents Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Passport No."
                name="passportNumber"
                value={form.passportNumber}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Expiry Date"
                name="passportExpiry"
                value={form.passportExpiry}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issuing Country"
                name="issuingCountry"
                value={form.issuingCountry}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PAN Card Number"
                name="panNumber"
                value={form.panNumber}
                onChange={onChange}
              />
            </Grid>
          </Grid>

          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
            NOTE: Your PAN No. will only be used for international bookings as per RBI Guidelines
          </Typography>
        </Paper>

        <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
          <Alert severity="success" variant="filled">Profile updated successfully!</Alert>
        </Snackbar>
      </Box>
    </Grow>
  );
}