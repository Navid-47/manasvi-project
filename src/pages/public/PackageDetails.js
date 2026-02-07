import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackage } from '../../hooks/useFetchPackages';
import { MapPin, Clock, Star, Calendar, CheckCircle, XCircle, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from '../../components/ui/Skeleton';

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { pkg, loading, error } = usePackage(packageId);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton height="400px" className="rounded-3xl" />
          <div className="space-y-4">
            <Skeleton width="60%" height="40px" />
            <Skeleton width="40%" height="20px" />
            <div className="flex gap-4">
              <Skeleton width="100px" height="30px" />
              <Skeleton width="100px" height="30px" />
            </div>
            <Skeleton width="100%" height="150px" />
            <Skeleton width="100%" height="50px" className="rounded-xl mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Package Not Found</h2>
        <p className="text-gray-500 mb-6">The package you're looking for doesn't exist or failed to load.</p>
        <button
          onClick={() => navigate('/tours')}
          className="px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-colors"
        >
          Back to Tours
        </button>
      </div>
    );
  }

  const title = pkg.name || pkg.title || 'Travel Package';
  const destination = pkg.destination || pkg.location || '';
  const price = pkg.pricePerPerson ?? pkg.price ?? 0;
  const duration = pkg.duration || (pkg.durationDays ? `${pkg.durationDays} days` : '');
  const image = (pkg.images && pkg.images[0]) || pkg.image;
  const rating = pkg.rating ?? 4.5;
  const highlights = pkg.highlights || [];
  const inclusions = pkg.inclusions || [];
  const exclusions = pkg.exclusions || [];

  return (
    <div className="min-h-screen bg-bg-body pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-500 hover:text-brand transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tours
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Images & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden shadow-lg h-[400px] md:h-[500px] relative group"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-brand shadow-sm flex items-center gap-1">
                <Star fill="currentColor" size={16} /> {Number(rating).toFixed(1)}
              </div>
            </motion.div>

            {/* Highlights */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star className="text-brand" size={24} /> Highlights
              </h3>
              <div className="flex flex-wrap gap-3">
                {highlights.map((h, i) => (
                  <span key={i} className="bg-brand/5 text-brand-dark px-4 py-2 rounded-xl font-medium text-sm border border-brand/10">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">About this Trip</h3>
              <p className="text-gray-600 leading-relaxed">
                {pkg.description || "Experience an unforgettable journey with our curated travel package. Explore hidden gems, taste local cuisines, and immerse yourself in the culture of your destination."}
              </p>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <CheckCircle size={20} /> What's Included
                </h4>
                <ul className="space-y-2">
                  {inclusions.length > 0 ? inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-900/80">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      {inc}
                    </li>
                  )) : (
                    <li className="text-sm text-gray-400">Standard inclusions apply</li>
                  )}
                </ul>
              </div>

              <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100">
                <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                  <XCircle size={20} /> What's Excluded
                </h4>
                <ul className="space-y-2">
                  {exclusions.length > 0 ? (
                    // If exclusions is a single string or array, handle it. Assuming array based on previous file.
                    (Array.isArray(exclusions) ? exclusions : [exclusions]).map((exc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-900/80">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {exc}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400">Personal expenses not included</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-3xl shadow-xl shadow-brand/5 p-8 border border-gray-100/50">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-6 text-sm">
                  <MapPin size={16} /> {destination}
                </div>

                <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                    <div className="flex items-center gap-1 font-semibold text-gray-800">
                      <Clock size={18} className="text-brand" /> {duration}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Price per person</p>
                    <p className="text-3xl font-bold text-brand">₹{Number(price).toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/book/${packageId}`)}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-brand/20 transition-all active:scale-95 mb-4"
                >
                  Book Now
                </button>

                <button className="w-full border border-gray-200 hover:border-brand/50 hover:bg-brand/5 text-gray-700 font-semibold py-3 rounded-xl transition-all">
                  Download Itinerary
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand font-medium bg-brand/5 py-3 rounded-lg">
                  <Shield size={14} /> Best Price Guaranteed
                </div>
              </div>

              <div className="bg-brand text-white rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full dark-circle blur-2xl"></div>
                <h3 className="text-xl font-bold mb-2 relative z-10">Need Help?</h3>
                <p className="text-white/80 text-sm mb-6 relative z-10">Talk to our travel experts for a customized experience.</p>
                <button className="bg-white text-brand px-6 py-2 rounded-lg font-bold text-sm relative z-10 hover:bg-gray-100 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
