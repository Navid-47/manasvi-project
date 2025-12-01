import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Chip, Typography, Button, Grid, Paper } from '@mui/material';
import Loader from '../../components/Loader';
import { usePackage } from '../../hooks/useFetchPackages';

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { pkg, loading, error } = usePackage(packageId);

  if (loading) {
    return <Loader fullScreen label="Loading package..." />;
  }

  if (error) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-500">Failed to load package</h1>
          <p className="text-text-muted mb-4">Please go back and try again.</p>
          <button
            className="bg-brand text-white px-6 py-2 rounded-lg hover-brand"
            onClick={() => navigate('/tours')}
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Package not found</h1>
          <p className="text-text-muted mb-4">The package you are looking for does not exist.</p>
          <button
            className="bg-brand text-white px-6 py-2 rounded-lg hover-brand"
            onClick={() => navigate('/tours')}
          >
            View All Tours
          </button>
        </div>
      </div>
    );
  }

  const title = pkg.name || pkg.title || 'Travel Package';
  const destination = pkg.destination || pkg.location || '';
  const price = pkg.pricePerPerson ?? pkg.price ?? 0;
  const duration = pkg.duration || (pkg.durationDays ? `${pkg.durationDays} days` : '');
  const image = (pkg.images && pkg.images[0]) || pkg.image;
  const rating = pkg.rating ?? 4.5;
  const highlights = pkg.highlights || [];
  const inclusions = pkg.inclusions || [];
  const difficulty = pkg.difficulty || '';

  return (
    <div className="py-16 bg-bg">
      <div className="container mx-auto px-4">
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              className="overflow-hidden rounded-2xl shadow-lg mb-6"
            >
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-72 md:h-96 object-cover"
                />
              )}
            </Paper>

            <Paper
              elevation={1}
              className="p-6 rounded-2xl border border-border bg-surface"
            >
              <Typography variant="h6" className="mb-3 font-bold">
                Highlights
              </Typography>
              <Box className="flex flex-wrap gap-2 mb-4">
                {highlights.map((h, i) => (
                  <Chip key={i} label={h} size="small" color="primary" variant="outlined" />
                ))}
              </Box>

              {inclusions.length > 0 && (
                <>
                  <Typography variant="h6" className="mb-3 font-bold">
                    Inclusions
                  </Typography>
                  <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                    {inclusions.map((inc, i) => (
                      <li key={i}>{inc}</li>
                    ))}
                  </ul>
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={2}
              className="p-6 rounded-2xl border border-border bg-surface mb-4"
            >
              <Typography variant="h5" className="font-bold mb-1">
                {title}
              </Typography>
              {destination && (
                <Typography variant="body2" className="text-text-muted mb-2">
                  {destination}
                </Typography>
              )}

              <Box className="flex items-center gap-2 mb-3">
                <Chip label={duration} size="small" />
                {difficulty && <Chip label={difficulty} size="small" variant="outlined" />}
              </Box>

              <Typography variant="h6" className="text-green-600 font-bold mb-1">
                ₹{Number(price).toLocaleString()}
              </Typography>
              <Typography variant="body2" className="text-text-muted mb-4">
                Rated {Number(rating).toFixed(1)} / 5
              </Typography>

              {pkg.description && (
                <Typography variant="body2" className="text-text-muted mb-4">
                  {pkg.description}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: 'var(--brand)',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: 'var(--brand-dark)' },
                }}
                className="mb-3"
                onClick={() => navigate(`/book/${pkg.id}`)}
              >
                Book This Package
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/tours')}
              >
                Back to Tours
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default PackageDetails;

