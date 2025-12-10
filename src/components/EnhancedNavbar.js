import React, { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon,
  ListItemText, 
  TextField, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider, 
  Tooltip, 
  Box, 
  Typography,
  Button,
  alpha,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Badge,
  Container,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
  backdropFilter: scrolled ? 'blur(10px)' : 'none',
  boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
  transition: 'all 0.3s ease-in-out',
  borderBottom: scrolled ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(1, 0),
}));

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 800,
  fontSize: '1.5rem',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textDecoration: 'none',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s',
  },
}));

const NavLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  fontWeight: 500,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const SearchContainer = styled('div')(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease-in-out',
  width: open ? '300px' : '40px',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'inherit',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: '1em',
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const UserMenuButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.75, 1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const EnhancedNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { text: 'Home', path: '/', icon: <ExploreOutlinedIcon /> },
    { text: 'Flights', path: '/flights', icon: <FlightTakeoffOutlinedIcon /> },
    { text: 'Hotels', path: '/hotels', icon: <HotelOutlinedIcon /> },
    { text: 'Packages', path: '/packages', icon: <FavoriteBorderOutlinedIcon /> },
  ];

  // Sample notifications
  const notifications = [
    { id: 1, text: 'Your booking was confirmed!', time: '2h ago', read: false },
    { id: 2, text: 'Special offer: 20% off on all destinations', time: '1d ago', read: false },
    { id: 3, text: 'Your review was published', time: '3d ago', read: true },
  ];

  // User menu handlers
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSearchOpen(false);
    }
  };

  // User authentication state
  const isLoggedIn = useMemo(() => {
    try {
      return !!JSON.parse(localStorage.getItem('tm_user'));
    } catch {
      return false;
    }
  }, []);

  const userInitials = 'JD'; // Replace with actual user initials
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Logo>TravelEase</Logo>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search destinations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List>
        {navLinks.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', pt: 2 }}>
        {isLoggedIn ? (
          <>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                navigate('/dashboard');
                handleDrawerToggle();
              }}
              sx={{ mb: 2 }}
            >
              My Dashboard
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                localStorage.removeItem('tm_user');
                window.location.href = '/';
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                navigate('/login');
                handleDrawerToggle();
              }}
              sx={{ mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                navigate('/register');
                handleDrawerToggle();
              }}
            >
              Create Account
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed" elevation={0} scrolled={isScrolled ? 1 : 0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <RouterLink to="/" style={{ textDecoration: 'none' }}>
                <Logo>TravelEase</Logo>
              </RouterLink>
              
              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 6, gap: 1 }}>
                {navLinks.map((item) => (
                  <NavLink 
                    key={item.text} 
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                  >
                    {!isMobile && <Box component="span" sx={{ mr: 1 }}>{item.icon}</Box>}
                    {item.text}
                  </NavLink>
                ))}
              </Box>
            </Box>

            {/* Desktop Right Section */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {/* Search */}
              <SearchContainer open={searchOpen}>
                {searchOpen ? (
                  <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', width: '100%' }}>
                    <SearchInput
                      autoFocus
                      fullWidth
                      placeholder="Search destinations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={() => !searchTerm && setSearchOpen(false)}
                      sx={{ color: isScrolled ? 'text.primary' : 'common.white' }}
                    />
                    <IconButton 
                      type="button" 
                      onClick={() => setSearchOpen(false)}
                      sx={{ color: isScrolled ? 'text.secondary' : 'common.white' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton 
                    onClick={() => setSearchOpen(true)}
                    sx={{ color: isScrolled ? 'text.primary' : 'common.white' }}
                  >
                    <SearchIcon />
                  </IconButton>
                )}
              </SearchContainer>

              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={handleNotificationsOpen}
                  sx={{ color: isScrolled ? 'text.primary' : 'common.white' }}
                >
                  <Badge badgeContent={unreadNotifications} color="error">
                    <NotificationsNoneOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              {isLoggedIn ? (
                <>
                  <UserMenuButton
                    onClick={handleUserMenuOpen}
                    startIcon={
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        {userInitials}
                      </Avatar>
                    }
                    endIcon={<ArrowDropDownIcon />}
                    sx={{
                      color: isScrolled ? 'text.primary' : 'common.white',
                      borderColor: isScrolled ? 'divider' : 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        borderColor: isScrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.4)',
                      },
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' }, ml: 1 }}>
                      My Account
                    </Box>
                  </UserMenuButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 2,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        overflow: 'visible',
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
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        John Doe
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        john@example.com
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={() => { navigate('/dashboard'); handleUserMenuClose(); }}>
                      <ListItemIcon>
                        <PersonOutlineOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Dashboard</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/bookings'); handleUserMenuClose(); }}>
                      <ListItemIcon>
                        <FlightTakeoffOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>My Bookings</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/wishlist'); handleUserMenuClose(); }}>
                      <ListItemIcon>
                        <FavoriteBorderOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Wishlist</ListItemText>
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem 
                      onClick={() => {
                        localStorage.removeItem('tm_user');
                        window.location.href = '/';
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      <ListItemIcon sx={{ color: 'error.main' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </ListItemIcon>
                      <ListItemText>Sign Out</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="outlined" 
                    color={isScrolled ? 'primary' : 'inherit'}
                    sx={{
                      color: isScrolled ? 'primary.main' : 'common.white',
                      borderColor: isScrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        borderColor: isScrolled ? 'primary.dark' : 'common.white',
                        backgroundColor: isScrolled ? 'primary.light' : 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/register')}
                    sx={{
                      boxShadow: '0 4px 14px rgba(26, 86, 219, 0.4)',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        boxShadow: '0 6px 20px rgba(26, 86, 219, 0.5)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ color: isScrolled ? 'text.primary' : 'common.white' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
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
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            width: 360,
            maxWidth: '90vw',
            maxHeight: '60vh',
            overflow: 'auto',
            borderRadius: 2,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          {unreadNotifications > 0 && (
            <Typography variant="body2" color="primary">
              {unreadNotifications} unread {unreadNotifications === 1 ? 'notification' : 'notifications'}
            </Typography>
          )}
        </Box>
        
        {notifications.length > 0 ? (
          <Box sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <MenuItem 
                key={notification.id} 
                onClick={handleNotificationsClose}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: !notification.read ? 'action.hover' : 'background.paper',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" color="text.primary">
                    {notification.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
                {!notification.read && (
                  <Box 
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      ml: 1,
                    }}
                  />
                )}
              </MenuItem>
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        )}
        
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" color="primary">
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default EnhancedNavbar;
