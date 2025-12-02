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
import { getAllBookings } from '../../services/bookingService';
import { getAllPackages } from '../../services/packageService';

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

function buildRevenueSeries(bookings) {
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now);
    d.setMonth(now.getMonth() - (5 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const totals = months.reduce((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {});

  bookings.forEach((b) => {
    if (b.status !== 'Confirmed' || !b.createdAt) return;
    const d = new Date(b.createdAt);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (Object.prototype.hasOwnProperty.call(totals, key)) {
      totals[key] += Number(b.amount) || 0;
    }
  });

  return months.map((m) => ({ month: m, revenue: totals[m] || 0 }));
}

export default function AdminDashboard({ standalone = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const loginSuccess = location.state?.loginSuccess;
  const userName = location.state?.userName || 'Admin';

  const bookings = getAllBookings();
  const packages = getAllPackages();
  const revenueSeries = buildRevenueSeries(bookings);

  const totalRevenue = bookings.filter(b => b.status === 'Confirmed').reduce((s, b) => s + (b.amount || 0), 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activePackages = packages.filter(p => p.active).length;

  const recent = [...bookings]
    .filter((b) => b.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const revenueByPackageId = confirmedBookings.reduce((acc, b) => {
    const pkgId = b.packageId || b.package_id || b.package || 'unknown';
    const amount = Number(b.amount) || 0;
    if (!acc[pkgId]) {
      acc[pkgId] = { id: pkgId, revenue: 0, count: 0 };
    }
    acc[pkgId].revenue += amount;
    acc[pkgId].count += 1;
    return acc;
  }, {});
  const packagesById = new Map((packages || []).map((p) => [String(p.id), p]));
  const topPackages = Object.values(revenueByPackageId)
    .map((entry) => {
      const pkgMeta = packagesById.get(String(entry.id));
      return {
        id: entry.id,
        name: pkgMeta?.name || pkgMeta?.title || entry.id || 'Travel Package',
        revenue: entry.revenue,
        count: entry.count,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

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

      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Fade in timeout={300}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Welcome, {userName}</Typography>
            <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>Manage packages, bookings, reports, and analytics at a glance.</Typography>
          </Box>
        </Fade>

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={400}>
              <Paper
                onClick={() => navigate('/admin-dashboard/payments')}
                sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  minHeight: { xs: 140, sm: 150, md: 160 },
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.14)' },
                }}
              >
              <Typography color="text.secondary">Total Revenue</Typography>
              <Typography sx={{ fontWeight: 800, color: 'var(--brand)', fontSize: { xs: '1.35rem', md: '1.6rem' } }}>₹{totalRevenue.toLocaleString()}</Typography>
              <MiniAreaChart series={revenueSeries} />
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={520}>
              <Paper
                onClick={() => navigate('/admin-dashboard/bookings')}
                sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  minHeight: { xs: 140, sm: 150, md: 160 },
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.14)' },
                }}
              >
              <Typography color="text.secondary">Bookings</Typography>
              <Typography sx={{ fontWeight: 800, color: 'var(--brand)', fontSize: { xs: '1.35rem', md: '1.6rem' } }}>{bookings.length}</Typography>
              <Typography variant="body2" color="text.secondary">{pendingCount} pending</Typography>
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={640}>
              <Paper
                onClick={() => navigate('/admin-dashboard/packages')}
                sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  minHeight: { xs: 140, sm: 150, md: 160 },
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.14)' },
                }}
              >
              <Typography color="text.secondary">Active Packages</Typography>
              <Typography sx={{ fontWeight: 800, color: 'var(--brand)', fontSize: { xs: '1.35rem', md: '1.6rem' } }}>{activePackages}</Typography>
              <Typography variant="body2" color="text.secondary">{packages.length} total</Typography>
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={760}>
              <Paper
                onClick={() => navigate('/admin-dashboard/analytics')}
                sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  minHeight: { xs: 140, sm: 150, md: 160 },
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.14)' },
                }}
              >
              <Typography color="text.secondary">Avg. Order Value</Typography>
              <Typography sx={{ fontWeight: 800, color: 'var(--brand)', fontSize: { xs: '1.35rem', md: '1.6rem' } }}>₹{(bookings.length ? Math.round(totalRevenue / Math.max(1, bookings.filter(b=>b.status==='Confirmed').length)) : 0).toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">confirmed only</Typography>
              </Paper>
            </Grow>
          </Grid>

          <Grid item xs={12}>
            <Fade in timeout={350}>
              <Paper sx={{ p: 0, mb: 2, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Box
                  sx={{
                    height: 120,
                    background: 'linear-gradient(135deg, #1976d2 0%, #51F2D9 100%)',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    alt="decor"
                    src={'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.2"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></linearGradient></defs><rect width="800" height="160" fill="url(%23g)"/></svg>'}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}
                  />
                </Box>
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} md={7}>
            <Fade in timeout={400}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.06)' }}>
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
              <Paper sx={{ p: 2, height: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.06)' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Recent Bookings</Typography>
              <Divider />
              <List dense>
                {recent.map(b => (
                  <ListItem key={b.id}>
                    <ListItemText
                      primary={`${b.id} • ₹${(Number(b.amount) || 0).toLocaleString()}`}
                      secondary={`${b.packageName || 'Travel Package'} • ${new Date(b.createdAt).toLocaleDateString()} • ${b.status}`}
                    />
                  </ListItem>
                ))}
              </List>
              {topPackages.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Top Packages
                  </Typography>
                  <List dense>
                    {topPackages.map((p) => (
                      <ListItem key={p.id}>
                        <ListItemText
                          primary={p.name}
                          secondary={`Bookings: ${p.count} • Revenue: ₹${p.revenue.toLocaleString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
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

