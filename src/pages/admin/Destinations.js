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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const Destinations = () => {
  // This would normally come from your API
  const [destinations, setDestinations] = useState([
    { 
      id: 1, 
      name: 'Bali, Indonesia', 
      country: 'Indonesia', 
      isFeatured: true,
      status: 'active',
      createdAt: '2023-01-15',
      image: 'https://source.unsplash.com/random/300x200/?bali',
    },
    { 
      id: 2, 
      name: 'Paris, France', 
      country: 'France', 
      isFeatured: true,
      status: 'active',
      createdAt: '2023-02-20',
      image: 'https://source.unsplash.com/random/300x200/?paris',
    },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">Manage Destinations</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          // onClick={handleAddDestination}
        >
          Add Destination
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {destinations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((destination) => (
                  <TableRow hover key={destination.id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={destination.image}
                        alt={destination.name}
                        sx={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>{destination.name}</TableCell>
                    <TableCell>{destination.country}</TableCell>
                    <TableCell>
                      <Chip 
                        label={destination.status === 'active' ? 'Active' : 'Inactive'}
                        color={destination.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {destination.isFeatured ? (
                        <Chip label="Featured" color="primary" size="small" />
                      ) : (
                        <Chip label="Regular" variant="outlined" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{new Date(destination.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton
                        // onClick={() => handleView(destination.id)}
                        >
                          <VisibilityIcon color="info" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                        // onClick={() => handleEdit(destination.id)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                        // onClick={() => handleDelete(destination.id)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={destinations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Destinations;
