import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Paper,
  Grid,
  MenuItem,
  TextField,
  Divider,
  Fade,
} from '@mui/material';
import { getAllBookings } from '../../services/bookingService';

function SimpleBarChart({ data, maxHeight = 160 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: maxHeight }}>
      {data.map(d => (
        <Box key={d.label} sx={{ flex: 1, textAlign: 'center' }}>
          <Box sx={{ background: '#1976d2', height: `${(d.value / max) * 100}%`, borderRadius: 1 }} />
          <Typography variant="caption" color="text.secondary">{d.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function SimpleLineChart({ points, height = 160 }) {
  const max = Math.max(...points.map(p => p.value), 1);
  const svgPoints = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - (p.value / max) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <Box sx={{ width: '100%', height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height={height}>
        <polyline points={svgPoints} fill="none" stroke="#1976d2" strokeWidth="2" />
      </svg>
    </Box>
  );
}

export default function SalesAnalytics({ standalone = true }) {
  const bookings = getAllBookings();
  const [range, setRange] = React.useState('30');

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - Number(range));

  const inRange = bookings.filter(b => new Date(b.createdAt) >= start);
  const confirmed = inRange.filter(b => b.status === 'Confirmed');

  const revenueByDayMap = new Map();
  confirmed.forEach(b => {
    const key = new Date(b.createdAt).toISOString().slice(0,10);
    revenueByDayMap.set(key, (revenueByDayMap.get(key) || 0) + (b.amount || 0));
  });
  const dayKeys = Array.from({ length: Number(range) + 1 }).map((_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    return d.toISOString().slice(0,10);
  });
  const revenueSeries = dayKeys.map(k => ({ label: k.slice(5), value: revenueByDayMap.get(k) || 0 }));

  const destinationCounts = inRange.reduce((acc, b) => {
    acc[b.destination] = (acc[b.destination] || 0) + 1;
    return acc;
  }, {});
  const topDestBars = Object.entries(destinationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const totalInRange = inRange.length;
  const totalConfirmed = confirmed.length;
  const conversionRate = totalInRange ? Math.round((totalConfirmed / totalInRange) * 100) : 0;
  const totalRevenue = confirmed.reduce((s, b) => s + (b.amount || 0), 0);

  const revenueByPackage = confirmed.reduce((acc, b) => {
    const key = b.packageName || b.destination || 'Package';
    acc[key] = (acc[key] || 0) + (b.amount || 0);
    return acc;
  }, {});
  const topPackageBars = Object.entries(revenueByPackage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const revenueByCustomer = confirmed.reduce((acc, b) => {
    const key = b.userEmail || b.customer || 'Customer';
    acc[key] = (acc[key] || 0) + (b.amount || 0);
    return acc;
  }, {});
  const topCustomerBars = Object.entries(revenueByCustomer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--bg)' }}>
      {standalone && (
        <>
          <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
                Sales Analytics
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      )}

      <Box sx={{ p: 3 }}>
        <Fade in timeout={300}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.06)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Range (days)" value={range} onChange={(e) => setRange(e.target.value)}>
                {[7, 30, 90].map(n => <MenuItem key={n} value={String(n)}>{n} days</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}><Paper sx={{ p: 1, borderRadius: '16px', border: '1px solid var(--border)' }}><Typography color="text.secondary">Revenue</Typography><Typography variant="h6">₹{totalRevenue.toLocaleString()}</Typography></Paper></Grid>
                <Grid item xs={6} md={3}><Paper sx={{ p: 1, borderRadius: '16px', border: '1px solid var(--border)' }}><Typography color="text.secondary">Bookings</Typography><Typography variant="h6">{totalInRange}</Typography></Paper></Grid>
                <Grid item xs={6} md={3}><Paper sx={{ p: 1, borderRadius: '16px', border: '1px solid var(--border)' }}><Typography color="text.secondary">Confirmed</Typography><Typography variant="h6">{totalConfirmed}</Typography></Paper></Grid>
                <Grid item xs={6} md={3}><Paper sx={{ p: 1, borderRadius: '16px', border: '1px solid var(--border)' }}><Typography color="text.secondary">Conversion</Typography><Typography variant="h6">{conversionRate}%</Typography></Paper></Grid>
              </Grid>
            </Grid>
          </Grid>
          </Paper>
        </Fade>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Fade in timeout={350}>
              <Paper sx={{ p: 2, borderRadius: '20px', border: '1px solid var(--border)' }}>
              <Typography variant="h6">Revenue by Day</Typography>
              <Divider sx={{ my: 1 }} />
              <SimpleLineChart points={revenueSeries} />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {revenueSeries.filter((_, i) => i % Math.ceil(revenueSeries.length / 8) === 0).map(p => (
                  <Typography key={p.label} variant="caption" color="text.secondary">{p.label}</Typography>
                ))}
              </Box>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={4}>
            <Fade in timeout={400}>
              <Paper sx={{ p: 2, borderRadius: '20px', border: '1px solid var(--border)' }}>
              <Typography variant="h6">Top Destinations</Typography>
              <Divider sx={{ my: 1 }} />
              {topDestBars.length === 0 ? (
                <Typography color="text.secondary">No data</Typography>
              ) : (
                <SimpleBarChart data={topDestBars} />
              )}
              </Paper>
            </Fade>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Fade in timeout={420}>
              <Paper sx={{ p: 2, borderRadius: '20px', border: '1px solid var(--border)' }}>
              <Typography variant="h6">Top Packages (by revenue)</Typography>
              <Divider sx={{ my: 1 }} />
              {topPackageBars.length === 0 ? (
                <Typography color="text.secondary">No data</Typography>
              ) : (
                <SimpleBarChart data={topPackageBars} />
              )}
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade in timeout={450}>
              <Paper sx={{ p: 2, borderRadius: '20px', border: '1px solid var(--border)' }}>
              <Typography variant="h6">Top Customers (by revenue)</Typography>
              <Divider sx={{ my: 1 }} />
              {topCustomerBars.length === 0 ? (
                <Typography color="text.secondary">No data</Typography>
              ) : (
                <SimpleBarChart data={topCustomerBars} />
              )}
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}


