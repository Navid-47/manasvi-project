import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  paddingTop: '80px', // Height of the AppBar
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    paddingTop: '64px',
  },
}));

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <MainContent component="main">
        {children}
      </MainContent>
    </Box>
  );
};

export default MainLayout;
