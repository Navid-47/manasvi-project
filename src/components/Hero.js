import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    title: 'Discover Amazing Destinations',
    subtitle: 'Experience the world with our curated travel packages and unforgettable adventures'
  },
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    title: 'Tropical Beaches',
    subtitle: 'Relax in paradise with our exclusive beach resort packages'
  },
  {
    url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    title: 'Cultural Cities',
    subtitle: 'Explore vibrant cultures and historical landmarks around the globe'
  },
  {
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    title: 'Wildlife Adventures',
    subtitle: 'Witness nature\'s wonders with our expert-guided wildlife tours'
  }
];

const Hero = ({ ctaText = "Explore Tours", ctaLink = "/tours" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Carousel */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${heroImages[currentImageIndex].url}')` }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {heroImages[currentImageIndex].title}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
              {heroImages[currentImageIndex].subtitle}
            </p>

            <Link
              to={ctaLink}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-brand hover:bg-white hover:text-brand text-white text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-brand/20"
            >
              {ctaText}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${index === currentImageIndex
                ? 'w-10 bg-brand'
                : 'bg-white/50 hover:bg-white'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;