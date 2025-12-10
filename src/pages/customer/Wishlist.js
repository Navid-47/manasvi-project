import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions, IconButton } from '@mui/material';
import { Favorite as FavoriteIcon, Share as ShareIcon, RemoveShoppingCart as RemoveIcon } from '@mui/icons-material';

const Wishlist = () => {
  // This would normally come from your state/context/API
  const wishlistItems = [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">My Wishlist</Typography>
      </Box>

      {wishlistItems.length === 0 ? (
        <Box textAlign="center" py={8}>
          <FavoriteIcon color="action" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Save your favorite destinations to your wishlist to keep track of them.
          </Typography>
          <Button variant="contained" color="primary" href="/destinations">
            Explore Destinations
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="remove from wishlist" color="error">
                    <RemoveIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist;
