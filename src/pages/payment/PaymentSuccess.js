import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import { getBookingById } from '../../services/bookingService';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId;
  const paymentId = location.state?.paymentId;
  const booking = bookingId ? getBookingById(bookingId) : null;

  let travelDateLabel = '';
  let destination = '';
  let daysUntil = null;
  if (booking) {
    destination = booking.destination || '';
    const rawDate = booking.travelDate || booking.createdAt;
    if (rawDate) {
      const tripDate = new Date(rawDate);
      if (!Number.isNaN(tripDate.getTime())) {
        const dTrip = new Date(tripDate);
        const dNow = new Date();
        dTrip.setHours(0, 0, 0, 0);
        dNow.setHours(0, 0, 0, 0);
        daysUntil = Math.round((dTrip.getTime() - dNow.getTime()) / (24 * 60 * 60 * 1000));
        travelDateLabel = dTrip.toLocaleDateString();
      }
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-bg">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
        <p className="text-text-muted mb-4">
          Thank you! Your payment has been processed successfully.
        </p>
        {bookingId && (
          <p className="text-sm text-text-muted mb-1">Booking ID: {bookingId}</p>
        )}
        {paymentId && (
          <p className="text-sm text-text-muted mb-4">Transaction ID: {paymentId}</p>
        )}
        {booking && travelDateLabel && (
          <p className="text-sm text-text-muted mb-1">
            Trip: {booking.packageName || 'Travel Package'}{destination ? ` • ${destination}` : ''} on {travelDateLabel}
          </p>
        )}
        {typeof daysUntil === 'number' && daysUntil >= 0 && (
          <p className="text-sm text-green-600 mb-4">
            {daysUntil === 0
              ? 'Your trip is today. Have a wonderful journey!'
              : `We will remind you about this trip in ${daysUntil} day(s).`}
          </p>
        )}
        <button
          className="bg-brand text-white px-6 py-2 rounded-lg hover-brand mr-2"
          onClick={() => navigate('/user-dashboard/bookings')}
        >
          View My Bookings
        </button>
        <button
          className="mt-3 md:mt-0 bg-transparent border border-brand text-brand px-6 py-2 rounded-lg hover-brand"
          onClick={() => navigate('/tours')}
        >
          Book Another Trip
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

