import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Fade,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { getAllBookings } from '../../services/bookingService';

export default function PaymentReports({ standalone = true }) {
  const bookings = getAllBookings();
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [toast, setToast] = React.useState(null);

  const payments = bookings
    .filter(b => b.status === 'Confirmed')
    .map(b => ({
      id: b.id,
      customer: b.customer || b.userEmail || 'Customer',
      date: b.createdAt,
      amount: b.amount,
    }))
    .filter(p => {
      const d = new Date(p.date).setHours(0,0,0,0);
      const afterFrom = from ? d >= new Date(from).setHours(0,0,0,0) : true;
      const beforeTo = to ? d <= new Date(to).setHours(0,0,0,0) : true;
      return afterFrom && beforeTo;
    });

  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const count = payments.length;

  const setPreset = (preset) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (preset === 'today') {
      const d = today.toISOString().slice(0,10);
      setFrom(d); setTo(d);
    } else if (preset === '7') {
      const d = new Date(); d.setDate(today.getDate() - 7);
      setFrom(d.toISOString().slice(0,10)); setTo(today.toISOString().slice(0,10));
    } else if (preset === '30') {
      const d = new Date(); d.setDate(today.getDate() - 30);
      setFrom(d.toISOString().slice(0,10)); setTo(today.toISOString().slice(0,10));
    } else if (preset === '90') {
      const d = new Date(); d.setDate(today.getDate() - 90);
      setFrom(d.toISOString().slice(0,10)); setTo(today.toISOString().slice(0,10));
    } else if (preset === 'month') {
      setFrom(startOfMonth.toISOString().slice(0,10)); setTo(today.toISOString().slice(0,10));
    }
  };

  const exportCsv = () => {
    const header = ['Payment ID', 'Customer', 'Date', 'Amount'];
    const rows = payments.map(p => [p.id, p.customer, new Date(p.date).toLocaleDateString(), p.amount]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${from || 'all'}-${to || 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ severity: 'success', message: 'Report exported' });
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--bg)' }}>
      {standalone && (
        <>
          <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
                Payment Reports
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
              <TextField fullWidth type="date" label="From" InputLabelProps={{ shrink: true }} value={from} onChange={(e) => setFrom(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth type="date" label="To" InputLabelProps={{ shrink: true }} value={to} onChange={(e) => setTo(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" onClick={() => setPreset('today')}>Today</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('7')}>Last 7</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('30')}>Last 30</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('90')}>Last 90</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('month')}>This Month</Button>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
                <Button variant="outlined" onClick={() => { setFrom(''); setTo(''); }}>Clear</Button>
                <Button variant="contained" onClick={exportCsv} disabled={payments.length === 0}>Export CSV</Button>
              </Stack>
            </Grid>
          </Grid>
          </Paper>
        </Fade>

        <Fade in timeout={350}>
          <Paper sx={{ borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.05)' }}>
          <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={`Payments: ${count}`} size="small" />
            <Chip label={`Total: ₹${total.toLocaleString()}`} color="primary" size="small" />
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id} hover sx={{ transition: 'transform 0.2s ease, background 0.2s ease', '&:hover': { transform: 'translateY(-2px)', backgroundColor: 'action.hover' } }}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.customer}</TableCell>
                  <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{(p.amount || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No payments in selected range</TableCell>
                </TableRow>
              )}
              {payments.length > 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="right"><b>Total</b></TableCell>
                  <TableCell align="right"><b>₹{total.toLocaleString()}</b></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </Paper>
        </Fade>
      </Box>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        {toast && <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>}
      </Snackbar>
    </Box>
  );
}


