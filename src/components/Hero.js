import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  color: theme.palette.common.white,
  margin: 0,
  padding: '40px 0 0', // Further reduced top padding to move content higher
  background: theme.palette.primary.main, // Fallback background color
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(15, 32, 39, 0.85) 0%, rgba(32, 58, 67, 0.85) 50%, rgba(44, 83, 100, 0.85) 100%)',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'var(--hero-bg-image)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    zIndex: 0,
    height: '100%',
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(2, 2, 2), // Further reduced padding to move content up
  textAlign: 'center',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '1000px',
  margin: '5% auto 0', // Added top margin to bring content higher
  width: '90%',
  animation: 'fadeInUp 1s ease-out',
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2, 4, 2), // Further reduced vertical padding
    marginTop: '0', // Removed top margin to move content higher
  },
  '& h1': {
    fontSize: '3.5rem',
    fontWeight: 800,
    marginBottom: theme.spacing(2),
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    },
  },
  '& h6': {
    fontSize: '1.5rem',
    fontWeight: 400,
    marginBottom: theme.spacing(4),
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
  },
}));

const CarouselIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(8),
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3,
  display: 'flex',
  gap: theme.spacing(1),
}));

const IndicatorDot = styled(Box)(({ theme, active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    transform: 'scale(1.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    '&::before': {
      transform: 'translateX(100%)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, var(--accent) 0%, var(--accent-dark) 100%)',
    zIndex: -1,
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateX(-100%)',
  },
}));

const Hero = ({ title, subtitle, ctaText, ctaLink }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const heroImages = useMemo(() => [
    {
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      title: 'Discover Amazing Destinations',
      subtitle: 'Experience the world with our curated travel packages and unforgettable adventures'
    },
    {
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80',
      title: 'Tropical Beaches',
      subtitle: 'Relax in paradise with our exclusive beach resort packages'
    },
    {
      url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80',
      title: 'Cultural Cities',
      subtitle: 'Explore vibrant cultures and historical landmarks around the globe'
    },
    {
      url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80',
      title: 'Wildlife Adventures',
      subtitle: 'Witness nature\'s wonders with our expert-guided wildlife tours'
    }
  ], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--hero-bg-image', `url('${heroImages[currentImageIndex].url}')`);
  }, [currentImageIndex, heroImages]);

  const handleIndicatorClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <HeroSection>
      <HeroContent>
        <Typography
          variant={isMobile ? 'h3' : 'h2'}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            lineHeight: 1.2,
            animation: 'fadeIn 0.8s ease-in-out',
          }}
        >
          {heroImages[currentImageIndex].title}
        </Typography>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          paragraph
          sx={{
            mb: 4,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            opacity: 0.9,
            animation: 'fadeIn 0.8s ease-in-out',
          }}
        >
          {heroImages[currentImageIndex].subtitle}
        </Typography>
        <StyledButton
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to={ctaLink}
          sx={{
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.8s ease-in-out',
          }}
        >
          {ctaText}
        </StyledButton>
      </HeroContent>
      
      {/* Carousel Indicators */}
      <CarouselIndicator>
        {heroImages.map((_, index) => (
          <IndicatorDot
            key={index}
            active={index === currentImageIndex}
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </CarouselIndicator>
      
      <Box 
        sx={{
          position: 'absolute',
          bottom: '100px',
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
    </HeroSection>
  );
};

export default Hero;