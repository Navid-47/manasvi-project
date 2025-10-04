import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.common.white,
  '&::before': {
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
    opacity: 0.4,
    zIndex: 1,
    transition: 'opacity 1s ease-in-out',
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(8, 2),
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 2),
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

const Hero = ({ title, subtitle, ctaText, ctaLink }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Carousel images wrapped in useMemo to prevent re-creation on every render
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

  // Update CSS variable for background image
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
        <Button
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
        </Button>
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
    </HeroSection>
  );
};

export default Hero;