import React, { useMemo, useState } from 'react';
import { Chip, TextField, MenuItem, Select, FormControl, InputLabel, Pagination, Box } from '@mui/material';
import { Search, LocationOn, Star } from '@mui/icons-material';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Data
  const allDestinations = [
    {
      id: 1,
      name: 'Swiss Alps',
      country: 'Switzerland',
      category: 'Mountain',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      description: 'Breathtaking mountains, lakes, and charming villages.',
      price: 120000,
      rating: 4.8,
      duration: '7 days',
      featured: true,
      highlights: ['Mountain hiking', 'Lake cruises', 'Chocolate tasting', 'Ski resorts'],
      bestTime: 'June to September',
      currency: 'CHF'
    },
    {
      id: 2,
      name: 'Bali Beaches',
      country: 'Indonesia',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      description: 'Pristine beaches, temples, and relaxing spa retreats.',
      price: 95000,
      rating: 4.9,
      duration: '10 days',
      featured: true,
      highlights: ['Beachfront resorts', 'Temple visits', 'Rice terraces', 'Spa treatments'],
      bestTime: 'April to October',
      currency: 'IDR'
    },
    {
      id: 3,
      name: 'Paris',
      country: 'France',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=1200&q=80',
      description: 'The city of lights, art, and gastronomy.',
      price: 110000,
      rating: 4.7,
      duration: '5 days',
      featured: false,
      highlights: ['Eiffel Tower', 'Louvre', 'Seine cruise', 'Cafés'],
      bestTime: 'April to June, Sep to Nov',
      currency: 'EUR'
    },
    {
      id: 4,
      name: 'Santorini',
      country: 'Greece',
      category: 'Island',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      description: 'Whitewashed cliffs and magical sunsets over the Aegean.',
      price: 105000,
      rating: 4.6,
      duration: '6 days',
      featured: false,
      highlights: ['Oia sunset', 'Caldera cruise', 'Local wines'],
      bestTime: 'May to October',
      currency: 'EUR'
    },
    {
      id: 5,
      name: 'Tokyo',
      country: 'Japan',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      description: 'Neon vibes, ancient temples, and world-class cuisine.',
      price: 130000,
      rating: 4.8,
      duration: '7 days',
      featured: false,
      highlights: ['Shibuya Crossing', 'Asakusa', 'Sushi tour'],
      bestTime: 'March to May, Oct to Nov',
      currency: 'JPY'
    },
    {
      id: 6,
      name: 'Goa',
      country: 'India',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80',
      description: 'Laid-back beaches and vibrant nightlife on the Konkan coast.',
      price: 35000,
      rating: 4.5,
      duration: '4 days',
      featured: false,
      highlights: ['Baga beach', 'Fort Aguada', 'Spice plantation'],
      bestTime: 'Nov to Feb',
      currency: 'INR'
    },
    {
      id: 7,
      name: 'Dubai',
      country: 'UAE',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=80',
      description: 'Skyscrapers, desert safaris, and luxury shopping.',
      price: 90000,
      rating: 4.4,
      duration: '4 days',
      featured: false,
      highlights: ['Burj Khalifa', 'Desert safari', 'Dubai Mall'],
      bestTime: 'Nov to Mar',
      currency: 'AED'
    },
    {
      id: 8,
      name: 'Kerala Backwaters',
      country: 'India',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
      description: 'Serene houseboat cruises and lush green landscapes.',
      price: 48000,
      rating: 4.6,
      duration: '5 days',
      featured: false,
      highlights: ['Alleppey houseboat', 'Munnar hills', 'Ayurveda'],
      bestTime: 'Sep to Mar',
      currency: 'INR'
    },
    {
      id: 9,
      name: 'Agra',
      country: 'India',
      category: 'Cultural',
      // Updated to a reliable image for Taj Mahal & Agra
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
      description: 'Experience the architectural marvel of the Taj Mahal and rich Mughal heritage.',
      price: 45000,
      rating: 4.8,
      duration: '3 days',
      featured: true,
      highlights: ['Taj Mahal sunrise', 'Agra Fort', 'Local cuisine', 'Cultural performances'],
      bestTime: 'Oct to Mar',
      currency: 'INR'
    }
  ];

  const categories = ['All', 'Mountain', 'Beach', 'City', 'Island', 'Nature', 'Cultural'];

  // Derived list
  const filtered = useMemo(() => {
    let list = allDestinations;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter(d => d.category === selectedCategory);
    }
    if (sortBy === 'priceAsc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'priceDesc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'ratingDesc') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [allDestinations, searchTerm, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetToFirstPage = (setter) => (v) => {
    setter(v);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">All Destinations</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Box className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border flex-1">
            <Search className="text-text-muted" />
            <TextField
              placeholder="Search by name, country, or description"
              variant="standard"
              fullWidth
              value={searchTerm}
              onChange={(e) => resetToFirstPage(setSearchTerm)(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
          </Box>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={selectedCategory || 'All'}
              onChange={(e) => resetToFirstPage(setSelectedCategory)(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="sortby-label">Sort by</InputLabel>
            <Select
              labelId="sortby-label"
              label="Sort by"
              value={sortBy}
              onChange={(e) => resetToFirstPage(setSortBy)(e.target.value)}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="priceAsc">Price: Low to High</MenuItem>
              <MenuItem value="priceDesc">Price: High to Low</MenuItem>
              <MenuItem value="ratingDesc">Rating: High to Low</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Featured chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allDestinations.filter(d => d.featured).map((d) => (
          <Chip key={d.id} label={`Featured: ${d.name}`} color="primary" variant="outlined" />
        ))}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="text-center text-text-muted py-20">No destinations match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((d) => (
            <div key={d.id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    // General-purpose fallback (Paris-safe and good for any broken image)
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                {d.featured && (
                  <div className="absolute top-3 right-3 bg-brand text-white px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{d.name}</h3>
                    <div className="flex items-center text-sm text-text-muted">
                      <LocationOn fontSize="inherit" className="mr-1" />
                      {d.country} • {d.duration}
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">₹{d.price.toLocaleString()}</div>
                </div>

                <p className="text-text-muted mt-2 line-clamp-2">{d.description}</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-amber-500">
                    <Star fontSize="small" />
                    <span className="ml-1 font-medium">{d.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex gap-2">
                    {d.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="bg-brand/10 text-brand text-xs px-2 py-1 rounded">{h}</span>
                    ))}
                  </div>
                </div>

                <button className="mt-4 w-full bg-brand text-white py-2 rounded-lg hover:bg-brand-dark transition-colors">
                  View Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <Pagination
          page={currentPage}
          count={totalPages}
          onChange={(_, p) => setCurrentPage(p)}
          color="primary"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default Destinations;