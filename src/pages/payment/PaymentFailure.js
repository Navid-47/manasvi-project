import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorOutline } from '@mui/icons-material';

const PaymentFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId;

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-bg">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <ErrorOutline className="text-red-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-text-muted mb-4">
          Something went wrong while processing your payment. No money has been deducted.
        </p>
        {bookingId && (
          <p className="text-sm text-text-muted mb-4">Booking ID: {bookingId}</p>
        )}
        <button
          className="bg-brand text-white px-6 py-2 rounded-lg hover-brand mr-2"
          onClick={() => navigate(-1)}
        >
          Try Again
        </button>
        <button
          className="mt-3 md:mt-0 bg-transparent border border-brand text-brand px-6 py-2 rounded-lg hover-brand"
          onClick={() => navigate('/user-dashboard/bookings')}
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;

