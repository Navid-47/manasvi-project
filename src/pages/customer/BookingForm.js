import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Typography, Button, Paper, Grid } from '@mui/material';
import Loader from '../../components/Loader';
import { usePackage } from '../../hooks/useFetchPackages';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

const BookingForm = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pkg, loading, error } = usePackage(packageId);
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [travelersDetails, setTravelersDetails] = useState(() =>
    Array.from({ length: Number(travelers) || 1 }, () => ({
      name: '',
      age: '',
      contact: '',
      passportNumber: '',
    }))
  );

  useEffect(() => {
    const count = Number(travelers) || 1;
    setTravelersDetails((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      if (arr.length < count) {
        return [
          ...arr,
          ...Array.from({ length: count - arr.length }, () => ({
            name: '',
            age: '',
            contact: '',
            passportNumber: '',
          })),
        ];
      }
      if (arr.length > count) {
        return arr.slice(0, count);
      }
      return arr;
    });
  }, [travelers]);

  if (loading) {
    return <Loader fullScreen label="Loading booking form..." />;
  }

  if (error || !pkg) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unable to start booking</h1>
          <p className="text-text-muted mb-4">Please go back to tours and try again.</p>
          <button
            className="bg-brand text-white px-6 py-2 rounded-lg hover-brand"
            onClick={() => navigate('/tours')}
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  const pricePerPerson = Number(pkg.pricePerPerson ?? pkg.price ?? 0);
  const totalTravelers = Number(travelers) || 1;
  const totalAmount = pricePerPerson * totalTravelers;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!travelDate) return;

    setSubmitting(true);
    try {
      const booking = createBooking({
        packageId: pkg.id,
        packageName: pkg.name || pkg.title || 'Travel Package',
        destination: pkg.destination || pkg.location || '',
        travelDate,
        travelers: totalTravelers,
        travelersDetails,
        amount: totalAmount,
        userEmail: user?.email || null,
        notes: notes.trim() || undefined,
      });

      navigate(`/booking/${booking.id}/summary`, {
        state: { bookingId: booking.id },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: '16px', border: '1px solid var(--border)' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Booking Details
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                label="Travel date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Number of travelers"
                type="number"
                inputProps={{ min: 1, max: 20 }}
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Special requests (optional)"
                multiline
                minRows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              {travelersDetails.map((t, index) => (
                <Box
                  key={index}
                  sx={{
                    border: '1px solid var(--border)',
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {`Traveler ${index + 1}`}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full name"
                        value={t.name}
                        onChange={(e) =>
                          setTravelersDetails((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, name: e.target.value } : item
                            )
                          )
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={t.age}
                        onChange={(e) =>
                          setTravelersDetails((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, age: e.target.value } : item
                            )
                          )
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Contact number"
                        value={t.contact}
                        onChange={(e) =>
                          setTravelersDetails((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, contact: e.target.value } : item
                            )
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Passport number (if applicable)"
                        value={t.passportNumber}
                        onChange={(e) =>
                          setTravelersDetails((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, passportNumber: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  mt: 1,
                  backgroundColor: 'var(--brand)',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: 'var(--brand-dark)' },
                }}
              >
                {submitting ? 'Processing...' : 'Review Booking'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={1}
            sx={{ p: 3, borderRadius: '16px', border: '1px solid var(--border)' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {pkg.name || pkg.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {pkg.destination || pkg.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {pkg.duration || (pkg.durationDays ? `${pkg.durationDays} days` : '')}
            </Typography>
            <Typography variant="h6" sx={{ color: 'green', fontWeight: 700 }}>
              ₹{pricePerPerson.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {`Total for ${totalTravelers} traveler(s): ₹${totalAmount.toLocaleString()}`}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;

