import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { usePackage } from '../../hooks/useFetchPackages';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, FileText, ArrowRight, MapPin, Clock, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Unable to start booking</h1>
          <p className="text-gray-500 mb-6">Please go back to tours and try again.</p>
          <button
            className="w-full bg-brand text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-brand-dark transition-all"
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
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-gray-500 mt-1">Fill in the information below to secure your spot.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Travel Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Number of Travelers</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        required
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                      />
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Special Requests (Optional)</label>
                  <div className="relative">
                    <textarea
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all resize-none"
                      placeholder="Any dietary restrictions or special needs?"
                    />
                    <FileText className="absolute left-3 top-4 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users size={20} className="text-brand" /> Traveler Information
                  </h3>

                  {travelersDetails.map((t, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Traveler {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Full Name</label>
                          <input
                            type="text"
                            required
                            value={t.name}
                            onChange={(e) =>
                              setTravelersDetails((prev) =>
                                prev.map((item, i) => i === index ? { ...item, name: e.target.value } : item)
                              )
                            }
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Age</label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={t.age}
                            onChange={(e) =>
                              setTravelersDetails((prev) =>
                                prev.map((item, i) => i === index ? { ...item, age: e.target.value } : item)
                              )
                            }
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Contact Number</label>
                          <input
                            type="tel"
                            value={t.contact}
                            onChange={(e) =>
                              setTravelersDetails((prev) =>
                                prev.map((item, i) => i === index ? { ...item, contact: e.target.value } : item)
                              )
                            }
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Passport Number (Optional)</label>
                          <input
                            type="text"
                            value={t.passportNumber}
                            onChange={(e) =>
                              setTravelersDetails((prev) =>
                                prev.map((item, i) => i === index ? { ...item, passportNumber: e.target.value } : item)
                              )
                            }
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-8 py-3 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Processing...' : (
                      <>Review Booking <ArrowRight size={18} /></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src={pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021'}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-2">{pkg.name || pkg.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {pkg.destination || pkg.location}
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
                  <span className="font-medium">{totalTravelers} Person{totalTravelers > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-2"><CreditCard size={14} /> Price per person</span>
                  <span className="font-medium">₹{pricePerPerson.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-600 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-brand">₹{totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Taxes and fees included</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

