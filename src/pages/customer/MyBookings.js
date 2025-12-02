// src/pages/user/MyBookings.js
import React, { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  Stack,
  Fade,
  Slide,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllBookings, updateBooking } from '../../services/bookingService';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    const all = getAllBookings();
    const email = user?.email;
    const userBookings = email ? all.filter((b) => b.userEmail === email) : all;
    const mapped = userBookings.map((b) => ({
      id: b.id,
      packageName: b.packageName || 'Travel Package',
      destination: b.destination || '',
      date: b.travelDate || (b.createdAt ? b.createdAt.slice(0, 10) : ''),
      status:
        b.status === 'Cancelled'
          ? 'Cancelled'
          : b.status === 'Confirmed'
          ? 'Completed'
          : 'Upcoming',
      refundRequested: !!b.refundRequested,
      refundStatus: b.refundStatus || null,
      daysUntil: (() => {
        const raw = b.travelDate || b.createdAt;
        if (!raw) return null;
        const tripDate = new Date(raw);
        if (Number.isNaN(tripDate.getTime())) return null;
        const dTrip = new Date(tripDate);
        const dNow = new Date();
        dTrip.setHours(0, 0, 0, 0);
        dNow.setHours(0, 0, 0, 0);
        return Math.round((dTrip.getTime() - dNow.getTime()) / (24 * 60 * 60 * 1000));
      })(),
    }));

    setRows(mapped);
  }, [user]);

  const hasData = useMemo(() => rows.length > 0, [rows]);

  const handleCancel = (id) => setConfirmId(id);
  const confirmCancel = () => {
    setRows((r) =>
      r.map((x) =>
        x.id === confirmId ? { ...x, status: 'Cancelled', refundRequested: true } : x
      )
    );
    try {
      updateBooking(confirmId, {
        status: 'Cancelled',
        refundRequested: true,
        refundReason: refundReason.trim() || undefined,
      });
    } catch {}
    setSnack({ open: true, msg: 'Booking Cancelled Successfully', severity: 'success' });
    setRefundReason('');
    setConfirmId(null);
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 1.5, md: 2 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          My Bookings
        </Typography>

        {!hasData ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              You haven’t booked any trips yet!
            </Typography>
          </Paper>
        ) : (
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
                <TableRow sx={{ '& th': { fontWeight: 600 } }}>
                  <TableCell>Package Name</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Travel Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      transition: 'transform 0.2s ease, background 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>{row.packageName}</TableCell>
                    <TableCell>{row.destination}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip
                          label={row.status}
                          size="small"
                          color={
                            row.status === 'Upcoming'
                              ? 'primary'
                              : row.status === 'Completed'
                              ? 'success'
                              : 'default'
                          }
                          variant={row.status === 'Cancelled' ? 'outlined' : 'filled'}
                        />
                        {row.status === 'Upcoming' &&
                          typeof row.daysUntil === 'number' &&
                          row.daysUntil >= 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {row.daysUntil === 0
                                ? 'Trip is today'
                                : `Trip in ${row.daysUntil} day(s)`}
                            </Typography>
                          )}
                        {row.status === 'Cancelled' && row.refundRequested && (
                          <Typography variant="caption" color="text.secondary">
                            Refund requested
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/booking/${row.id}/invoice`)}
                        >
                          View Invoice
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          disabled={row.status !== 'Upcoming'}
                          onClick={() => handleCancel(row.id)}
                        >
                          Cancel Booking
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={!!confirmId} onClose={() => setConfirmId(null)} TransitionComponent={Transition}>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </Typography>
            <TextField
              fullWidth
              label="Reason for refund (optional)"
              multiline
              minRows={2}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setConfirmId(null)}>No</Button>
            <Button color="error" variant="contained" onClick={confirmCancel}>
              Yes, Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snack.severity} variant="filled">
            {snack.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}