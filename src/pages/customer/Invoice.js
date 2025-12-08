import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import Loader from '../../components/Loader';
import { getBookingById } from '../../services/bookingService';
import { getAllPayments } from '../../services/paymentService';

const Invoice = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      setLoading(true);
      try {
        const b = bookingId ? getBookingById(bookingId) : null;
        if (!b) {
          if (!cancelled) {
            setBooking(null);
            setPayment(null);
          }
          return;
        }
        const allPayments = getAllPayments();
        const p = allPayments.find(
          (pay) => String(pay.bookingId) === String(b.id) && pay.status === 'Success'
        );
        if (!cancelled) {
          setBooking(b);
          setPayment(p || null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (loading) {
    return <Loader fullScreen label="Loading invoice..." />;
  }

  if (!booking) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invoice not found</h1>
          <p className="text-text-muted mb-4">We couldn't find a booking for this invoice.</p>
          <button
            className="bg-brand text-white px-6 py-2 rounded-lg hover-brand"
            onClick={() => navigate('/user-dashboard/bookings')}
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const amount = Number(booking.amount || 0);
  const invoiceId = payment?.id || 'N/A';
  const transactionDate = payment?.createdAt
    ? new Date(payment.createdAt).toLocaleString()
    : booking.createdAt
    ? new Date(booking.createdAt).toLocaleString()
    : 'N/A';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid var(--border)',
          boxShadow: '0 3px 14px rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Travel Manasvi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Travel Agency Management System
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Invoice
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Invoice ID: {invoiceId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Booking ID: {booking.id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Billed To
            </Typography>
            <Typography variant="body2">{booking.userEmail || 'Customer'}</Typography>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Invoice Date
            </Typography>
            <Typography variant="body2">{transactionDate}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Booking Details
          </Typography>
          <Typography variant="body2">
            Package: {booking.packageName}
          </Typography>
          <Typography variant="body2">
            Destination: {booking.destination}
          </Typography>
          <Typography variant="body2">
            Travel date: {booking.travelDate}
          </Typography>
          <Typography variant="body2">
            Travelers: {booking.travelers}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Payment Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Package amount</Typography>
            <Typography variant="body2">₹{amount.toLocaleString()}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Total Paid
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ₹{amount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            This is a system-generated invoice for your travel booking.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate('/user-dashboard/bookings')}>
              Back to My Bookings
            </Button>
            <Button
              variant="contained"
              onClick={handlePrint}
              sx={{ backgroundColor: 'var(--brand)', textTransform: 'none', fontWeight: 600 }}
            >
              Print / Download
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Invoice;
