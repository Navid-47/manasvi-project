import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getBookingById, updateBooking } from '../../services/bookingService';
import { createPayment } from '../../services/paymentService';

const PaymentCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = location.state?.bookingId;
    if (!bookingId) {
      navigate('/user-dashboard/bookings', { replace: true });
      return;
    }

    const booking = getBookingById(bookingId);
    if (!booking) {
      navigate('/user-dashboard/bookings', { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      try {
        const payment = createPayment({
          bookingId: booking.id,
          amount: booking.amount,
          method: 'Card',
        });
        updateBooking(booking.id, { status: 'Confirmed' });
        navigate('/payment/success', {
          replace: true,
          state: { bookingId: booking.id, paymentId: payment.id },
        });
      } catch {
        navigate('/payment/failure', {
          replace: true,
          state: { bookingId: booking.id },
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  return <Loader fullScreen label="Processing payment..." variant="bar" />;
};

export default PaymentCheckout;

