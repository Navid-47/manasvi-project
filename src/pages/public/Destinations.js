import React, { useMemo, useState, useEffect } from 'react';
import { Chip, TextField, MenuItem, Select, FormControl, InputLabel, Pagination, Box } from '@mui/material';
import { Search, LocationOn, Star } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

// Data: Famous tourism destinations
const DESTINATIONS_DATA = [
  {
    id: 1,
    name: 'Swiss Alps',
    country: 'Switzerland',
    category: 'Mountain',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'
    ],
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
    image: 'https://images.unsplash.com/photo-1566073771259-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518544801976-3a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508182311256-e3f7d50b9b64?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
    ],
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
    image: 'https://images.unsplash.com/photo-1543349689-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518544801976-3a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508182311256-e3f7d50b9b64?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Whitewashed cliffs and magical sunsets over the Aegean.',
    price: 105000,
    rating: 4.6,
    duration: '6 days',
    featured: true,
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
    images: [
      'https://images.unsplash.com/photo-1491884662610-dfcd28f30cf5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505063342033-7e7f28a1e1b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1498654200943-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e6389?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Neon lights, ancient temples, and cutting-edge technology.',
    price: 135000,
    rating: 4.8,
    duration: '8 days',
    featured: false,
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Market'],
    bestTime: 'March to May, Sep to Nov',
    currency: 'JPY'
  },
  {
    id: 6,
    name: 'New York City',
    country: 'USA',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1492666673288-3c4e9d5b3e4a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1499092346589-2f6d0f0c5b8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499092346589-2f6d0f0c5b8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499092346589-2f6d0f0c5b8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499092346589-2f6d0f0c5b8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499092346589-2f6d0f0c5b8b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The city that never sleeps, with iconic landmarks and diverse culture.',
    price: 150000,
    rating: 4.7,
    duration: '5 days',
    featured: true,
    highlights: ['Statue of Liberty', 'Times Square', 'Central Park'],
    bestTime: 'April to June, Sep to Nov',
    currency: 'USD'
  },
  {
    id: 7,
    name: 'Safari in Serengeti',
    country: 'Tanzania',
    category: 'Wildlife',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Experience the great migration and witness the big five in their natural habitat.',
    price: 180000,
    rating: 4.9,
    duration: '7 days',
    featured: true,
    highlights: ['Great Migration', 'Hot Air Balloon Safari', 'Ngorongoro Crater'],
    bestTime: 'June to October',
    currency: 'USD'
  }
];

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const itemsPerPage = 6;

  // Get category from URL if present
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
    setCurrentPage(1);
  }, [searchParams]);

  // Memoize the destinations data to prevent recreation on every render
  const allDestinations = useMemo(() => DESTINATIONS_DATA, []);

  // Filter and sort destinations
  const filtered = useMemo(() => {
    let result = [...allDestinations];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.country.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term) ||
          d.highlights.some((h) => h.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((d) => d.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }

    return result;
  }, [allDestinations, searchTerm, selectedCategory, sortBy]);

  // Get current items for pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  // Get unique categories
  const categories = useMemo(
    () => ['All', ...new Set(DESTINATIONS_DATA.map((d) => d.category))],
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Search destinations"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Destinations Grid */}
      {currentItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <p>No destinations found. Try adjusting your search or filters.</p>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {currentItems.map((destination) => (
            <Box 
              key={destination.id}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <Box 
                component="img"
                src={destination.image}
                alt={destination.name}
                sx={{ 
                  width: '100%', 
                  height: 200, 
                  objectFit: 'cover' 
                }}
              />
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <h3 style={{ margin: 0 }}>{destination.name}</h3>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                    <span>{destination.rating}</span>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                  <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                  <span>{destination.country}</span>
                </Box>
                <p style={{ color: 'text.secondary', margin: '8px 0' }}>
                  {destination.description}
                </p>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {destination.highlights.slice(0, 3).map((highlight, i) => (
                    <Chip 
                      key={i} 
                      label={highlight} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 2,
                  pt: 1,
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <Box>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                      ${destination.price.toLocaleString()}
                    </span>
                    <span style={{ color: 'text.secondary', fontSize: '0.875rem' }}> / person</span>
                  </Box>
                  <span style={{ color: 'text.secondary' }}>{destination.duration}</span>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default Destinations;
