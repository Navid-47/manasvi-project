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
import { useAuth } from '../../context/AuthContext';
import { getAllBookings } from '../../services/bookingService';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const allBookings = getAllBookings();
  const email = user?.email;
  const userBookings = email ? allBookings.filter((b) => b.userEmail === email) : allBookings;

  const totalBookings = userBookings.length;
  const confirmed = userBookings.filter((b) => b.status === 'Confirmed');
  const totalSpent = confirmed.reduce((sum, b) => sum + (b.amount || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;

  const upcoming = confirmed
    .map((b) => {
      const rawDate = b.travelDate || b.createdAt;
      if (!rawDate) return null;
      const tripDate = new Date(rawDate);
      if (Number.isNaN(tripDate.getTime())) return null;
      tripDate.setHours(0, 0, 0, 0);
      const daysUntil = Math.round((tripDate.getTime() - today.getTime()) / dayMs);
      return {
        id: b.id,
        packageName: b.packageName || 'Travel Package',
        destination: b.destination || '',
        date: tripDate.toLocaleDateString(),
        daysUntil,
      };
    })
    .filter((x) => x && x.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const stats = [
    { title: 'Total Bookings', value: totalBookings },
    { title: 'Upcoming Trips', value: upcoming.length },
    { title: 'Total Spent', value: `₹${totalSpent.toLocaleString()}` },
  ];

  const defaultImage =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200';
  const upcomingCards = upcoming.slice(0, 4).map((b) => ({
    id: b.id,
    title: b.packageName,
    destination: b.destination,
    date: b.date,
    daysUntil: b.daysUntil,
    image: defaultImage,
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
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
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Grow in timeout={400 + i * 120}>
              <Card
                sx={{
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
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
            borderRadius: 'var(--radius)',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
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

      {/* Upcoming Trips Grid (user bookings) */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {upcomingCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={`${card.title}-${i}`}>
            <Grow in timeout={400 + i * 120}>
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  height: 240,
                  boxShadow: '0 6px 14px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.14)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
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
                  {typeof card.daysUntil === 'number' && card.daysUntil >= 0 && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {card.daysUntil === 0
                        ? 'Trip is today'
                        : `Trip in ${card.daysUntil} day(s)`}
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}