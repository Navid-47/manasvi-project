import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Fade,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableSortLabel,
  TablePagination,
  Drawer,
  Divider,
  Stack,
  Snackbar,
  Alert,
  Chip,
  Menu,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getAllBookings, updateBooking } from '../../services/bookingService';

const STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

function mapBookings(source) {
  return (source || []).map((b) => ({
    id: b.id,
    customer: b.customer || b.userEmail || 'Customer',
    destination: b.destination || b.packageName || '',
    amount: Number(b.amount) || 0,
    status: b.status || 'Pending',
    createdAt: b.createdAt || new Date().toISOString(),
  }));
}

export default function ManageBookings({ standalone = true }) {
  const [bookings, setBookings] = React.useState(() => mapBookings(getAllBookings()));
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [status, setStatus] = React.useState('All');
  const [selected, setSelected] = React.useState([]);
  const [drawer, setDrawer] = React.useState({ open: false, booking: null });
  const [toast, setToast] = React.useState(null);
  const [orderBy, setOrderBy] = React.useState('createdAt');
  const [order, setOrder] = React.useState('desc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [statusMenu, setStatusMenu] = React.useState({ anchorEl: null, id: null });

  // Debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = bookings.filter(b => {
    const matchesQuery = [b.id, b.customer, b.destination].join(' ').toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesStatus = status === 'All' ? true : b.status === status;
    return matchesQuery && matchesStatus;
  });

  const sortComparator = (a, b) => {
    const av = a[orderBy];
    const bv = b[orderBy];
    let cmp = 0;
    if (orderBy === 'amount') {
      cmp = (av || 0) - (bv || 0);
    } else if (orderBy === 'createdAt') {
      cmp = new Date(av) - new Date(bv);
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return order === 'asc' ? cmp : -cmp;
  };

  const sorted = [...filtered].sort(sortComparator);
  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : filtered.map(b => b.id));
  };

  const bulkUpdate = (newStatus) => {
    setBookings(prev => prev.map(b => selected.includes(b.id) ? { ...b, status: newStatus } : b));
    selected.forEach((id) => {
      try { updateBooking(id, { status: newStatus }); } catch {}
    });
    setSelected([]);
    setToast({ severity: 'success', message: `Updated ${selected.length} booking(s) to ${newStatus}` });
  };

  const openDetails = (b) => setDrawer({ open: true, booking: b });
  const closeDetails = () => setDrawer({ open: false, booking: null });

  const handleRequestSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const openStatusMenu = (event, id) => setStatusMenu({ anchorEl: event.currentTarget, id });
  const closeStatusMenu = () => setStatusMenu({ anchorEl: null, id: null });
  const setStatusInline = (newStatus) => {
    setBookings(prev => prev.map(b => b.id === statusMenu.id ? { ...b, status: newStatus } : b));
    try { if (statusMenu.id) updateBooking(statusMenu.id, { status: newStatus }); } catch {}
    setToast({ severity: 'success', message: `Status updated to ${newStatus}` });
    closeStatusMenu();
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--bg)' }}>
      {standalone && (
        <>
          <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
                Manage Bookings
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      )}

      <Box sx={{ p: 3 }}>
        <Fade in timeout={300}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.06)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Search (ID, Customer, Destination)" value={query} onChange={(e) => setQuery(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {['All', ...STATUSES].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                {STATUSES.map(s => (
                  <Button key={s} variant="outlined" onClick={() => bulkUpdate(s)} disabled={selected.length === 0}>{s}</Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
          </Paper>
        </Fade>

        <Fade in timeout={350}>
          <Paper sx={{ borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.05)' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox checked={allSelected} onChange={toggleSelectAll} /></TableCell>
                <TableCell sortDirection={orderBy === 'id' ? order : false}>
                  <TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={handleRequestSort('id')}>ID</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'customer' ? order : false}>
                  <TableSortLabel active={orderBy === 'customer'} direction={orderBy === 'customer' ? order : 'asc'} onClick={handleRequestSort('customer')}>Customer</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'destination' ? order : false}>
                  <TableSortLabel active={orderBy === 'destination'} direction={orderBy === 'destination' ? order : 'asc'} onClick={handleRequestSort('destination')}>Destination</TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" sortDirection={orderBy === 'amount' ? order : false}>
                  <TableSortLabel active={orderBy === 'amount'} direction={orderBy === 'amount' ? order : 'asc'} onClick={handleRequestSort('amount')}>Amount</TableSortLabel>
                </TableCell>
                <TableCell align="right" sortDirection={orderBy === 'createdAt' ? order : false}>
                  <TableSortLabel active={orderBy === 'createdAt'} direction={orderBy === 'createdAt' ? order : 'asc'} onClick={handleRequestSort('createdAt')}>Created</TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map(b => (
                <TableRow key={b.id} hover sx={{ transition: 'transform 0.2s ease, background 0.2s ease', '&:hover': { transform: 'translateY(-2px)', backgroundColor: 'action.hover' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(b.id)} onChange={() => toggleSelect(b.id)} />
                  </TableCell>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 28, height: 28 }}>
                        {String(b.customer || '')
                          .split(' ')
                          .map((s) => s[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || 'CU'}
                      </Avatar>
                      <Typography variant="body2">{b.customer}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{b.destination}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={b.status}
                      color={b.status === 'Confirmed' ? 'success' : b.status === 'Pending' ? 'warning' : 'default'}
                      variant={b.status === 'Cancelled' ? 'outlined' : 'filled'}
                      onClick={(e) => openStatusMenu(e, b.id)}
                    />
                  </TableCell>
                  <TableCell align="right">₹{(b.amount || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="More actions">
                      <IconButton size="small" onClick={() => openDetails(b)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">No bookings found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sorted.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
          </Paper>
        </Fade>
      </Box>

      <Drawer
        anchor="right"
        open={drawer.open}
        onClose={closeDetails}
        PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Booking Details</Typography>
          <Divider sx={{ my: 2 }} />
          {drawer.booking && (
            <Stack spacing={1}>
              <Typography><b>ID:</b> {drawer.booking.id}</Typography>
              <Typography><b>Customer:</b> {drawer.booking.customer}</Typography>
              <Typography><b>Destination:</b> {drawer.booking.destination}</Typography>
              <Typography><b>Status:</b> {drawer.booking.status}</Typography>
              <Typography><b>Amount:</b> ₹{(drawer.booking.amount || 0).toLocaleString()}</Typography>
              <Typography color="text.secondary">
                Created: {new Date(drawer.booking.createdAt).toLocaleString()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Quick Update</Typography>
              <Stack direction="row" spacing={1}>
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setBookings((prev) =>
                        prev.map((x) =>
                          x.id === drawer.booking.id ? { ...x, status: s } : x
                        )
                      );
                      try {
                        updateBooking(drawer.booking.id, { status: s });
                      } catch {}
                      setToast({ severity: 'success', message: `Status updated to ${s}` });
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </Stack>
            </Stack>
          )}
        </Box>
      </Drawer>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        {toast && (
          <Alert severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        )}
      </Snackbar>

      <Menu anchorEl={statusMenu.anchorEl} open={Boolean(statusMenu.anchorEl)} onClose={closeStatusMenu}>
        {STATUSES.map((s) => (
          <MenuItem key={s} onClick={() => setStatusInline(s)}>
            {s}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

