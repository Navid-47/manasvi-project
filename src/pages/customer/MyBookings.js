// src/pages/user/MyBookings.js
import React, { useMemo, useState } from 'react';
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
} from '@mui/material';

const initial = [
  { id: 'BKG-001', packageName: 'Himalayan Escape', destination: 'Manali', date: '2025-11-05', status: 'Upcoming' },
  { id: 'BKG-002', packageName: 'Desert Safari', destination: 'Jaisalmer', date: '2025-07-12', status: 'Completed' },
  { id: 'BKG-003', packageName: 'Backwater Bliss', destination: 'Alleppey', date: '2025-09-03', status: 'Cancelled' },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function MyBookings() {
  const [rows, setRows] = useState(initial);
  const [confirmId, setConfirmId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const hasData = useMemo(() => rows.length > 0, [rows]);

  const handleCancel = (id) => setConfirmId(id);
  const confirmCancel = () => {
    setRows((r) => r.map((x) => (x.id === confirmId ? { ...x, status: 'Cancelled' } : x)));
    setSnack({ open: true, msg: 'Booking Cancelled Successfully', severity: 'success' });
    setConfirmId(null);
  };

  return (
    <Fade in timeout={300}>
      <Box>
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
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined">
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
            Are you sure you want to cancel this booking? This action cannot be undone.
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