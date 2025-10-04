import React, { useState } from 'react';
import { Chip, TextField, MenuItem, Select, FormControl, InputLabel, Pagination } from '@mui/material';
import { Search, AccessTime, Star, LocalOffer } from '@mui/icons-material';

const Tours = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Enhanced tour data with more details
  const allTours = [
    {
      id: 1,
      name: '7-Day Swiss Alps Adventure',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Experience the breathtaking beauty of the Swiss Alps with our guided 7-day adventure tour through majestic mountains, crystal-clear lakes, and charming villages.',
      price: 120000,
      originalPrice: 150000,
      duration: '7 days',
      rating: 4.8,
      featured: true,
      highlights: ['Mountain hiking', 'Lake cruises', 'Chocolate tasting', 'Ski resorts'],
      inclusions: ['7 nights accommodation', 'Daily breakfast', 'Airport transfers', 'Professional guide'],
      difficulty: 'Moderate'
    },
    {
      id: 2,
      name: '10-Day Bali Beach Retreat',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Relax on the pristine beaches of Bali with our all-inclusive 10-day retreat package featuring luxury accommodations, cultural experiences, and water activities.',
      price: 95000,
      originalPrice: 120000,
      duration: '10 days',
      rating: 4.9,
      featured: true,
      highlights: ['Beachfront resorts', 'Temple visits', 'Rice terraces', 'Spa treatments'],
      inclusions: ['10 nights accommodation', 'All meals', 'Airport transfers', 'Spa treatments'],
      difficulty: 'Easy'
    },
    {
      id: 3,
      name: '5-Day Paris Cultural Tour',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Explore the romantic city of Paris with our guided 5-day cultural tour including the Eiffel Tower, Louvre Museum, and charming Montmartre district.',
      price: 110000,
      originalPrice: 130000,
      duration: '5 days',
      rating: 4.2,
      featured: false,
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River cruise'],
      inclusions: ['5 nights accommodation', 'Daily breakfast', 'Airport transfers', 'City tour'],
      difficulty: 'Easy'
    },
    {
      id: 4,
      name: '8-Day African Safari',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Witness the majestic wildlife of Africa on this unforgettable 8-day safari experience through the Maasai Mara National Reserve and Amboseli National Park.',
      price: 180000,
      originalPrice: 220000,
      duration: '8 days',
      rating: 4.7,
      featured: true,
      highlights: ['Wildlife viewing', 'Hot air balloon ride', 'Cultural visits', 'Luxury lodges'],
      inclusions: ['8 nights accommodation', 'All meals', 'Park fees', 'Professional guide'],
      difficulty: 'Challenging'
    },
    {
      id: 5,
      name: '6-Day Tokyo Exploration',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Immerse yourself in the vibrant culture and technology of Tokyo with our 6-day tour including visits to traditional temples, modern districts, and world-class restaurants.',
      price: 135000,
      originalPrice: 160000,
      duration: '6 days',
      rating: 4.5,
      featured: false,
      highlights: ['Shibuya Crossing', 'Traditional temples', 'Sushi making class', 'Bullet train ride'],
      inclusions: ['6 nights accommodation', 'Daily breakfast', 'Airport transfers', 'City tour'],
      difficulty: 'Easy'
    },
    {
      id: 6,
      name: '9-Day Greek Islands Cruise',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Discover the stunning beauty of the Greek islands with crystal clear waters, ancient ruins, and charming villages perched on cliffs during our 9-day cruise.',
      price: 110000,
      originalPrice: 140000,
      duration: '9 days',
      rating: 4.6,
      featured: false,
      highlights: ['Santorini sunset', 'Ancient ruins', 'Boat tours', 'Local cuisine'],
      inclusions: ['9 nights cruise', 'All meals', 'Excursions', 'Onboard activities'],
      difficulty: 'Easy'
    },
    // Indian tours
    {
      id: 7,
      name: '5-Day Golden Triangle Tour',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1564507593976-8a5f0f1d2b5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Experience the iconic Golden Triangle of India - Delhi, Agra, and Jaipur - with visits to the Taj Mahal, Red Fort, and Amber Fort.',
      price: 55000,
      originalPrice: 65000,
      duration: '5 days',
      rating: 4.8,
      featured: true,
      highlights: ['Taj Mahal', 'Red Fort', 'Amber Fort', 'Cultural shows'],
      inclusions: ['4 nights accommodation', 'All meals', 'Airport transfers', 'Professional guide'],
      difficulty: 'Easy'
    },
    {
      id: 8,
      name: '7-Day Kerala Backwaters & Beaches',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1566391564231-f7a7c5d6c5d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Discover the tranquil backwaters of Kerala with houseboat cruises, Ayurvedic treatments, and beautiful beaches of Kovalam and Varkala.',
      price: 65000,
      originalPrice: 75000,
      duration: '7 days',
      rating: 4.7,
      featured: true,
      highlights: ['Houseboat stay', 'Ayurvedic spa', 'Backwater cruises', 'Beach relaxation'],
      inclusions: ['6 nights accommodation', 'All meals', 'Airport transfers', 'Spa treatments'],
      difficulty: 'Easy'
    },
    {
      id: 9,
      name: '10-Day Rajasthan Royal Experience',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1599867907778-619b638b64f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Experience the royal heritage of Rajasthan with visits to magnificent palaces, forts, and vibrant markets in Jaipur, Udaipur, and Jodhpur.',
      price: 95000,
      originalPrice: 110000,
      duration: '10 days',
      rating: 4.9,
      featured: true,
      highlights: ['Amber Fort', 'City Palace', 'Lake Pichola', 'Desert safari'],
      inclusions: ['9 nights accommodation', 'All meals', 'Airport transfers', 'Cultural performances'],
      difficulty: 'Moderate'
    },
    {
      id: 10,
      name: '4-Day Goa Beach Holiday',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1565788422034-5f4d0c9a2a4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Enjoy the sun, sand, and nightlife of Goa with its beautiful beaches, Portuguese heritage, and vibrant culture.',
      price: 42000,
      originalPrice: 50000,
      duration: '4 days',
      rating: 4.5,
      featured: false,
      highlights: ['Beach parties', 'Water sports', 'Portuguese churches', 'Local markets'],
      inclusions: ['3 nights accommodation', 'Breakfast', 'Airport transfers', 'Water sports'],
      difficulty: 'Easy'
    }
  ];

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
    .filter(tour => 
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || tour.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTours = filteredTours.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="py-16 bg-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text animate-fade-in">Explore Our Tours</h1>
          <p className="text-text-muted max-w-2xl mx-auto animate-fade-in-delay">
            Discover our carefully crafted travel packages for unforgettable experiences
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-surface rounded-xl shadow-lg p-6 mb-12 animate-slide-in-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <TextField
                fullWidth
                label="Search tours"
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
        
        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedTours.map(tour => (
            <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover-card h-full flex flex-col">
              <div className="relative">
                <img 
                  src={tour.image} 
                  alt={tour.name} 
                  className="w-full h-60 object-cover img-hover"
                />
                {tour.featured && (
                  <div className="absolute top-4 right-4 bg-brand text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce-in">
                    Featured
                  </div>
                )}
                {tour.originalPrice > tour.price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center animate-bounce-in">
                    <LocalOffer className="mr-1" />
                    Save ₹{((tour.originalPrice - tour.price)/1000).toFixed(0)}k
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <AccessTime className="mr-1" />
                  {tour.duration}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{tour.name}</h3>
                  <div className="text-right">
                    {tour.originalPrice > tour.price && (
                      <span className="text-text-muted line-through text-sm">₹{tour.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-green-600 font-bold block">₹{tour.price.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-text-muted mb-2 flex-grow">{tour.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.slice(0, 2).map((highlight, index) => (
                    <span key={index} className="bg-brand/10 text-brand text-xs px-2 py-1 rounded hover-scale">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" />
                    <span className="text-text-muted">{tour.rating}</span>
                  </div>
                  <button className="bg-brand text-white px-4 py-2 rounded-lg transition-all duration-300 hover-brand">
                    Book Now
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
        
        {filteredTours.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <AccessTime className="text-brand w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-muted mb-2">No tours found</h3>
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

export default Tours;