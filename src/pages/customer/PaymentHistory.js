// src/pages/user/PaymentHistory.js
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getAllPayments } from '../../services/paymentService';
import { getAllBookings } from '../../services/bookingService';

export default function PaymentHistory() {
  const { user } = useAuth();

  const { rows, totalSpend } = React.useMemo(() => {
    const allPayments = getAllPayments();
    const allBookings = getAllBookings();
    const email = user?.email;

    let filtered = allPayments;
    if (email) {
      const bookingsById = new Map(
        allBookings.map((b) => [String(b.id), b])
      );
      filtered = allPayments.filter((p) => {
        const booking = bookingsById.get(String(p.bookingId));
        return booking && booking.userEmail === email;
      });
    }

    const mapped = filtered
      .map((p) => {
        const booking = allBookings.find((b) => String(b.id) === String(p.bookingId));
        const packageName = booking?.packageName || 'Travel Package';
        const amount = Number(p.amount) || 0;
        const date = p.createdAt ? p.createdAt.slice(0, 10) : '';
        const status = p.status || 'Success';
        return { id: p.id, packageName, amount, date, status };
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const total = mapped.reduce((sum, t) => sum + t.amount, 0);

    return { rows: mapped, totalSpend: total };
  }, [user]);

  return (
    <Fade in timeout={300}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Payment History
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Paper
            sx={{
              flex: 1,
              p: 2,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
            }}
            elevation={0}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Total Spend
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              ₹{totalSpend.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on successful payments
            </Typography>
          </Paper>
        </Stack>

        <TableContainer
          component={Paper}
          sx={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Package Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((t) => (
                <TableRow
                  key={t.id}
                  hover
                  sx={{
                    transition: 'transform 0.2s ease, background 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.packageName}</TableCell>
                  <TableCell>₹{t.amount.toLocaleString()}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={t.status}
                      color={t.status === 'Success' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
}