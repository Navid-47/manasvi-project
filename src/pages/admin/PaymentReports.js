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
  MenuItem,
} from '@mui/material';
import { getAllPayments } from '../../services/paymentService';

export default function PaymentReports({ standalone = true }) {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [toast, setToast] = React.useState(null);
  const [status, setStatus] = React.useState('All');

  const allPayments = getAllPayments();

  const normalizedPayments = (allPayments || []).map((p) => ({
    id: p.id,
    bookingId: p.bookingId,
    customer: p.userEmail || p.customer || 'Customer',
    date: p.createdAt || p.date,
    amount: p.amount,
    status: p.status || 'Success',
    method: p.method || 'Card',
  }));

  const payments = normalizedPayments.filter((p) => {
    if (!p.date) return false;
    const d = new Date(p.date).setHours(0, 0, 0, 0);
    const afterFrom = from ? d >= new Date(from).setHours(0, 0, 0, 0) : true;
    const beforeTo = to ? d <= new Date(to).setHours(0, 0, 0, 0) : true;
    const matchesStatus = status === 'All' ? true : (p.status || 'Success') === status;
    return afterFrom && beforeTo && matchesStatus;
  });

  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const count = payments.length;

  const statusCounts = normalizedPayments.reduce((acc, p) => {
    const key = p.status || 'Success';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const successCount = statusCounts.Success || 0;
  const failedCount = statusCounts.Failed || 0;
  const refundedCount = statusCounts.Refunded || 0;

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
    const header = ['Payment ID', 'Booking ID', 'Customer', 'Status', 'Method', 'Date', 'Amount'];
    const rows = payments.map((p) => [
      p.id,
      p.bookingId || '',
      p.customer,
      p.status || 'Success',
      p.method || 'Card',
      p.date ? new Date(p.date).toLocaleDateString() : '',
      p.amount,
    ]);
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
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Success">Success</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" onClick={() => setPreset('today')}>Today</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('7')}>Last 7</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('30')}>Last 30</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('90')}>Last 90</Button>
                <Button size="small" variant="outlined" onClick={() => setPreset('month')}>This Month</Button>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFrom('');
                    setTo('');
                    setStatus('All');
                  }}
                >
                  Clear
                </Button>
                <Button variant="contained" onClick={exportCsv} disabled={payments.length === 0}>Export CSV</Button>
              </Stack>
            </Grid>
          </Grid>
          </Paper>
        </Fade>

        <Fade in timeout={350}>
          <Paper sx={{ borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.05)' }}>
          <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip label={`Payments: ${count}`} size="small" />
            <Chip label={`Total: ₹${total.toLocaleString()}`} color="primary" size="small" />
            <Chip label={`Success: ${successCount}`} color="success" variant="outlined" size="small" />
            <Chip label={`Failed: ${failedCount}`} color="error" variant="outlined" size="small" />
            <Chip label={`Refunded: ${refundedCount}`} variant="outlined" size="small" />
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id} hover sx={{ transition: 'transform 0.2s ease, background 0.2s ease', '&:hover': { transform: 'translateY(-2px)', backgroundColor: 'action.hover' } }}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.bookingId || '-'}</TableCell>
                  <TableCell>{p.customer}</TableCell>
                  <TableCell>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.status || 'Success'}
                      size="small"
                      color={
                        (p.status || 'Success') === 'Success'
                          ? 'success'
                          : (p.status || 'Success') === 'Failed'
                          ? 'error'
                          : 'default'
                      }
                      variant={p.status === 'Refunded' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell align="right">{(p.amount || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No payments in selected range</TableCell>
                </TableRow>
              )}
              {payments.length > 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="right"><b>Total</b></TableCell>
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


