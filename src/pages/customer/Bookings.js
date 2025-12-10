import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

// Sample data - replace with API call
const SAMPLE_BOOKINGS = [
  {
    id: 'BK001',
    destination: 'Bali, Indonesia',
    image: 'https://source.unsplash.com/random/300x200/?bali',
    date: '2023-06-15',
    guests: 2,
    total: 2400,
    status: 'confirmed',
    bookingDate: '2023-05-10',
    bookingRef: 'MVT2023051001',
    paymentStatus: 'paid',
    startDate: '2023-06-15',
    endDate: '2023-06-22',
  },
  {
    id: 'BK002',
    destination: 'Paris, France',
    image: 'https://source.unsplash.com/random/300x200/?paris',
    date: '2023-08-20',
    guests: 4,
    total: 3200,
    status: 'pending',
    bookingDate: '2023-05-12',
    bookingRef: 'MVT2023051202',
    paymentStatus: 'pending',
    startDate: '2023-08-20',
    endDate: '2023-08-27',
  },
];

const Bookings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState('all');
  
  // Simulate API call
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookings(SAMPLE_BOOKINGS);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
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

  const getPaymentStatusChip = (status) => {
    switch (status) {
      case 'paid':
        return <Chip label="Paid" color="success" size="small" variant="outlined" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" variant="outlined" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" variant="outlined" />;
      case 'refunded':
        return <Chip label="Refunded" color="info" size="small" variant="outlined" />;
      default:
        return <Chip label={status} size="small" variant="outlined" />;
    }
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your travel bookings
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 'auto',
              px: 3,
              py: 1.5,
              '&.Mui-selected': {
                color: 'primary.main',
                bgcolor: 'primary.lighter',
                borderRadius: 1,
              },
            },
          }}
        >
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <Typography>All</Typography>
                <Badge 
                  badgeContent={bookings.length} 
                  color="primary" 
                  sx={{ ml: 1 }} 
                />
              </Box>
            } 
            value="all" 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography>Confirmed</Typography>
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'confirmed').length} 
                  color="success" 
                  sx={{ ml: 1 }} 
                />
              </Box>
            } 
            value="confirmed" 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <PendingIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography>Pending</Typography>
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'pending').length} 
                  color="warning" 
                  sx={{ ml: 1 }} 
                />
              </Box>
            } 
            value="pending" 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography>Cancelled</Typography>
                <Badge 
                  badgeContent={bookings.filter(b => b.status === 'cancelled').length} 
                  color="error" 
                  sx={{ ml: 1 }} 
                />
              </Box>
            } 
            value="cancelled" 
          />
        </Tabs>
      </Paper>

      {isMobile ? (
        // Mobile View
        <Box>
          {filteredBookings.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {activeTab === 'all' 
                  ? 'You don\'t have any bookings yet.'
                  : `You don't have any ${activeTab} bookings.`}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/destinations')}
              >
                Explore Destinations
              </Button>
            </Paper>
          ) : (
            <Box>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <Card key={booking.id} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                    <Box display="flex">
                      <Box
                        component="img"
                        src={booking.image}
                        alt={booking.destination}
                        sx={{
                          width: 120,
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box sx={{ flex: 1, p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {booking.destination}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box>
                            {getStatusChip(booking.status)}
                          </Box>
                        </Box>
                        
                        <Box mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            <Box component="span" display="flex" alignItems="center" mb={0.5}>
                              <PersonIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                              {booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}
                            </Box>
                            <Box component="span" display="flex" alignItems="center">
                              <MoneyIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                              ${booking.total.toLocaleString()}
                            </Box>
                          </Typography>
                        </Box>
                        
                        <Box mt={1.5} display="flex" justifyContent="space-between">
                          <Button 
                            size="small" 
                            onClick={() => handleViewDetails(booking.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<ReceiptIcon />}
                            sx={{ textTransform: 'none' }}
                          >
                            Invoice
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))}
              
              <Box mt={2} display="flex" justifyContent="center">
                <TablePagination
                  component="div"
                  count={filteredBookings.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        // Desktop View
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Destination</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box textAlign="center">
                        <ReceiptIcon color="action" sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No bookings found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {activeTab === 'all' 
                            ? 'You don\'t have any bookings yet.'
                            : `You don't have any ${activeTab} bookings.`}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => navigate('/destinations')}
                        >
                          Explore Destinations
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((booking) => (
                      <TableRow hover key={booking.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              component="img"
                              src={booking.image}
                              alt={booking.destination}
                              sx={{
                                width: 60,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mr: 2,
                              }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                              {booking.destination}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(booking.startDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            to {new Date(booking.endDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            ${booking.total.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(booking.status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusChip(booking.paymentStatus)}
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end">
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(booking.id)}
                                color="primary"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Invoice">
                              <IconButton size="small" color="primary">
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
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
      )}
    </Container>
  );
};

export default Bookings;
