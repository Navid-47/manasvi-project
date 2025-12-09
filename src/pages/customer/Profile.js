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
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        {/* Header with Save button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'var(--brand)' }}>{initials}</Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                My Profile
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Keep your details up to date for a smoother booking experience.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#555',
              color: '#fff',
              borderRadius: 1,
              px: 3,
              '&:hover': { backgroundColor: '#333' },
              textTransform: 'none',
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
            Save
          </Button>
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            animation: 'fadeIn 300ms ease',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(6px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* General Information */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            General Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First & Middle Name"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={form.gender}
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