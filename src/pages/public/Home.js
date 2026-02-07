import React, { useState, useEffect } from 'react';
import Hero from '../../components/Hero';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Headphones, MousePointerClick, Globe } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

const Home = () => {
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const featuredDestinations = [
    {
      id: 1,
      name: 'Swiss Alps',
      country: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      description: 'Experience the breathtaking beauty of the Swiss Alps with our guided tours.',
      price: 120000,
      rating: 4.8,
      highlights: ['Hiking', 'Lakes', 'Skiing']
    },
    {
      id: 2,
      name: 'Bali Beaches',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      description: 'Relax on the pristine beaches of Bali with our all-inclusive package.',
      price: 95000,
      rating: 4.9,
      highlights: ['Beaches', 'Culture', 'Spa']
    },
    {
      id: 3,
      name: 'Taj Mahal & Agra',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1564507593976-8a5f0f1d2b5a?auto=format&fit=crop&w=800&q=80',
      description: 'Experience the architectural marvel of the Taj Mahal.',
      price: 45000,
      rating: 4.8,
      highlights: ['History', 'Culture', 'Food']
    }
  ];

  const features = [
    {
      id: 1,
      title: 'Best Price Guarantee',
      description: 'We guarantee the best prices for all our travel packages.',
      icon: <ShieldCheck size={32} className="text-white" />
    },
    {
      id: 2,
      title: '24/7 Support',
      description: 'Our customer support team is available 24/7 to assist you.',
      icon: <Headphones size={32} className="text-white" />
    },
    {
      id: 3,
      title: 'Easy Booking',
      description: 'Book your dream vacation in just a few clicks.',
      icon: <MousePointerClick size={32} className="text-white" />
    },
    {
      id: 4,
      title: 'Expert Guides',
      description: 'Our certified travel experts have visited every destination.',
      icon: <Globe size={32} className="text-white" />
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'United States',
      text: "The trip to the Swiss Alps was absolutely amazing! The service was impeccable.",
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Singapore',
      text: "Travel Manasvi made our honeymoon to Bali unforgettable.",
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (destination) query.set('q', destination);
    navigate(`/destinations?${query.toString()}`);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-bg-body min-h-screen">
      <Hero />

      {/* Floating Search Bar */}
      <section className="relative px-4 -mt-24 z-20 mb-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="container mx-auto max-w-5xl bg-white rounded-3xl shadow-glass p-6 md:p-10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Trip</h2>
            <p className="text-gray-500">Search top destinations and experiences</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                <MapPin size={16} /> Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none appearance-none"
              >
                <option value="">Where to?</option>
                <option value="swiss-alps">Swiss Alps</option>
                <option value="bali">Bali</option>
                <option value="paris">Paris</option>
                <option value="tokyo">Tokyo</option>
                <option value="india">India</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                <Calendar size={16} /> Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                <Users size={16} /> Travelers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
            >
              <Search size={20} /> Search
            </button>
          </form>
        </motion.div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Popular Destinations</motion.h2>
            <motion.p variants={fadeInUp} className="text-text-secondary max-w-2xl mx-auto">
              Discover our most sought-after locations, hand-picked for their beauty and culture.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Skeletons
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl shadow-soft overflow-hidden h-[450px]">
                  <Skeleton height="240px" width="100%" />
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton width="60%" height="24px" />
                      <Skeleton width="20%" height="24px" />
                    </div>
                    <Skeleton width="100%" height="16px" />
                    <Skeleton width="80%" height="16px" />
                    <div className="flex gap-2 pt-4">
                      <Skeleton width="60px" height="24px" className="rounded-full" />
                      <Skeleton width="60px" height="24px" className="rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Real Content
              featuredDestinations.map((dest) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-soft hover:shadow-card transition-shadow duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                      <Star size={14} className="text-accent" fill="#f59e0b" />
                      {dest.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand transition-colors">{dest.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {dest.country}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-brand">₹{dest.price.toLocaleString()}</p>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{dest.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {dest.highlights.map(h => (
                        <span key={h} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{h}</span>
                      ))}
                    </div>

                    <button className="w-full py-3 border border-brand text-brand hover:bg-brand hover:text-white rounded-xl font-medium transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors"
            >
              View All Destinations <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-brand to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand/20 text-white">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-3 text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-text-primary">What Our Travelers Say</h2>
            <p className="text-text-secondary">Real stories from our happy customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand/20" />
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-gray-600 italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Start Your Journey?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-brand font-bold rounded-xl shadow-xl hover:bg-gray-50 transition-colors">
              Book Now
            </button>
            <button className="px-8 py-4 bg-brand-dark/20 border border-white/30 text-white font-bold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;