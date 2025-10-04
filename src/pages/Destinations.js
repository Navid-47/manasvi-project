import React, { useState } from 'react';
import { Chip, TextField, MenuItem, Select, FormControl, InputLabel, Pagination } from '@mui/material';
import { Search, LocationOn, Star } from '@mui/icons-material';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Enhanced destination data with more details
  const allDestinations = [
    {
      id: 1,
      name: 'Swiss Alps',
      country: 'Switzerland',
      category: 'Mountain',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Experience the breathtaking beauty of the Swiss Alps with our guided tours through majestic mountains, crystal-clear lakes, and charming villages.',
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
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Relax on the pristine beaches of Bali with our all-inclusive package featuring luxury accommodations, cultural experiences, and water activities.',
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
      name: 'Paris City Tour',
      country: 'France',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Explore the romantic city of Paris with our guided city tours including the Eiffel Tower, Louvre Museum, and charming Montmartre district.',
      price: 110000,
      rating: 4.2,
      duration: '5 days',
      featured: false,
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River cruise'],
      bestTime: 'April to June, September to November',
      currency: 'EUR'
    },
    {
      id: 4,
      name: 'Safari Adventure',
      country: 'Kenya',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Witness the majestic wildlife of Africa on this unforgettable safari experience through the Maasai Mara National Reserve and Amboseli National Park.',
      price: 180000,
      rating: 4.7,
      duration: '8 days',
      featured: true,
      highlights: ['Wildlife viewing', 'Hot air balloon ride', 'Cultural visits', 'Luxury lodges'],
      bestTime: 'July to October',
      currency: 'KES'
    },
    {
      id: 5,
      name: 'Tokyo Exploration',
      country: 'Japan',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Immerse yourself in the vibrant culture and technology of Tokyo with visits to traditional temples, modern districts, and world-class restaurants.',
      price: 135000,
      rating: 4.5,
      duration: '6 days',
      featured: false,
      highlights: ['Shibuya Crossing', 'Traditional temples', 'Sushi making class', 'Bullet train ride'],
      bestTime: 'March to May, September to November',
      currency: 'JPY'
    },
    {
      id: 6,
      name: 'Greek Islands',
      country: 'Greece',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Discover the stunning beauty of the Greek islands with crystal clear waters, ancient ruins, and charming villages perched on cliffs.',
      price: 110000,
      rating: 4.6,
      duration: '9 days',
      featured: false,
      highlights: ['Santorini sunset', 'Ancient ruins', 'Boat tours', 'Local cuisine'],
      bestTime: 'May to October',
      currency: 'EUR'
    },
    // Indian destinations
    {
      id: 7,
      name: 'Taj Mahal & Agra',
      country: 'India',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1564507593976-8a5f0f1d2b5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Experience the architectural marvel of the Taj Mahal, one of the Seven Wonders of the World, along with other historical monuments in Agra.',
      price: 45000,
      rating: 4.8,
      duration: '3 days',
      featured: true,
      highlights: ['Taj Mahal sunrise view', 'Agra Fort', 'Local cuisine', 'Cultural performances'],
      bestTime: 'October to March',
      currency: 'INR'
    },
    {
      id: 8,
      name: 'Kerala Backwaters',
      country: 'India',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1566391564231-f7a7c5d6c5d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Experience the serene beauty of Kerala\'s backwaters with houseboat cruises, coconut palms, and traditional village life.',
      price: 55000,
      rating: 4.7,
      duration: '5 days',
      featured: true,
      highlights: ['Houseboat stay', 'Ayurvedic spa', 'Traditional meals', 'Village tours'],
      bestTime: 'October to April',
      currency: 'INR'
    },
    {
      id: 9,
      name: 'Rajasthan Royal Tour',
      country: 'India',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1599867907778-619b638b64f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Discover the royal heritage of Rajasthan with visits to magnificent palaces, forts, and vibrant markets in Jaipur, Udaipur, and Jodhpur.',
      price: 85000,
      rating: 4.9,
      duration: '7 days',
      featured: true,
      highlights: ['Amber Fort', 'City Palace', 'Lake Pichola', 'Desert safari'],
      bestTime: 'October to March',
      currency: 'INR'
    },
    {
      id: 10,
      name: 'Goa Beach Holidays',
      country: 'India',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1565788422034-5f4d0c9a2a4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Enjoy the sun, sand, and nightlife of Goa with its beautiful beaches, Portuguese heritage, and vibrant culture.',
      price: 48000,
      rating: 4.5,
      duration: '4 days',
      featured: false,
      highlights: ['Beach parties', 'Water sports', 'Portuguese churches', 'Local markets'],
      bestTime: 'November to February',
      currency: 'INR'
    }
  ];

  const categories = ['Mountain', 'Beach', 'City', 'Adventure', 'Cultural'];
  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  // Filter and sort destinations
  const filteredDestinations = allDestinations
    .filter(dest => 
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || dest.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDestinations = filteredDestinations.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="py-16 bg-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text animate-fade-in">Explore Destinations</h1>
          <p className="text-text-muted max-w-2xl mx-auto animate-fade-in-delay">
            Discover our carefully curated selection of the world's most beautiful destinations
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-surface rounded-xl shadow-lg p-6 mb-12 animate-slide-in-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <TextField
                fullWidth
                label="Search destinations"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: <Search className="text-text-muted" />
                }}
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            
            {/* Sort By */}
            <div>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value="">Default</MenuItem>
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          
          {/* Category Chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Chip 
              label="All" 
              onClick={() => {
                setSelectedCategory('');
                setCurrentPage(1);
              }} 
              variant={selectedCategory === '' ? "filled" : "outlined"}
              sx={{ 
                backgroundColor: selectedCategory === '' ? 'var(--brand)' : 'transparent',
                color: selectedCategory === '' ? 'white' : 'var(--text)',
                '&:hover': {
                  backgroundColor: selectedCategory === '' ? 'var(--brand-dark)' : 'rgba(0, 0, 0, 0.08)'
                },
                transition: 'all 0.3s ease'
              }}
            />
            {categories.map(category => (
              <Chip 
                key={category} 
                label={category} 
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }} 
                variant={selectedCategory === category ? "filled" : "outlined"}
                sx={{ 
                  backgroundColor: selectedCategory === category ? 'var(--brand)' : 'transparent',
                  color: selectedCategory === category ? 'white' : 'var(--text)',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? 'var(--brand-dark)' : 'rgba(0, 0, 0, 0.08)'
                  },
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedDestinations.map(destination => (
            <div key={destination.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover-card h-full flex flex-col">
              <div className="relative">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-60 object-cover img-hover"
                />
                {destination.featured && (
                  <div className="absolute top-4 right-4 bg-brand text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce-in">
                    Featured
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {destination.duration}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <p className="text-text-muted text-sm">{destination.country}</p>
                  </div>
                  <span className="text-green-600 font-bold">₹{destination.price.toLocaleString()}</span>
                </div>
                <p className="text-text-muted mb-4 flex-grow">{destination.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.slice(0, 3).map((highlight, index) => (
                    <span key={index} className="bg-brand/10 text-brand text-xs px-2 py-1 rounded hover-scale">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" />
                    <span className="text-text-muted">{destination.rating}</span>
                  </div>
                  <button className="bg-brand text-white px-4 py-2 rounded-lg transition-all duration-300 hover-brand">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-12 animate-fade-in">
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'var(--text)',
                  transition: 'all 0.3s ease'
                },
                '& .Mui-selected': {
                  backgroundColor: 'var(--brand)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--brand-dark)',
                  }
                }
              }}
            />
          </div>
        )}
        
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <LocationOn className="text-brand w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-muted mb-2">No destinations found</h3>
            <p className="text-text-muted">Try adjusting your search or filter criteria</p>
            <button 
              className="mt-6 bg-brand text-white px-6 py-3 rounded-lg transition-all duration-300 hover-brand"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSortBy('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;