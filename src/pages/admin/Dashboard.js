import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Fade,
  Grow,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);
  return [value, setValue];
}

function getSeededData() {
  // Seed minimal data for first-time dashboard view
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now);
    d.setMonth(now.getMonth() - (5 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  return {
    bookings: [
      { id: 'B-1006', customer: 'Aarav Shah', status: 'Confirmed', amount: 1299, createdAt: new Date().toISOString() },
      { id: 'B-1005', customer: 'Isha Verma', status: 'Pending', amount: 799, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'B-1004', customer: 'Rohan Mehta', status: 'Cancelled', amount: 0, createdAt: new Date(Date.now() - 2*86400000).toISOString() },
      { id: 'B-1003', customer: 'Neha Gupta', status: 'Confirmed', amount: 1599, createdAt: new Date(Date.now() - 4*86400000).toISOString() },
    ],
    revenueSeries: months.map((m, idx) => ({ month: m, revenue: 8000 + idx * 1200 + (idx % 2 ? 500 : -300) })),
    packages: [
      { id: 'P-2003', name: 'Goa Getaway', price: 499, active: true },
      { id: 'P-2002', name: 'Himalayan Trek', price: 899, active: true },
      { id: 'P-2001', name: 'Rajasthan Heritage', price: 699, active: false },
    ],
  };
}

function MiniAreaChart({ series }) {
  const max = Math.max(...series.map(p => p.revenue), 1);
  const points = series.map((p, i) => {
    const x = (i / (series.length - 1)) * 100;
    const y = 100 - (p.revenue / max) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <Box sx={{ width: '100%', height: 60 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="60">
        <polyline points={points} fill="none" stroke="#1976d2" strokeWidth="3" />
      </svg>
    </Box>
  );
}

export default function AdminDashboard({ standalone = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const loginSuccess = location.state?.loginSuccess;
  const userName = location.state?.userName || 'Admin';

  const [seeded] = React.useState(() => getSeededData());
  const [bookings] = useLocalStorage('admin_bookings', seeded.bookings);
  const [packages] = useLocalStorage('admin_packages', seeded.packages);
  const [revenueSeries] = useLocalStorage('admin_revenue_series', seeded.revenueSeries);

  const totalRevenue = bookings.filter(b => b.status === 'Confirmed').reduce((s, b) => s + (b.amount || 0), 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activePackages = packages.filter(p => p.active).length;

  const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--bg)' }}>
      {standalone && (
        <>
          <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
                Admin Dashboard
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      )}

      <Box sx={{ p: 3 }}>
        <Fade in timeout={300}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Welcome, {userName}</Typography>
            <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>Manage packages, bookings, reports, and analytics at a glance.</Typography>
          </Box>
        </Fade>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Grow in timeout={400}>
              <Paper onClick={() => navigate('/admin-dashboard/payments')} sx={{ cursor: 'pointer', p: 2, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } }}>
              <Typography color="text.secondary">Total Revenue</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>₹{totalRevenue.toLocaleString()}</Typography>
              <MiniAreaChart series={revenueSeries} />
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grow in timeout={520}>
              <Paper onClick={() => navigate('/admin-dashboard/bookings')} sx={{ cursor: 'pointer', p: 2, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } }}>
              <Typography color="text.secondary">Bookings</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{bookings.length}</Typography>
              <Typography variant="body2" color="text.secondary">{pendingCount} pending</Typography>
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grow in timeout={640}>
              <Paper onClick={() => navigate('/admin-dashboard/packages')} sx={{ cursor: 'pointer', p: 2, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } }}>
              <Typography color="text.secondary">Active Packages</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{activePackages}</Typography>
              <Typography variant="body2" color="text.secondary">{packages.length} total</Typography>
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grow in timeout={760}>
              <Paper onClick={() => navigate('/admin-dashboard/analytics')} sx={{ cursor: 'pointer', p: 2, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } }}>
              <Typography color="text.secondary">Avg. Order Value</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>₹{(bookings.length ? Math.round(totalRevenue / Math.max(1, bookings.filter(b=>b.status==='Confirmed').length)) : 0).toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">confirmed only</Typography>
              </Paper>
            </Grow>
          </Grid>

          <Grid item xs={12}>
            <Fade in timeout={350}>
              <Paper sx={{ p: 0, mb: 2, borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Box
                  sx={{
                    height: 160,
                    background: 'linear-gradient(135deg, #1976d2 0%, #51F2D9 100%)',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    alt="decor"
                    src={'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.2"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></linearGradient></defs><rect width="800" height="160" fill="url(%23g)"/></svg>'}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6 }}
                  />
                </Box>
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} md={7}>
            <Fade in timeout={400}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6">Revenue (Last 6 months)</Typography>
                <Chip label="INR" size="small" />
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: '100%', height: 180 }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="180">
                  {revenueSeries.map((point, idx) => {
                    const max = Math.max(...revenueSeries.map(p => p.revenue), 1);
                    const x = (idx / (revenueSeries.length - 1)) * 100;
                    const y = 100 - (point.revenue / max) * 100;
                    return <circle key={point.month} cx={x} cy={y} r={1.5} fill="#1976d2" />
                  })}
                  <polyline
                    points={revenueSeries.map((p, i) => {
                      const max = Math.max(...revenueSeries.map(pp => pp.revenue), 1);
                      const x = (i / (revenueSeries.length - 1)) * 100;
                      const y = 100 - (p.revenue / max) * 100;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth="2"
                  />
                </svg>
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                {revenueSeries.map(p => (
                  <Typography key={p.month} variant="caption" color="text.secondary">{p.month}</Typography>
                ))}
              </Stack>
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} md={5}>
            <Fade in timeout={500}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Recent Bookings</Typography>
              <Divider />
              <List dense>
                {recent.map(b => (
                  <ListItem key={b.id}>
                    <ListItemText
                      primary={`${b.id} • ₹${b.amount}`}
                      secondary={`${b.customer} • ${new Date(b.createdAt).toLocaleDateString()} • ${b.status}`}
                    />
                  </ListItem>
                ))}
              </List>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={!!loginSuccess} autoHideDuration={3000}>
        <Alert severity="success" variant="filled">
          Login Successful — Welcome back, {userName}!
        </Alert>
      </Snackbar>
    </Box>
  );
}

