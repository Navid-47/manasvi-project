import React, { useState, useEffect } from 'react';
import Hero from '../../components/Hero';
import { TextField, MenuItem, Select, FormControl } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [animatedSections, setAnimatedSections] = useState([]);
  const [slideshowTick, setSlideshowTick] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedSections(prev => [...prev, entry.target.id]);
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Global slideshow tick (every 5 seconds) for Home cards
  useEffect(() => {
    const id = setInterval(() => setSlideshowTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const destinations = [
    { label: 'Swiss Alps, Switzerland', value: 'swiss-alps' },
    { label: 'Bali, Indonesia', value: 'bali' },
    { label: 'Paris, France', value: 'paris' },
    { label: 'Santorini, Greece', value: 'santorini' },
    { label: 'Tokyo, Japan', value: 'tokyo' },
    { label: 'Solapur, India', value: 'solapur' },
    { label: 'Sydney, Australia', value: 'sydney' },
    { label: 'Rome, Italy', value: 'rome' },
    { label: 'Maldives, Maldives', value: 'maldives' },
    { label: 'Banff, Canada', value: 'banff' },
    { label: 'Dubai, UAE', value: 'dubai' },
    { label: 'Barcelona, Spain', value: 'barcelona' },
    { label: 'Taj Mahal, Agra, India', value: 'taj-mahal' },
    { label: 'Kerala Backwaters, India', value: 'kerala-backwaters' },
    { label: 'Rajasthan, India', value: 'rajasthan' },
    { label: 'Goa, India', value: 'goa' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosen = destinations.find(d => d.value === destination);
    const query = new URLSearchParams();
    if (chosen) {
      query.set('q', chosen.label.split(',')[0]);
    }
    query.set('sort', 'ratingDesc');
    navigate(`/destinations?${query.toString()}`);
  };

  // Enhanced destination data with more details
  const featuredDestinations = [
    {
      id: 1,
      name: 'Swiss Alps',
      country: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      images: [
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Experience the breathtaking beauty of the Swiss Alps with our guided tours through majestic mountains, crystal-clear lakes, and charming villages.',
      price: 120000,
      rating: 4.8,
      duration: '7 days',
      highlights: ['Mountain hiking', 'Lake cruises', 'Chocolate tasting', 'Ski resorts']
    },
    {
      id: 2,
      name: 'Bali Beaches',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      images: [
        'https://images.unsplash.com/photo-1518544801976-3e7231347b02?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508182311256-e3f7d50b9b64?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500530855697-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Relax on the pristine beaches of Bali with our all-inclusive package featuring luxury accommodations, cultural experiences, and water activities.',
      price: 95000,
      rating: 4.9,
      duration: '10 days',
      highlights: ['Beachfront resorts', 'Temple visits', 'Rice terraces', 'Spa treatments']
    },
    {
      id: 3,
      name: 'Taj Mahal & Agra',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1564507593976-8a5f0f1d2b5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
        'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1543164904-8b717b7cbf9b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1585475964746-1dfeadfde94e?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Experience the architectural marvel of the Taj Mahal, one of the Seven Wonders of the World, along with other historical monuments in Agra.',
      price: 45000,
      rating: 4.8,
      duration: '3 days',
      highlights: ['Taj Mahal sunrise view', 'Agra Fort', 'Local cuisine', 'Cultural performances']
    }
  ];

  // Enhanced features with more descriptive content
  const features = [
    {
      id: 1,
      title: 'Best Price Guarantee',
      description: 'We guarantee the best prices for all our travel packages. Found a lower price? We\'ll match it! Our team works tirelessly to negotiate the best deals with our partners to ensure you get maximum value for your money.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: '24/7 Support',
      description: 'Our customer support team is available 24/7 to assist you with any travel-related queries. Whether you need help before, during, or after your trip, we\'re here for you with multilingual support in over 10 languages.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Fast & Easy Booking',
      description: 'Book your dream vacation in just a few clicks with our user-friendly booking system. Our streamlined process allows you to customize your trip, select accommodations, and manage your booking all in one place.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Expert Travel Guides',
      description: 'Our certified travel experts have visited every destination we offer. They provide insider knowledge, local tips, and exclusive access to experiences that you won\'t find in guidebooks.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      )
    }
  ];

  // Enhanced testimonials with more details
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'United States',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      tour: 'Swiss Alps Adventure',
      text: "The trip to the Swiss Alps was absolutely amazing! The service was impeccable and the accommodations exceeded our expectations. Our guide, Hans, was incredibly knowledgeable about the local history and culture. We especially loved the chocolate-making workshop in Zurich. Highly recommended!"
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Singapore',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      tour: 'Bali Beach Retreat',
      text: "Travel Manasvi made our honeymoon to Bali unforgettable. Everything was perfectly organized and the guides were knowledgeable. The villa in Seminyak was stunning, and the private dinner on the beach was magical. We've already recommended this tour to our friends!"
    }
  ];

  return (
    <div>
      <Hero
        title="Discover Amazing Destinations"
        subtitle="Experience the world with our curated travel packages and unforgettable adventures"
        ctaText="Explore Tours"
        ctaLink="/tours"
      />

      {/* Search Section - Overlay on Hero */}
      <section className="relative z-10 -mt-60 mb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto rounded-xl shadow-2xl overflow-hidden bg-white bg-opacity-95 backdrop-blur-sm">
            <div className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Trip</h2>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      displayEmpty
                      className="rounded-lg bg-white"
                    >
                      <MenuItem value="" disabled>
                        <em>Select Destination</em>
                      </MenuItem>
                      {destinations.map((dest) => (
                        <MenuItem key={dest.value} value={dest.value}>
                          {dest.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    fullWidth
                    type="date"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-white rounded-lg"
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    type="date"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-white rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FormControl fullWidth variant="outlined" size="small" className="flex-1">
                    <Select
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="rounded-lg bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <MenuItem key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-brand to-blue-700 hover:from-brand-dark hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center shadow hover:shadow-lg"
                  >
                    <Search />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section id="destinations" className={`py-16 bg-surface section-animate ${animatedSections.includes('destinations') ? 'animate' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Discover our most sought-after destinations loved by travelers from around the world
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl" style={{
                '--tw-bg-opacity': 1,
                '&:hover': {
                  backgroundColor: 'white !important',
                  '--tw-bg-opacity': 1
                }
              }}>
                <div className="relative">
                  <img
                    src={(() => {
                      const arr = destination.images && destination.images.length ? Array.from(new Set(destination.images)) : [destination.image];
                      return arr[slideshowTick % arr.length];
                    })()}
                    alt={destination.name}
                    className="w-full h-60 object-cover img-hover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const arr = destination.images && destination.images.length ? Array.from(new Set(destination.images)) : [];
                      const next = arr.length > 1 ? arr[(slideshowTick + 1) % arr.length] : null;
                      const coverOk = destination.image && (!arr.length || !arr.includes(destination.image));
                      e.currentTarget.src = next || (coverOk ? destination.image : 'https://images.unsplash.com/photo-1503342217505-b0a15cf70489?auto=format&fit=crop&w=1200&q=80');
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-brand text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce-in">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-text-muted text-sm">{destination.country}</p>
                    </div>
                    <span className="text-green-600 font-bold">₹{destination.price.toLocaleString()}</span>
                  </div>
                  <p className="text-text-muted mb-4">{destination.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.slice(0, 2).map((highlight, index) => (
                      <span key={index} className="bg-brand/10 text-brand text-xs px-2 py-1 rounded hover-scale">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(destination.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-text-muted rating-value">{destination.rating}</span>
                    </div>
                    <button className="bg-brand text-white px-4 py-2 rounded-lg transition-all duration-300 hover-brand">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-fade-in-delay">
            <Link
              to="/destinations"
              className="inline-block border-2 border-brand text-brand hover:bg-brand hover:text-white font-bold py-3 px-8 rounded-lg transition duration-300 hover-brand no-underline"
              aria-label="View all destinations"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-16 bg-bg section-animate ${animatedSections.includes('features') ? 'animate' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              We provide exceptional travel experiences with our unique services and commitment to quality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="text-center p-6 bg-surface rounded-xl shadow-md transition-all duration-300 hover-card animate-slide-in-up">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-6 hover-scale">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-16 bg-surface section-animate ${animatedSections.includes('testimonials') ? 'animate' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">What Our Travelers Say</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Hear from our satisfied customers who have experienced the world with us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-bg p-6 rounded-xl shadow-md transition-all duration-300 hover-card animate-slide-in-left">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 img-hover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-text-muted text-sm">{testimonial.location}</p>
                    <p className="text-brand text-sm">{testimonial.tour}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-muted italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-brand-100 max-w-2xl mx-auto mb-8 text-xl">
            Join thousands of satisfied travelers and explore the world with us
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-brand hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300 hover-brand">
              Book Your Trip Now
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand font-bold py-3 px-8 rounded-lg transition duration-300 hover-brand">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;