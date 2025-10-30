import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, TextField, Avatar, Menu, MenuItem, Divider, Tooltip, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    setSearchOpen(false);
    setSearchTerm('');
  };

  // Check if user is logged in
  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('tm_user')) || null;
    } catch {
      return null;
    }
  }, []);

  const isLoggedIn = !!stored;
  const displayName = stored?.userName || 'User';
  const initials = displayName
    .split('.')
    .join(' ')
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
    } catch {}
    navigate('/login', { replace: true, state: { loggedOut: true } });
  };

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Destinations', path: '/destinations' },
    { text: 'Tours', path: '/tours' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <AppBar
        position="sticky"
        className={`shadow-md transition-all duration-300 ${isScrolled ? 'bg-white' : 'bg-white/90'}`}
        sx={{
          backgroundColor: isScrolled ? '#fff' : 'rgba(255, 255, 255, 0.9)',
          boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
          backdropFilter: isScrolled ? 'none' : 'blur(10px)'
        }}
      >
        <Toolbar className="flex justify-between items-center py-4 px-4 md:px-8">
          <div className="flex items-center animate-fade-in">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <img
                src="/images/logo.jpg"
                alt="Travel Manasvi"
                className="h-10 w-auto rounded-md object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/favicon.ico';
                }}
              />
              <span className="text-text text-xl font-bold hover:text-brand transition-colors duration-300">
                Travel Manasvi
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.text}
                to={link.path}
                className={`${
                  location.pathname === link.path ? 'text-brand font-bold' : 'text-text hover:text-brand'
                } transition-all duration-300 font-medium transform hover:scale-105 hover:-translate-y-0.5 no-underline`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.text}
              </Link>
            ))}
            <IconButton
              onClick={handleSearchToggle}
              className="text-text hover:text-brand transition-all duration-300 transform hover:scale-110"
            >
              <SearchIcon />
            </IconButton>
            {/* Show Profile Menu if logged in, otherwise show Book Now */}
            {isLoggedIn ? (
              <Box className="flex items-center gap-2">
                <Tooltip title={displayName}>
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    className="hover-scale"
                  >
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'var(--brand)' }}>
                      {initials}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={handleMenuOpen}
                  className="text-text hover:text-brand transition-all duration-300"
                  size="small"
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
                      Customer Dashboard
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                  <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Link 
                to="/login" 
                className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg no-underline"
              >
                Book Now
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <IconButton
              onClick={handleSearchToggle}
              className="text-text hover:text-brand transition-all duration-300 transform hover:scale-110"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="text-text transition-all duration-300 transform hover:scale-110"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>

        {searchOpen && (
          <div className="px-4 pb-4 md:px-8 animate-slide-in-down">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search destinations, tours, etc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'var(--border)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--brand)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--brand)',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <div className="flex items-center space-x-1">
                        <IconButton
                          onClick={handleSearchToggle}
                          className="text-text-muted hover:text-text hover-scale"
                          aria-label="Close search"
                        >
                          <CloseIcon />
                        </IconButton>
                        <IconButton type="submit" className="text-brand hover-scale" aria-label="Search">
                          <SearchIcon />
                        </IconButton>
                      </div>
                    ),
                  }}
                />
              </div>
            </form>
          </div>
        )}
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        className="md:hidden"
        PaperProps={{ sx: { width: '80%', maxWidth: '300px' } }}
      >
        <div className="p-4 bg-brand text-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.jpg"
                alt="Travel Manasvi"
                className="h-8 w-auto rounded object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/favicon.ico';
                }}
              />
              <span className="text-xl font-bold">Travel Manasvi</span>
            </div>
            <IconButton onClick={handleDrawerToggle} className="text-white hover-scale">
              <CloseIcon />
            </IconButton>
          </div>
          
          {/* Profile Inline if logged in */}
          {isLoggedIn && (
            <div className="flex items-center gap-3">
              <Avatar sx={{ bgcolor: '#fff', color: 'var(--brand)' }}>{initials}</Avatar>
              <div>
                <div className="font-semibold">{displayName}</div>
                <div className="text-white/80 text-sm">Customer</div>
              </div>
            </div>
          )}
        </div>

        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.text}
              component={Link}
              to={link.path}
              onClick={handleDrawerToggle}
              className={`${
                location.pathname === link.path ? 'bg-brand/10' : ''
              } transition-all duration-300 transform hover:scale-105 hover:bg-brand/20 rounded-lg my-1`}
            >
              <ListItemText
                primary={link.text}
                className={location.pathname === link.path ? 'text-brand font-bold' : 'text-text'}
              />
            </ListItem>
          ))}
          
          <Divider sx={{ my: 1 }} />
          
          {/* Show profile options if logged in, otherwise show Book Now */}
          {isLoggedIn ? (
            <>
              <ListItem
                button
                onClick={() => {
                  handleDrawerToggle();
                  navigate('/user-dashboard');
                }}
                className="mx-2 rounded transition-all duration-300 transform hover:scale-105 hover:bg-brand/10"
              >
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleDrawerToggle();
                  navigate('/user-dashboard/profile');
                }}
                className="mx-2 rounded transition-all duration-300 transform hover:scale-105 hover:bg-brand/10"
              >
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleDrawerToggle();
                  handleLogout();
                }}
                className="mx-2 rounded transition-all duration-300 transform hover:scale-105 hover:bg-brand/10"
              >
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <ListItem 
              button 
              component={Link}
              to="/login"
              onClick={handleDrawerToggle}
              className="bg-brand text-white mx-4 mt-4 rounded transition-all duration-300 transform hover:scale-105 hover:bg-brand-dark hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              <ListItemText primary="Book Now" />
            </ListItem>
          )}
        </List>

        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search..."
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