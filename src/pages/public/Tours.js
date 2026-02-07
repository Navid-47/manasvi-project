import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PackageCard from '../../components/PackageCard';
import { useFetchPackages } from '../../hooks/useFetchPackages';
import Skeleton from '../../components/ui/Skeleton';

const Tours = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 6;
  const navigate = useNavigate();

  const { packages, loading, error } = useFetchPackages();
  const allTours = (packages || []).filter((pkg) => pkg.active !== false);

  const categories = ['Adventure', 'Beach', 'Cultural', 'City'];
  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'duration', label: 'Duration' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  // Filter and sort tours
  const filteredTours = allTours
    .filter((tour) => {
      const name = (tour.name || tour.title || '').toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const category = tour.category || '';
      const matchesCategory = selectedCategory === '' || category === selectedCategory;
      const destination = (tour.destination || tour.location || '').toLowerCase();
      const matchesDestination =
        destinationFilter.trim() === '' ||
        destination.includes(destinationFilter.trim().toLowerCase());
      const price = Number(tour.pricePerPerson ?? tour.price ?? 0);
      const hasMin = minPrice !== '' && !Number.isNaN(Number(minPrice));
      const hasMax = maxPrice !== '' && !Number.isNaN(Number(maxPrice));
      const matchesMin = !hasMin || price >= Number(minPrice);
      const matchesMax = !hasMax || price <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesDestination && matchesMin && matchesMax;
    })
    .sort((a, b) => {
      const priceA = Number(a.pricePerPerson ?? a.price ?? 0);
      const priceB = Number(b.pricePerPerson ?? b.price ?? 0);
      const ratingA = Number(a.rating ?? 0);
      const ratingB = Number(b.rating ?? 0);
      const nameA = (a.name || a.title || '').toString();
      const nameB = (b.name || b.title || '').toString();

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      const durationA = Number((a.durationDays ?? parseInt(a.duration, 10)) || 0);
      const durationB = Number((b.durationDays ?? parseInt(b.duration, 10)) || 0);
      if (sortBy === 'rating') return ratingB - ratingA;
      if (sortBy === 'duration') return durationA - durationB;
      if (sortBy === 'name') return nameA.localeCompare(nameB);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTours = filteredTours.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
    setDestinationFilter('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    setShowFilters(false);
  };

  return (
    <div className="pt-24 pb-16 bg-bg-body min-h-screen">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-primary"
          >
            Explore Our Tours
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-2xl mx-auto"
          >
            Discover our carefully crafted travel packages for unforgettable experiences across the globe.
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-8 sticky top-24 z-30 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${showFilters ? 'bg-brand text-white' : 'bg-gray-50 text-text-secondary hover:bg-gray-100'}`}
              >
                <Filter size={18} /> Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 md:w-48 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 text-sm"
              >
                <option value="">Sort By</option>
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 mt-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={destinationFilter}
                        onChange={(e) => setDestinationFilter(e.target.value)}
                        placeholder="e.g. Switzerland"
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-100 focus:border-brand outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedCategory === cat
                              ? 'bg-brand text-white border-brand'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-brand/50'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm outline-none focus:border-brand"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <X size={14} /> Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl shadow-sm p-4 h-96">
                <Skeleton height="180px" className="mb-4 rounded-xl" />
                <Skeleton width="60%" height="24px" className="mb-2" />
                <Skeleton width="40%" height="16px" className="mb-4" />
                <div className="flex gap-2 mb-8">
                  <Skeleton width="50px" height="20px" />
                  <Skeleton width="50px" height="20px" />
                </div>
                <Skeleton width="100%" height="40px" className="rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <h3 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h3>
            <p className="text-red-500/70">Failed to load tours. Please try again later.</p>
          </div>
        )}

        {/* Tours Grid */}
        {!loading && !error && (
          <>
            {paginatedTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedTours.map((tour) => (
                  <PackageCard
                    key={tour.id}
                    pkg={tour}
                    onBook={(pkg) => navigate(`/tours/${pkg.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-600 mb-2">No tours found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters.</p>
                <button onClick={clearFilters} className="text-brand font-bold hover:underline">Clear all filters</button>
              </div>
            )}

            {/* Simple Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tours;