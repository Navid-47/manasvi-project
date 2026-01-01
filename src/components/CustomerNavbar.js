// src/components/CustomerNavbar.js
import React, { useEffect, useState } from 'react';

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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { getNotificationsForUser, markAllAsReadForUser } from '../services/notificationService';

const CustomerNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const refresh = () => {
      try {
        setNotifications(getNotificationsForUser(user));
      } catch {
        // ignore
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
  }, [user]);

  const handleDrawerToggle = () => setMobileOpen((p) => !p);
  const handleSearchToggle = () => {
    setIsSearchOpen(prev => !prev);
    // Clear search term when closing
    if (isSearchOpen) {
      setSearchTerm('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page with the search term
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  // Handle search when pressing Enter in the search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  const handleReadAllNotifications = () => {
    if (!user) return;
    try {
      markAllAsReadForUser(user);
    } catch {
      // ignore
    }
  };

  const displayName = user?.userName || (user?.email ? user.email.split('@')[0] : 'User');

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
    logout();
    navigate('/login', { replace: true, state: { loggedOut: true } });
  };

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Destinations', path: '/destinations' },
    { text: 'Tours', path: '/tours' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          background: '#e1f0ff',
          color: 'var(--text)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: { xs: 2, md: 4 },
          py: 1.5,
          maxWidth: '100%',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2.5,
            '&:hover': {
              '& .logo-icon': {
                transform: 'rotate(15deg)'
              }
            }
          }}>
            <Box
              className="logo-icon"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                TM
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: 'var(--text)',
                fontSize: '1.25rem',
                lineHeight: 1.2,
                letterSpacing: '0.3px'
              }}>
                Travel Manasvi
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.text}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'text-brand font-bold'
                    : 'text-text hover:text-brand'
                } transition-all duration-300 font-medium transform hover:scale-105 hover:-translate-y-0.5 no-underline`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.text}
              </Link>
            ))}

            {isSearchOpen ? (
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for destinations..."
                  className="border-0 outline-0 bg-transparent text-sm text-gray-800 w-40 md:w-48 px-2 py-1"
                  autoFocus
                />
                <IconButton 
                  onClick={handleSearch} 
                  size="small"
                  className="text-brand hover:bg-brand/10"
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={handleSearchToggle} 
                  size="small"
                  className="text-gray-500 hover:bg-gray-100"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <IconButton
                onClick={handleSearchToggle}
                className="text-text hover:text-brand transition-all duration-300 transform hover:scale-110"
              >
                <SearchIcon />
              </IconButton>
            )}

            {user && (
              <NotificationBell
                notifications={notifications}
                onReadAll={handleReadAllNotifications}
              />
            )}

            {/* Profile Avatar + Menu */}
            <Box className="flex items-center gap-2">
              <Tooltip title={displayName}>
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  className="hover-scale"
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: 'var(--primary-dark)',
                      color: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'scale(1.08)',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
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
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden">
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} className="text-text hover:text-brand transition-all duration-300 transform hover:scale-110">
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} className="md:hidden" PaperProps={{ sx: { width: '80%', maxWidth: '300px' } }}>
        <div className="p-4 bg-brand text-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2 hover-scale">
                <span className="text-brand font-bold text-sm">TM</span>
              </div>
              <span className="text-xl font-bold">Travel Manasvi</span>
            </div>
            <IconButton onClick={handleDrawerToggle} className="text-white hover-scale">
              <CloseIcon />
            </IconButton>
          </div>

          {/* Profile Inline */}
          <div className="flex items-center gap-3">
            <Avatar sx={{ bgcolor: 'var(--primary-dark)', color: '#ffffff', width: 40, height: 40, fontSize: '1.1rem', fontWeight: 700, border: '1px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {initials}
            </Avatar>
            <div>
              <div className="font-semibold">{displayName}</div>
              <div className="text-white/80 text-sm">Customer</div>
            </div>
          </div>
        </div>

        <List>
          {navLinks.map((link) => (
            <ListItem button key={link.text} component={Link} to={link.path} onClick={handleDrawerToggle} className={`${location.pathname === link.path ? 'bg-brand/10' : ''} transition-all duration-300 transform hover:scale-105 hover:bg-brand/20 rounded-lg my-1`}>
              <ListItemText primary={link.text} className={location.pathname === link.path ? 'text-brand font-bold' : 'text-text'} />
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem button onClick={() => { handleDrawerToggle(); navigate('/user-dashboard'); }} className="mx-2 rounded transition-all duration-300 transform hover:scale-105 hover:bg-brand/10">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => { handleDrawerToggle(); navigate('/user-dashboard/profile'); }} className="mx-2 rounded transition-all duration-300 transform hover:scale-105 hover:bg-brand/10">
            <ListItemText primary="My Profile" />
          </ListItem>
          <ListItem button onClick={() => { handleDrawerToggle(); handleLogout(); }} className="mx-2 rounded transition-all duration-300 transform hover:scale-105 hover:bg-brand/10">
            <ListItemText primary="Logout" />
          </ListItem>
        </List>

        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <TextField fullWidth variant="outlined" placeholder="Search for destinations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ backgroundColor: 'white', borderRadius: '8px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'var(--border)' } } }} InputProps={{ endAdornment: (<IconButton type="submit" className="text-brand hover-scale"><SearchIcon /></IconButton>) }} />
          </form>
        </div>
      </Drawer>
    </>
  );
};

export default CustomerNavbar;