import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const Bookings = () => {
  // This would normally come from your API
  const [bookings, setBookings] = useState([
    { 
      id: 'BK001', 
      customer: 'John Doe', 
      destination: 'Bali, Indonesia', 
      date: '2023-06-15',
      guests: 2,
      total: 2400,
      status: 'confirmed',
      createdAt: '2023-05-10',
    },
    { 
      id: 'BK002', 
      customer: 'Jane Smith', 
      destination: 'Paris, France', 
      date: '2023-07-20',
      guests: 4,
      total: 3200,
      status: 'pending',
      createdAt: '2023-05-12',
    },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0);
    handleMenuClose();
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Confirmed" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        );
      case 'pending':
        return (
          <Chip 
            icon={<PendingIcon />} 
            label="Pending" 
            color="warning" 
            size="small" 
            variant="outlined"
          />
        );
      case 'cancelled':
        return (
          <Chip 
            icon={<CancelIcon />} 
            label="Cancelled" 
            color="error" 
            size="small" 
            variant="outlined"
          />
        );
      default:
        return <Chip label={status} size="small" variant="outlined" />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">Bookings Management</Typography>
        
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search bookings..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            endIcon={<MoreVertIcon />}
            onClick={handleMenuOpen}
          >
            {statusFilter === 'all' ? 'Filter' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleStatusFilter('all')}>All Bookings</MenuItem>
            <MenuItem onClick={() => handleStatusFilter('confirmed')}>Confirmed</MenuItem>
            <MenuItem onClick={() => handleStatusFilter('pending')}>Pending</MenuItem>
            <MenuItem onClick={() => handleStatusFilter('cancelled')}>Cancelled</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow hover key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.customer}</TableCell>
                      <TableCell>{booking.destination}</TableCell>
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>${booking.total.toLocaleString()}</TableCell>
                      <TableCell>{getStatusChip(booking.status)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                          // onClick={() => handleView(booking.id)}
                          >
                            <VisibilityIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Booking">
                          <IconButton
                          // onClick={() => handleEdit(booking.id)}
                          >
                            <EditIcon color="info" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No bookings found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Bookings;
