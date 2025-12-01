// src/pages/user/Wallet.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Stack,
  Divider,
  Grow,
  Fade,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getWalletForUser } from '../../services/walletService';

export default function Wallet() {
  const { user } = useAuth();
  const [data, setData] = useState({ balance: 0, transactions: [] });

  useEffect(() => {
    const email = user?.email || null;
    setData(getWalletForUser(email));
  }, [user]);

  const totalCredits = useMemo(
    () => data.transactions.filter((t) => t.type === 'Credit').reduce((s, t) => s + t.amount, 0),
    [data]
  );
  const totalDebits = useMemo(
    () => data.transactions.filter((t) => t.type === 'Debit').reduce((s, t) => s + t.amount, 0),
    [data]
  );

  return (
    <Box sx={{ p: 3, backgroundColor: 'var(--surface)', borderRadius: '16px' }}>
      <Fade in timeout={300}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: 'var(--text)',
            textAlign: 'center',
          }}
        >
          My Wallet
        </Typography>
      </Fade>

      {/* Wallet Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
        {/* Wallet Balance */}
        <Grid item xs={12} sm={6} md={4}>
          <Grow in timeout={350}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: '16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: { xs: 160, sm: 170, md: 180 },
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Wallet Balance
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--brand)', mt: 0.5 }}>
                ₹{data.balance.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Use wallet money on any package
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ backgroundColor: 'var(--brand)', textTransform: 'none' }}
                  disabled
                >
                  Add Money (Coming Soon)
                </Button>
                <Button size="small" variant="outlined" disabled>
                  Withdraw (Coming Soon)
                </Button>
              </Stack>
            </Paper>
          </Grow>
        </Grid>

        {/* Total Credits */}
        <Grid item xs={12} sm={6} md={4}>
          <Grow in timeout={420}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: '16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: { xs: 140, sm: 150, md: 160 },
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Total Credits
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'green', mt: 1 }}>
                ₹{totalCredits.toLocaleString()}
              </Typography>
            </Paper>
          </Grow>
        </Grid>

        {/* Total Debits */}
        <Grid item xs={12} sm={6} md={4}>
          <Grow in timeout={500}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: '16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: { xs: 140, sm: 150, md: 160 },
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Total Debits
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main', mt: 1 }}>
                ₹{totalDebits.toLocaleString()}
              </Typography>
            </Paper>
          </Grow>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Transaction Table */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'var(--text)' }}>
        Transaction History
      </Typography>

      <Fade in timeout={350}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--light-bg)' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.transactions.map((t) => (
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
                  <TableCell>
                    <Chip
                      size="small"
                      label={t.type}
                      color={t.type === 'Credit' ? 'success' : 'default'}
                      variant={t.type === 'Debit' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₹{t.amount.toLocaleString()}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
    </Box>
  );
}