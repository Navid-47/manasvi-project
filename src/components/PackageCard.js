import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Rating, Box } from '@mui/material';

const PackageCard = ({ pkg, onBook }) => {
  const title = pkg?.name || pkg?.title || 'Travel Package';
  const destination = pkg?.destination || pkg?.location || '';
  const price = pkg?.pricePerPerson ?? pkg?.price ?? 0;
  const duration = pkg?.durationDays ?? pkg?.duration ?? '';
  const image = (pkg?.images && pkg.images[0]) || pkg?.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop';
  const rating = pkg?.rating ?? 4.5;
  const inclusions = pkg?.inclusions ?? [];

  return (
    <Card className="rounded-xl shadow-lg overflow-hidden" sx={{ '&:hover': { bgcolor: 'transparent' } }}>
      <CardMedia component="img" height="180" image={image} alt={title} />
      <CardContent>
        <div className="flex items-start justify-between mb-2">
          <div>
            <Typography variant="h6" className="font-bold">{title}</Typography>
            <Typography variant="body2" color="text.secondary">{destination}</Typography>
          </div>
          <Typography variant="subtitle1" className="text-green-600 font-semibold">
            ₹{Number(price).toLocaleString()}
          </Typography>
        </div>
        <div className="flex items-center justify-between mb-3">
          <Box className="flex items-center">
            <Rating name="pkg-rating" size="small" value={Number(rating)} precision={0.5} readOnly />
            <Typography variant="body2" className="ml-2 text-text-muted">{Number(rating).toFixed(1)}</Typography>
          </Box>
          {duration ? (
            <Chip label={typeof duration === 'number' ? `${duration} days` : duration} size="small" color="primary" variant="outlined" />
          ) : null}
        </div>
        {inclusions?.length ? (
          <div className="flex flex-wrap gap-2">
            {inclusions.slice(0, 3).map((inc, i) => (
              <span key={i} className="bg-brand/10 text-brand text-xs px-2 py-1 rounded">{inc}</span>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardActions className="px-4 pb-4">
        <Box
          component="button"
          onClick={() => onBook?.(pkg)}
          sx={{
            width: '100%',
            padding: '8px 16px',
            background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
              background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%) !important',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.15)'
            },
            '&:focus': {
              outline: 'none',
              background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%) !important',
            }
          }}
        >
          Book Now
        </Box>
      </CardActions>
    </Card>
  );
};

export default PackageCard;