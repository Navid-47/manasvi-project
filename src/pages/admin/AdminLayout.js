import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import NotificationBell from '../../components/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getNotificationsForUser, markAllAsReadForUser } from '../../services/notificationService';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const displayName = user?.userName || (user?.email ? user.email.split('@')[0] : 'Admin');
  const initials = displayName
    .split('.')
    .join(' ')
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  React.useEffect(() => {
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

  const handleReadAllNotifications = () => {
    if (!user) return;
    try {
      markAllAsReadForUser(user);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login', { replace: true, state: { loggedOut: true } });
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                backgroundColor: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                TM
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text)' }}>
                Travel Manasvi
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Admin Dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {user && (
              <NotificationBell
                notifications={notifications}
                onReadAll={handleReadAllNotifications}
              />
            )}

            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title={displayName}>
                  <IconButton onClick={handleMenuOpen} size="small">
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'var(--brand)' }}>
                      {initials}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <IconButton onClick={handleMenuOpen} size="small" sx={{ color: 'var(--text)' }}>
                  <ArrowDropDownIcon />
                </IconButton>
              </Box>
            )}

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
                  Admin
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate('/');
                }}
              >
                Back to Site
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Box sx={{ display: 'flex', backgroundColor: 'var(--bg)', minHeight: 'calc(100vh - 120px)' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Box sx={{ animation: 'fadeInUp 400ms ease-out', '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
