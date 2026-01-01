import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: '100%',
          background: '#ffffff',
          color: 'var(--text)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2.5
          }}>
            <Box
              className="logo-icon"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'rotate(15deg)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                M
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
              <Typography variant="caption" sx={{ 
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontSize: '0.7rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'block',
                mt: 0.2
              }}>
                Admin Dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            '& > *': {
              transition: 'all 0.2s ease'
            }
          }}>
            {user && (
              <NotificationBell
                notifications={notifications}
                onReadAll={handleReadAllNotifications}
                sx={{
                  color: 'var(--text-muted)',
                  '&:hover': {
                    color: '#4f46e5',
                    transform: 'scale(1.1)'
                  }
                }}
              />
            )}

            {user && (
              <Box 
                onClick={handleMenuOpen}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 0.5,
                  pr: 1.5,
                  borderRadius: '50px',
                  background: 'rgba(79, 70, 229, 0.1)',
                  border: '1px solid rgba(79, 70, 229, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(79, 70, 229, 0.15)',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)'
                  }
                }}
              >
                <Tooltip title={displayName} arrow>
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: '#4f46e5',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      '&:hover': {
                        transform: 'scale(1.08)',
                        boxShadow: '0 3px 10px rgba(79, 70, 229, 0.3)'
                      }
                    }}
                  >
                    {initials}
                  </Avatar>
                </Tooltip>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4f46e5',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'block' },
                    maxWidth: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {displayName}
                </Typography>
                <ArrowDropDownIcon 
                  sx={{ 
                    color: '#4f46e5',
                    transition: 'transform 0.2s ease',
                    ...(openMenu && {
                      transform: 'rotate(180deg)'
                    })
                  }} 
                />
              </Box>
            )}
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.05)',
                '& .MuiMenuItem-root': {
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(79, 70, 229, 0.08)'
                  },
                  '&:active': {
                    backgroundColor: 'rgba(79, 70, 229, 0.12)'
                  }
                },
                '& .MuiDivider-root': {
                  my: 0.5
                }
              }
            }}
            MenuListProps={{
              sx: { py: 0.5 }
            }}
          >
            <Box px={2} py={1.5} sx={{ bgcolor: '#f9fafb', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                Administrator
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/');
              }}
              sx={{
                '&:hover': {
                  '& .MuiSvgIcon-root': {
                    transform: 'translateX(2px)'
                  }
                }
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                  color: 'text.primary',
                  '& .MuiSvgIcon-root': {
                    color: '#4f46e5',
                    fontSize: '1.1rem',
                    transition: 'transform 0.2s ease'
                  }
                }}
              >
                <span>Back to Site</span>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout} 
              sx={{ 
                color: '#ef4444',
                '&:hover': {
                  '& .MuiSvgIcon-root': {
                    transform: 'translateX(2px)'
                  }
                }
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.1rem',
                    transition: 'transform 0.2s ease'
                  }
                }}
              >
                <span>Logout</span>
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <AdminSidebar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { sm: `calc(100% - 72px)` },
            ml: { sm: '72px' },
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              animation: 'fadeInUp 400ms ease-out', 
              '@keyframes fadeInUp': { 
                from: { opacity: 0, transform: 'translateY(8px)' }, 
                to: { opacity: 1, transform: 'translateY(0)' } 
              } 
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}