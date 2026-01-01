import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  TextField, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider, 
  Tooltip, 
  Box, 
  Typography,
  Container,
  Button,
  InputAdornment,
  styled
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { getNotificationsForUser, markAllAsReadForUser } from '../services/notificationService';

// Styled Components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? 'var(--surface-elevated)' : 'var(--white)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  transition: 'var(--transition)',
  boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
  borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
  padding: scrolled ? '0.5rem 0' : '1rem 0',
  color: 'var(--text)',
  
  '& .MuiButton-contained': {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    color: 'var(--white)',
    textTransform: 'none',
    fontWeight: 600,
    padding: '0.5rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-md)',
    },
  },
  
  '& .MuiIconButton-root': {
    color: 'var(--text)',
    '&:hover': {
      backgroundColor: 'var(--gray-100)',
    },
  },
}));

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: active ? 'var(--primary)' : 'var(--text)',
  textDecoration: 'none',
  fontWeight: 500,
  padding: '0.5rem 1rem',
  borderRadius: 'var(--radius)',
  transition: 'var(--transition)',
  position: 'relative',
  '&:hover': {
    color: 'var(--primary-dark)',
    '&::after': {
      width: '100%',
      left: 0,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: active ? '100%' : '0',
    height: '2px',
    bottom: '0',
    left: active ? '0' : '50%',
    backgroundColor: 'var(--primary)',
    transition: 'all 0.3s ease',
  },
}));

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Sample notifications
  const sampleNotifications = [
    { id: 1, title: 'Your booking was confirmed', time: '2h ago', read: false },
    { id: 2, title: 'Payment received', time: 'Yesterday', read: true },
  ];

  // Navigation links
  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Destinations', path: '/destinations' },
    { text: 'Tours', path: '/tours' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [notifications, setNotifications] = useState(sampleNotifications);
  const { user, isAuthenticated, logout } = useAuth();

  // Load notifications
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    const refresh = () => {
      try {
        setNotifications(getNotificationsForUser(user));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    refresh();
    if (typeof window !== 'undefined') {
      window.addEventListener('tm_notifications_updated', refresh);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('tm_notifications_updated', refresh);
      }
    };
  }, [isAuthenticated, user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Toggle search bar
  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchTerm('');
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSearchOpen(false);
    }
  };

  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleReadAllNotifications = async () => {
    if (!user) return;
    try {
      await markAllAsReadForUser(user.id);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  // Navigation handlers
  const handleDashboard = () => {
    handleMenuClose();
    navigate('/user-dashboard');  
  };

  const handleMyProfile = () => {
    handleMenuClose();
    navigate('/user-dashboard/profile');
  };

  // User data and authentication state
  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('tm_user')) || null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }, []);

  const isLoggedIn = isAuthenticated || !!stored;
  const displayName = user?.displayName || stored?.userName || 'User';
  const userRole = user?.role || stored?.role || 'Customer';
  
  // Generate user initials for avatar
  const initials = useMemo(() => {
    return displayName
      .split('.')
      .join(' ')
      .split(/\s+/)
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const openMenu = Boolean(anchorEl);

  return (
    <>
      <StyledAppBar 
        position="fixed" 
        scrolled={isScrolled}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(10deg) scale(1.1)',
                    }
                  }}
                >
                  TM
                </Box>
                <Typography 
                  variant="h6" 
                  noWrap 
                  component="div" 
                  sx={{
                    ml: 2,
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  Travel Manasvi
                </Typography>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.text}
                  to={link.path}
                  active={location.pathname === link.path ? 1 : 0}
                  className="nav-link"
                  sx={{
                    mx: 1,
                    '&.active': {
                      color: 'primary.main',
                      '&::after': {
                        width: '100%',
                        left: 0,
                      },
                    },
                  }}
                >
                  {link.text}
                </NavLink>
              ))}
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleSearchToggle}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <SearchIcon />
              </IconButton>
              
              {isLoggedIn && (
                <NotificationBell
                  notifications={notifications}
                  onReadAll={handleReadAllNotifications}
                />
              )}

              {isLoggedIn ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title={displayName}>
                    <IconButton
                      onClick={handleMenuOpen}
                      size="small"
                      sx={{
                        p: 0,
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: 'primary.main',
                          fontWeight: 'bold',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                          },
                        }}
                      >
                        {initials}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{ ml: -0.5 }}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <Box px={2} py={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userRole} Dashboard
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleDashboard}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleMyProfile}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      My Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon sx={{ color: 'error.main' }}>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                      color: 'white',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 'var(--shadow-md)',
                        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                      },
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 'var(--radius-md)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 'var(--shadow-md)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              )}

              {/* Mobile menu button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Search Drawer */}
        <Drawer
          anchor="top"
          open={searchOpen}
          onClose={handleSearchToggle}
          PaperProps={{
            sx: {
              marginTop: '64px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              bgcolor: 'background.paper',
              p: 2,
            },
          }}
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <Container>
            <form onSubmit={handleSearch}>
              <Box sx={{ position: 'relative', maxWidth: '800px', mx: 'auto' }}>
                <TextField
                  fullWidth
                  autoFocus
                  variant="outlined"
                  placeholder="Search destinations, tours, hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm('')}
                          edge="end"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 'var(--radius-lg)',
                      bgcolor: 'background.paper',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    position: 'absolute',
                    right: '4px',
                    top: '4px',
                    bottom: '4px',
                    borderRadius: '8px',
                    px: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    '&:hover': {
                      background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
            </form>
          </Container>
        </Drawer>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: 'primary.main',
              color: 'white',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box 
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  TM
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Travel Manasvi
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setMobileOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            {/* Profile Section */}
            {isLoggedIn && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 2, 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                backdropFilter: 'blur(8px)'
              }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {initials}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {displayName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {userRole}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <List sx={{ p: 1 }}>
            {navLinks.map((link) => (
              <ListItem
                key={link.text}
                component={Link}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  color: location.pathname === link.path ? 'primary.main' : 'text.primary',
                  backgroundColor: location.pathname === link.path ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'primary.main',
                  },
                }}
              >
                <ListItemText 
                  primary={link.text} 
                  primaryTypographyProps={{
                    fontWeight: location.pathname === link.path ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
            
            <Divider sx={{ my: 1 }} />
            
            {isLoggedIn ? (
              <>
                <ListItem 
                  button 
                  onClick={() => {
                    handleDashboard();
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => {
                    handleMyProfile();
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText primary="My Profile" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  sx={{
                    color: 'error.main',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                    },
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <Box sx={{ px: 2, py: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  disableElevation
                  sx={{
                    background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: '#fff',
                    borderRadius: 2,
                    px: 3,
                    py: 1.25,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.2)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
                      background: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-dark) 100%) !important',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.15)'
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Book Now
                </Button>
              </Box>
            )}
          </List>
          <Box sx={{ p: 2 }}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                autoFocus
                variant="outlined"
                placeholder="Search destinations, tours, hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm('')}
                        edge="end"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 'var(--radius-lg)',
                    bgcolor: 'background.paper',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  bottom: '4px',
                  borderRadius: '8px',
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                  },
                }}
              >
                Search
              </Button>
            </form>
          </Box>
        </Drawer>
      </StyledAppBar>
    </>
  );
};

export default Navbar;