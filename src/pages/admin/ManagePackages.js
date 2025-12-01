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
  Switch,
  Fade,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { getAllPackages, savePackages } from '../../services/packageService';

export default function ManagePackages({ standalone = true }) {
  const [packages, setPackages] = React.useState(() => getAllPackages());
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [dialog, setDialog] = React.useState({ open: false, editing: null });
  const [form, setForm] = React.useState({ name: '', price: '', duration: '', active: true, imageUrl: '' });
  const [toast, setToast] = React.useState(null);
  const [orderBy, setOrderBy] = React.useState('id');
  const [order, setOrder] = React.useState('desc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = packages.filter((p) => (p.name || '').toLowerCase().includes(debouncedQuery.toLowerCase()));

  const sortComparator = (a, b) => {
    const av = a[orderBy];
    const bv = b[orderBy];
    let cmp = 0;
    if (orderBy === 'price') {
      cmp = Number(av || 0) - Number(bv || 0);
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return order === 'asc' ? cmp : -cmp;
  };

  const sorted = [...filtered].sort(sortComparator);
  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const openCreate = () => {
    setForm({ name: '', price: '', duration: '', active: true, imageUrl: '' });
    setDialog({ open: true, editing: null });
  };

  const openEdit = (pkg) => {
    setForm({
      name: pkg.name || '',
      price: String(pkg.price ?? ''),
      duration: pkg.duration || '',
      active: pkg.active ?? true,
      imageUrl: pkg.imageUrl || pkg.image || (Array.isArray(pkg.images) && pkg.images[0]) || '',
    });
    setDialog({ open: true, editing: pkg });
  };
  const closeDialog = () => setDialog({ open: false, editing: null });

  const save = () => {
    if (!form.name.trim() || !form.price) { setToast({ severity: 'error', message: 'Name and price are required' }); return; }
    const price = Number(form.price);
    if (Number.isNaN(price) || price <= 0) { setToast({ severity: 'error', message: 'Price must be a positive number' }); return; }
    if (dialog.editing) {
      setPackages(prev => {
        const next = prev.map(p =>
          p.id === dialog.editing.id
            ? {
                ...p,
                name: form.name.trim(),
                price,
                duration: form.duration.trim(),
                active: form.active,
                image: form.imageUrl.trim() || p.image,
                imageUrl: form.imageUrl.trim(),
              }
            : p
        );
        savePackages(next);
        return next;
      });
      setToast({ severity: 'success', message: 'Package updated' });
    } else {
      setPackages(prev => {
        const numericIds = prev
          .map(p => parseInt(p.id, 10))
          .filter((n) => Number.isFinite(n));
        const nextNum = (numericIds.length ? Math.max(...numericIds) : 0) + 1;
        const id = String(nextNum);
        const img = form.imageUrl.trim();
        const created = {
          id,
          name: form.name.trim(),
          price,
          duration: form.duration.trim(),
          active: form.active,
          image: img || undefined,
          imageUrl: img,
        };
        const next = [created, ...prev];
        savePackages(next);
        return next;
      });
      setToast({ severity: 'success', message: 'Package created' });
    }
    closeDialog();
  };

  const remove = (id) => {
    if (!window.confirm('Delete this package?')) return;
    setPackages(prev => {
      const next = prev.filter(p => p.id !== id);
      savePackages(next);
      return next;
    });
    setToast({ severity: 'success', message: 'Package deleted' });
  };

  const toggleActive = (id) => {
    setPackages(prev => {
      const next = prev.map(p =>
        p.id === id
          ? { ...p, active: !p.active }
          : p
      );
      savePackages(next);
      return next;
    });
  };

  const handleRequestSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--bg)' }}>
      {standalone && (
        <>
          <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
                Manage Packages
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      )}

      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Fade in timeout={300}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 3px 10px rgba(0,0,0,0.06)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Search packages" value={query} onChange={(e) => setQuery(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
              <Button variant="contained" onClick={openCreate}>Add Package</Button>
            </Grid>
          </Grid>
          </Paper>
        </Fade>

        <Fade in timeout={350}>
          <Paper sx={{ borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.05)' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell sortDirection={orderBy === 'id' ? order : false}>
                  <TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={handleRequestSort('id')}>ID</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={handleRequestSort('name')}>Name</TableSortLabel>
                </TableCell>
                <TableCell>Duration</TableCell>
                <TableCell align="right" sortDirection={orderBy === 'price' ? order : false}>
                  <TableSortLabel active={orderBy === 'price'} direction={orderBy === 'price' ? order : 'asc'} onClick={handleRequestSort('price')}>Price (₹)</TableSortLabel>
                </TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map(p => (
                <TableRow key={p.id} hover sx={{ transition: 'transform 0.2s ease, background 0.2s ease', '&:hover': { transform: 'translateY(-2px)', backgroundColor: 'action.hover' } }}>
                  <TableCell>
                    <Box
                      component="img"
                      src={p.imageUrl && p.imageUrl.trim() ? p.imageUrl : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="112" height="80"><rect width="100%" height="100%" fill="%23e0e0e0"/></svg>'}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="112" height="80"><rect width="100%" height="100%" fill="%23e0e0e0"/></svg>'; }}
                      sx={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 1, border: '1px solid var(--border)' }}
                    />
                  </TableCell>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.duration || '-'}</TableCell>
                  <TableCell align="right">{p.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Switch checked={p.active} onChange={() => toggleActive(p.id)} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openEdit(p)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => remove(p.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No packages found</TableCell>
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

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialog.editing ? 'Edit Package' : 'Add Package'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Price (₹)" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Duration (e.g., 3N/4D)" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Image URL" value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    alt="preview"
                    src={
                      form.imageUrl && form.imageUrl.trim()
                        ? form.imageUrl
                        : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="224" height="120"><rect width="100%" height="100%" fill="%23e0e0e0"/></svg>'
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="224" height="120"><rect width="100%" height="100%" fill="%23e0e0e0"/></svg>';
                    }}
                    sx={{ width: 224, height: 120, objectFit: 'cover', borderRadius: 1, border: '1px solid var(--border)' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch checked={form.active} onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))} />
                  <Typography>Active</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        {toast && <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>}
      </Snackbar>
    </Box>
  );
}


