import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  IconButton,
  Chip,
  Rating,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  AccessTime as DurationIcon,
  People as PeopleIcon,
  AttachMoney as PriceIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

// Sample data - replace with API call
const SAMPLE_DESTINATION = {
  id: 1,
  title: 'Bali, Indonesia',
  description: 'Bali is a living postcard, an Indonesian paradise that feels like a fantasy. This magical place offers a perfect blend of culture, adventure, and relaxation. With its iconic rice terraces, ancient temples, stunning beaches, and vibrant nightlife, Bali has something for everyone.',
  longDescription: 'Bali is more than just a destination; it\'s a mood, an aspiration, and a tropical state of mind. Known as the Island of the Gods, Bali is a paradise that offers something for every type of traveler. From the spiritual heart of Ubud to the surf spots of Canggu, the luxury resorts of Nusa Dua, and the party scene in Seminyak, Bali delivers a perfect mix of culture, nature, and modern comforts.\n\nThe island is famous for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. The cultural landscape is equally impressive, with thousands of temples, traditional dances, and ceremonies that are an integral part of daily life. Whether you\'re seeking adventure, relaxation, or cultural immersion, Bali promises an unforgettable experience.',
  image: 'https://source.unsplash.com/random/1200x600/?bali',
  images: [
    'https://source.unsplash.com/random/400x300/?bali1',
    'https://source.unsplash.com/random/400x300/?bali2',
    'https://source.unsplash.com/random/400x300/?bali3',
    'https://source.unsplash.com/random/400x300/?bali4',
  ],
  price: 1200,
  rating: 4.8,
  reviewCount: 1245,
  duration: '7 days',
  groupSize: '2-10 people',
  difficulty: 'Moderate',
  availability: 'Year-round',
  highlights: [
    'Visit ancient temples and experience local ceremonies',
    'Explore the iconic Tegalalang Rice Terraces',
    'Relax on stunning beaches like Kuta and Seminyak',
    'Experience Balinese culture and cuisine',
    'Enjoy water sports and outdoor activities',
  ],
  included: [
    '6 nights accommodation',
    'Airport transfers',
    'Daily breakfast',
    'Guided tours',
    'Entrance fees',
    'Local transportation',
  ],
  notIncluded: [
    'International flights',
    'Travel insurance',
    'Personal expenses',
    'Visa fees',
  ],
  isFavorite: false,
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [mainImage, setMainImage] = useState('');
  
  // Simulate API call
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDestination({
          ...SAMPLE_DESTINATION,
          id: id || 1,
        });
        setMainImage(SAMPLE_DESTINATION.image);
      } catch (error) {
        console.error('Error fetching destination:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = () => {
    setDestination(prev => ({
      ...prev,
      isFavorite: !prev.isFavorite
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!destination) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Destination not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/destinations')}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Destinations
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Box
              component="img"
              src={mainImage || destination.image}
              alt={destination.title}
              sx={{
                width: '100%',
                height: { xs: 300, md: 500 },
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          </Paper>
          
          {/* Thumbnail Gallery */}
          <Grid container spacing={1} sx={{ mb: 4 }}>
            {[destination.image, ...destination.images].slice(0, 4).map((img, index) => (
              <Grid item key={index} xs={3}>
                <Box
                  component="img"
                  src={img}
                  alt={`${destination.title} ${index + 1}`}
                  onClick={() => setMainImage(img)}
                  sx={{
                    width: '100%',
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    opacity: mainImage === img ? 1 : 0.7,
                    transition: 'opacity 0.3s',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Tabs */}
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'wrap',
                },
              }}
            >
              <Tab label="Overview" />
              <Tab label="Itinerary" />
              <Tab label="Included" />
              <Tab label="Reviews" />
              <Tab label="FAQs" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" gutterBottom>About {destination.title}</Typography>
              <Typography variant="body1" paragraph>
                {destination.longDescription || destination.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>Highlights</Typography>
              <ul>
                {destination.highlights.map((highlight, index) => (
                  <li key={index}>
                    <Typography variant="body1">{highlight}</Typography>
                  </li>
                ))}
              </ul>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" gutterBottom>Itinerary</Typography>
              <Typography variant="body1" color="textSecondary">
                Detailed itinerary will be provided upon booking.
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>What's Included</Typography>
                  <ul>
                    {destination.included.map((item, index) => (
                      <li key={`included-${index}`}>
                        <Typography variant="body1">{item}</Typography>
                      </li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Not Included</Typography>
                  <ul>
                    {destination.notIncluded.map((item, index) => (
                      <li key={`not-included-${index}`}>
                        <Typography variant="body1">{item}</Typography>
                      </li>
                    ))}
                  </ul>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <Rating value={destination.rating} readOnly precision={0.1} />
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 'medium' }}>
                  {destination.rating} ({destination.reviewCount} reviews)
                </Typography>
              </Box>
              <Typography variant="body1" color="textSecondary">
                Reviews will be displayed here.
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" gutterBottom>Frequently Asked Questions</Typography>
              <Typography variant="body1" color="textSecondary">
                Common questions and answers will be displayed here.
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Right Column - Booking */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h5" component="h1" gutterBottom>
                  {destination.title}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {destination.title}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Rating value={destination.rating} readOnly precision={0.5} size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {destination.rating} ({destination.reviewCount} reviews)
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={toggleFavorite} color={destination.isFavorite ? 'error' : 'default'}>
                <FavoriteBorderIcon color={destination.isFavorite ? 'error' : 'action'} />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Price */}
            <Box mb={3}>
              <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                ${destination.price.toLocaleString()}
                <Typography component="span" variant="body1" color="text.secondary">
                  {' '}per person
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                + ${Math.round(destination.price * 0.1).toLocaleString()} taxes & fees
              </Typography>
            </Box>

            {/* Quick Info */}
            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarIcon color="action" fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Duration:</strong> {destination.duration}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon color="action" fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Group Size:</strong> {destination.groupSize}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <DurationIcon color="action" fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Availability:</strong> {destination.availability}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              disableElevation
              sx={{
                mb: 2,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
                  background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%) !important',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.15)'
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/book-now')}
            >
              Book Now
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              color="primary"
              sx={{ py: 1.5, fontWeight: 'medium' }}
              onClick={() => {}}
            >
              Contact Us
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Free cancellation up to 30 days before departure
              </Typography>
            </Box>
          </Paper>

          {/* Why Book With Us */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Why Book With Us?</Typography>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li><Typography variant="body2">Best Price Guarantee</Typography></li>
              <li><Typography variant="body2">No Booking Fees</Typography></li>
              <li><Typography variant="body2">24/7 Customer Support</Typography></li>
              <li><Typography variant="body2">Flexible Booking Options</Typography></li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DestinationDetails;
