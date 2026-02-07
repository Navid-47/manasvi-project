import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getBookingById } from '../../services/bookingService';
import { getPackageById } from '../../services/packageService';
import { CheckCircle, MapPin, Calendar, Users, CreditCard, Clock, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Booking not found</h1>
          <p className="text-gray-500 mb-6">Please try booking again.</p>
          <button
            className="w-full bg-brand text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-brand-dark transition-all"
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
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <CheckCircle size={32} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Created!</h1>
          <p className="text-gray-500 mt-2">Please review your details before proceeding to payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Summary Card */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                    <p className="text-gray-500 text-sm mt-1">ID: <span className="font-mono text-gray-700">#{booking.id}</span></p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Destination</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><MapPin size={16} className="text-brand" /> {booking.destination}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Travel Date</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2"><Calendar size={16} className="text-brand" /> {booking.travelDate}</p>
                  </div>
                </div>

                {/* Traveler Details */}
                {Array.isArray(booking.travelersDetails) && booking.travelersDetails.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Users size={16} /> Traveler Details
                    </h3>
                    <div className="space-y-3">
                      {booking.travelersDetails.map((t, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                          <div className="font-medium text-gray-900 mb-1 sm:mb-0">
                            <span className="text-gray-400 mr-2">#{index + 1}</span> {t.name || 'N/A'}
                          </div>
                          <div className="text-gray-500 flex flex-wrap gap-3">
                            {t.age && <span>Age: {t.age}</span>}
                            {t.contact && <span>• {t.contact}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {booking.notes && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                      <FileText size={16} /> Special Requests
                    </h3>
                    <p className="text-sm text-yellow-800/80">{booking.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleProceedPayment}
                className="w-full md:w-auto px-8 py-3 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Package Summary Sidebar */}
          <div className="lg:col-span-4">
            {pkg && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8"
              >
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-4">Package Overview</h3>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021'}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-2 text-sm">{pkg.name || pkg.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {pkg.destination || pkg.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-2"><Clock size={14} /> Duration</span>
                    <span className="font-medium">{pkg.duration || (pkg.durationDays ? `${pkg.durationDays} days` : 'N/A')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center gap-2"><Users size={14} /> Travelers</span>
                    <span className="font-medium">{booking.travelers}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 text-sm">Amount due</span>
                    <span className="text-2xl font-bold text-brand">₹{Number(pkg.pricePerPerson ?? pkg.price ?? 0).toLocaleString()}</span>
                    {/* Note: In summary we show total amount, usually calculated. If booking has amount use it */}
                  </div>
                  {booking.amount && (
                    <div className="flex justify-between items-center mt-2 border-t border-gray-200 pt-2">
                      <span className="text-gray-900 font-bold">Total</span>
                      <span className="text-2xl font-bold text-brand">₹{Number(booking.amount).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;

