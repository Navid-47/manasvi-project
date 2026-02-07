import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';

const PackageCard = ({ pkg, onBook }) => {
  const title = pkg?.name || pkg?.title || 'Travel Package';
  const destination = pkg?.destination || pkg?.location || '';
  const price = pkg?.pricePerPerson ?? pkg?.price ?? 0;
  const duration = pkg?.durationDays ?? pkg?.duration ?? '';
  const image = (pkg?.images && pkg.images[0]) || pkg?.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop';
  const rating = pkg?.rating ?? 4.5;
  const inclusions = pkg?.inclusions ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-soft hover:shadow-card overflow-hidden group h-full flex flex-col border border-border/50"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
          <Star size={12} className="text-yellow-500" fill="#eab308" />
          {Number(rating).toFixed(1)}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-1">{title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin size={14} className="text-gray-400" /> {destination}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          {duration && (
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <Clock size={12} /> {typeof duration === 'number' ? `${duration} Days` : duration}
            </span>
          )}
          {inclusions.slice(0, 2).map((inc, i) => (
            <span key={i} className="bg-brand/5 text-brand px-2 py-1 rounded-md line-clamp-1">{inc}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Price per person</p>
            <p className="text-lg font-bold text-brand">₹{Number(price).toLocaleString()}</p>
          </div>
          <button
            onClick={() => onBook?.(pkg)}
            className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 group-hover:scale-110"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;