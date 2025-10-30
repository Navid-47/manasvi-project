// src/pages/user/DashboardHome.js
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Grow,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const mockStats = {
  totalBookings: 5,
  upcomingTrips: 2,
  totalSpent: 125000,
};

export default function DashboardHome() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Bookings', value: mockStats.totalBookings },
    { title: 'Upcoming Trips', value: mockStats.upcomingTrips },
    { title: 'Total Spent', value: `₹${mockStats.totalSpent.toLocaleString()}` },
  ];

  const upcomingCards = [
    {
      title: 'Beach Bliss',
      destination: 'Goa, India',
      date: '20 Dec 2025',
      image:
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200',
    },
    {
      title: 'Beach Bliss',
      destination: 'Goa, India',
      date: '20 Dec 2025',
      image:
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200',
    },
    {
      title: 'Desert Adventure',
      destination: 'Jaisalmer, India',
      date: '10 Jan 2026',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    },
    {
      title: 'Desert Adventure',
      destination: 'Jaisalmer, India',
      date: '10 Jan 2026',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Fade in timeout={400}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: 'var(--text)',
            textAlign: 'center',
          }}
        >
          Welcome back, Traveler!
        </Typography>
      </Fade>

      {/* Stats Section */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} md={4} key={stat.title}>
            <Grow in timeout={400 + i * 120}>
              <Card
                sx={{
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Trips Bar */}
      <Grow in timeout={500}>
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            backgroundColor: '#1976d2',
            color: '#fff',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Upcoming Trips
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/user-dashboard/bookings')}
            sx={{
              backgroundColor: '#51F2D9',
              color: '#000000',
              textTransform: 'none',
              '&:hover': { filter: 'brightness(0.95)' },
            }}
          >
            View My Bookings
          </Button>
        </Box>
      </Grow>

      {/* Upcoming Trips Grid (Static Cards) */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {upcomingCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={`${card.title}-${i}`}>
            <Grow in timeout={400 + i * 120}>
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: 250,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.01)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={card.image}
                  alt={card.title}
                  sx={{ filter: 'brightness(0.85)' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    p: 2,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: '#fff',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2">{card.destination}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Travel Date: {card.date}
                  </Typography>
                </Box>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}