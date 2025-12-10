import { createTheme } from '@mui/material/styles';
import { red, green, orange, blue } from '@mui/material/colors';

// Create and export theme instance
export default createTheme({
  palette: {
    primary: {
      main: '#1A56DB', // Vibrant blue
      light: '#3B82F6',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F59E0B', // Warm amber
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#1F2937',
    },
    success: {
      main: green[600],
      light: green[400],
      dark: green[800],
      contrastText: '#FFFFFF',
    },
    error: {
      main: red[600],
      light: red[400],
      dark: red[800],
      contrastText: '#FFFFFF',
    },
    warning: {
      main: orange[600],
      light: orange[400],
      dark: orange[800],
      contrastText: '#1F2937',
    },
    info: {
      main: blue[500],
      light: blue[300],
      dark: blue[700],
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#1F2937', // Dark gray for primary text
      secondary: '#4B5563', // Medium gray for secondary text
      disabled: '#9CA3AF', // Light gray for disabled text
    },
    background: {
      default: '#F8FAFC', // Very light blue-gray
      paper: '#FFFFFF',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h3: { 
      fontWeight: 700, 
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h4: { 
      fontWeight: 600, 
      fontSize: '1.5rem',
      lineHeight: 1.35,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.45,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});