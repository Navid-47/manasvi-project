import React, { useState } from 'react';
import { Chip, TextField, MenuItem, Select, FormControl, InputLabel, Pagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import PackageCard from '../../components/PackageCard';
import { useFetchPackages } from '../../hooks/useFetchPackages';

const Tours = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
      return matchesSearch && matchesCategory;
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

        {/* Loading & error states */}
        {loading && !error && (
          <Loader label="Loading tours..." />
        )}

        {error && !loading && (
          <div className="text-center text-red-500 py-8">
            Failed to load tours. Please try again.
          </div>
        )}

        {/* Tours Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedTours.map((tour) => (
              <div key={tour.id} className="h-full flex flex-col">
                <PackageCard
                  pkg={tour}
                  onBook={(pkg) => {
                    const id = pkg?.id;
                    if (id != null) {
                      navigate(`/tours/${id}`);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
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

        {!loading && !error && filteredTours.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
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