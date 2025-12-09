import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getBookingById, updateBooking } from '../../services/bookingService';
import { createPayment } from '../../services/paymentService';
import { addCustomerNotification, addAdminNotification } from '../../services/notificationService';

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
          userEmail: booking.userEmail || null,
          packageName: booking.packageName || 'Travel Package',
        });
        updateBooking(booking.id, { status: 'Confirmed' });

        try {
          if (booking.userEmail) {
            addCustomerNotification(
              booking.userEmail,
              `Your booking for ${booking.packageName || 'Travel Package'} is confirmed`
            );
          }
          addAdminNotification(
            `New booking ${booking.id} confirmed${
              booking.packageName ? ` • ${booking.packageName}` : ''
            }`
          );
        } catch {
          // ignore notification errors
        }

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

