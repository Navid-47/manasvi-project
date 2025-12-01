import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import Loader from '../../components/Loader';
import { getBookingById } from '../../services/bookingService';
import { getPackageById } from '../../services/packageService';

const BookingSummary = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const idFromState = location.state?.bookingId || bookingId;
        const b = idFromState ? getBookingById(idFromState) : null;
        if (!b) {
          if (!cancelled) setLoading(false);
          return;
        }
        const p = b.packageId ? getPackageById(b.packageId) : null;
        if (!cancelled) {
          setBooking(b);
          setPkg(p || null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookingId, location.state]);

  if (loading) {
    return <Loader fullScreen label="Loading booking summary..." />;
  }

  if (!booking) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Booking not found</h1>
          <p className="text-text-muted mb-4">Please try booking again.</p>
          <button
            className="bg-brand text-white px-6 py-2 rounded-lg hover-brand"
            onClick={() => navigate('/tours')}
          >
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  const handleProceedPayment = () => {
    navigate('/payment/processing', {
      state: {
        bookingId: booking.id,
      },
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: '16px', border: '1px solid var(--border)' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Booking Summary
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Review your booking details before proceeding to payment.
            </Typography>

            <Box className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Booking ID:</span> {booking.id}
              </div>
              <div>
                <span className="font-semibold">Package:</span> {booking.packageName}
              </div>
              <div>
                <span className="font-semibold">Destination:</span> {booking.destination}
              </div>
              <div>
                <span className="font-semibold">Travel date:</span> {booking.travelDate}
              </div>
              <div>
                <span className="font-semibold">Travelers:</span> {booking.travelers}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {booking.status}
              </div>
            </Box>

            {booking.notes && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Special requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.notes}
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: 'var(--brand)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: 'var(--brand-dark)' },
              }}
              onClick={handleProceedPayment}
            >
              Proceed to Payment
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          {pkg && (
            <Paper
              elevation={1}
              sx={{ p: 3, borderRadius: '16px', border: '1px solid var(--border)' }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Package Overview
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {pkg.name || pkg.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {pkg.destination || pkg.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {pkg.duration || (pkg.durationDays ? `${pkg.durationDays} days` : '')}
              </Typography>
              <Typography variant="h6" sx={{ color: 'green', fontWeight: 700 }}>
                ₹{Number(pkg.pricePerPerson ?? pkg.price ?? 0).toLocaleString()}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingSummary;

