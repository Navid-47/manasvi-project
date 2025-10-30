 import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useNavigate } from 'react-router-dom';

const collapsedWidth = 72;
const expandedWidth = 260;

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const items = [
    { to: '/user-dashboard/profile', icon: <PersonIcon />, label: 'Profile' },
    { to: '/user-dashboard', icon: <DashboardIcon />, label: 'Overview' },
    { to: '/user-dashboard/bookings', icon: <EventNoteIcon />, label: 'My Bookings' },
    { to: '/user-dashboard/payments', icon: <ReceiptLongIcon />, label: 'Payment History' },
    { to: '/user-dashboard/wallet', icon: <ReceiptLongIcon />, label: 'My Wallet' },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem('tm_user');
    } catch {
      /* ignore */
    }
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      sx={{
        width: isExpanded ? expandedWidth : collapsedWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: isExpanded ? expandedWidth : collapsedWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          position: 'relative',
          height: 'calc(100vh - 64px)',
          top: 10,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'hidden', py: 1 }}>
        <List>
          {items.map((item) => (
            <Tooltip
              key={item.to}
              title={!isExpanded ? item.label : ''}
              placement="right"
              arrow
            >
              <ListItemButton
                component={NavLink}
                to={item.to}
                sx={{
                  borderRadius: 'var(--radius)',
                  mx: 1,
                  my: 0.5,
                  justifyContent: isExpanded ? 'initial' : 'center',
                  '&.active': {
                    backgroundColor: 'rgba(var(--brand-rgb), 0.08)',
                    color: 'var(--brand)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isExpanded ? 40 : 'auto',
                    color: 'inherit',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isExpanded && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          ))}
          <Tooltip title={!isExpanded ? 'Logout' : ''} placement="right" arrow>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 'var(--radius)',
                mx: 1,
                my: 0.5,
                color: 'var(--error)',
                justifyContent: isExpanded ? 'initial' : 'center',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isExpanded ? 40 : 'auto',
                  color: 'inherit',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Logout" />}
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>
    </Drawer>
  );
}
