import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllBookings } from '../../services/bookingService';
import {
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  CreditCard,
  ArrowRight,
  Plane
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    // In a real app, this might be an async call
    setAllBookings(getAllBookings());
  }, []);

  const email = user?.email;
  const userBookings = email ? allBookings.filter((b) => b.userEmail === email) : [];

  const totalBookings = userBookings.length;
  const confirmed = userBookings.filter((b) => b.status === 'Confirmed');
  const totalSpent = confirmed.reduce((sum, b) => sum + (b.amount || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;

  const upcoming = confirmed
    .map((b) => {
      const rawDate = b.travelDate || b.createdAt;
      if (!rawDate) return null;
      const tripDate = new Date(rawDate);
      if (Number.isNaN(tripDate.getTime())) return null;
      tripDate.setHours(0, 0, 0, 0);
      const daysUntil = Math.round((tripDate.getTime() - today.getTime()) / dayMs);
      return {
        id: b.id,
        packageName: b.packageName || 'Travel Package',
        destination: b.destination || 'Unknown Destination',
        date: tripDate.toLocaleDateString(),
        daysUntil,
        image: b.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
      };
    })
    .filter((x) => x && x.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Upcoming Trips',
      value: upcoming.length,
      icon: Plane,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  const displayName = user?.userName || (user?.email ? user.email.split('@')[0] : 'Traveler');

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, {displayName}!</h1>
          <p className="text-text-secondary">Here's what's happening with your travel plans.</p>
        </div>
        <button
          onClick={() => navigate('/tours')}
          className="px-6 py-2.5 bg-brand text-white rounded-xl font-medium shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all transform hover:-translate-y-0.5"
        >
          Book New Trip
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-text-primary">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Trips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Clock size={20} className="text-brand" /> Upcoming Trips
          </h2>
          <button
            onClick={() => navigate('/user-dashboard/bookings')}
            className="text-brand text-sm font-medium hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={16} />
          </button>
        </div>

        {upcoming.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center"
          >
            <Plane size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-text-primary font-medium">No upcoming trips planned</p>
            <p className="text-text-secondary text-sm mb-4">Ready to start your next adventure?</p>
            <button
              onClick={() => navigate('/tours')}
              className="px-4 py-2 border border-brand text-brand rounded-lg text-sm font-medium hover:bg-brand hover:text-white transition-colors"
            >
              Explore Packages
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcoming.slice(0, 4).map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-brand shadow-sm">
                    {trip.daysUntil === 0 ? 'Today!' : `In ${trip.daysUntil} days`}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="flex items-center gap-1 text-xs opacity-90"><MapPin size={12} /> {trip.destination}</p>
                    <h4 className="font-bold text-lg leading-tight truncate w-full pr-4">{trip.packageName}</h4>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center text-sm text-text-secondary mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {trip.date}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">Confirmed</span>
                  </div>
                  <button
                    onClick={() => navigate('/user-dashboard/bookings')}
                    className="w-full py-2 border border-gray-200 text-text-secondary rounded-xl text-sm font-medium hover:bg-gray-50 hover:text-text-primary transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Promo / Banner Area */}
      <div className="bg-gradient-to-r from-brand to-secondary rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Invite friends & Earn Rewards</h3>
            <p className="text-white/80">Share your referral code with friends and get ₹500 off on your next booking when they complete a trip.</p>
          </div>
          <button className="px-6 py-3 bg-white text-brand font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2">
            <CreditCard size={18} /> Get Referral Code
          </button>
        </div>
      </div>
    </div>
  );
}