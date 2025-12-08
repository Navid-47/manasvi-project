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
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NotificationBell from './NotificationBell';

// Styled Components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
  borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent',
  padding: scrolled ? '0.5rem 0' : '1rem 0',
}));

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  textDecoration: 'none',
  fontWeight: 500,
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    color: theme.palette.primary.main,
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
    backgroundColor: theme.palette.primary.main,
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

  // Toggle mobile drawer
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

  // Navigation handlers
  const handleDashboard = () => {
    handleMenuClose();
    navigate('/user-dashboard');  
  };

  const handleMyProfile = () => {
    handleMenuClose();
    navigate('/user-dashboard/profile');
  };

  const handleLogout = () => {
    handleMenuClose();
    try {
      localStorage.removeItem('tm_user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
    navigate('/login', { replace: true, state: { loggedOut: true });
  };

  // Check if user is logged in
  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('tm_user')) || null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }, []);

  const isLoggedIn = !!stored;
  const displayName = stored?.userName || 'User';
  const userEmail = stored?.email || '';
  const userRole = stored?.role || 'Customer';
  
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
              <Link 
                to="/" 
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              >
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
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
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
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.text}
                  to={link.path}
                  active={location.pathname === link.path ? 1 : 0}
                  sx={{ mx: 1 }}
                >
                  {link.text}
                </NavLink>
              ))}
              
              {/* Search Icon */}
              <IconButton 
                onClick={handleSearchToggle}
                sx={{ ml: 1, color: 'text.primary' }}
              >
                <SearchIcon />
              </IconButton>

              {/* Notifications */}
              <NotificationBell notifications={sampleNotifications} />

              {/* User Menu / Login Button */}
              {isLoggedIn ? (
                <>
                  <Tooltip title={displayName}>
                    <IconButton
                      onClick={handleMenuOpen}
                      size="small"
                      sx={{ ml: 1 }}
                      aria-controls={openMenu ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? 'true' : undefined}
                    >
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: 'primary.main',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                        }}
                      >
                        {initials}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openMenu}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userEmail}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleDashboard}>
                      <ListItemText>Dashboard</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleMyProfile}>
                      <ListItemText>My Profile</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemText primaryTypographyProps={{ color: 'error.main' }}>
                        Logout
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="medium"
                  sx={{
                    ml: 2,
                    px: 3,
                    py: 1,
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)',
                      background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Search Bar */}
          {searchOpen && (
            <Box sx={{ py: 2, transition: 'all 0.3s ease' }}>
              <form onSubmit={handleSearch}>
                <Box sx={{ position: 'relative', maxWidth: 600, mx: 'auto' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search destinations, tours, packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'divider',
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '1px',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon 
                          sx={{ 
                            color: 'text.secondary',
                            mr: 1,
                          }}
                        />
                      ),
                      endAdornment: searchTerm && (
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm('')}
                          sx={{ mr: 1 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ),
                      sx: {
                        height: 48,
                        pr: 0,
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      position: 'absolute',
                      right: 4,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: 40,
                      px: 3,
                      borderRadius: '8px',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                      '&:hover': {
                        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: '320px',
            boxSizing: 'border-box',
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            boxShadow: '4px 0 30px rgba(0, 0, 0, 0.1)',
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
                className="hover-scale"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)',
                    background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </List>
        <div className="px-4 pb-4">
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search destinations, tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border)',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" className="text-brand hover-scale">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </form>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
