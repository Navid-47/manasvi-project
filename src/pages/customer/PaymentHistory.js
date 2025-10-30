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

const transactions = [
  { id: 'TXN-1001', packageName: 'Himalayan Escape', amount: 45000, date: '2025-05-02', status: 'Success' },
  { id: 'TXN-1002', packageName: 'Desert Safari', amount: 28000, date: '2025-05-10', status: 'Failed' },
  { id: 'TXN-1003', packageName: 'Backwater Bliss', amount: 52000, date: '2025-06-03', status: 'Success' },
];

export default function PaymentHistory() {
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
              Total Spend (Mock)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              ₹1,25,000
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Simple placeholder. Chart coming soon.
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
              {transactions.map((t) => (
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