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
import InsightsIcon from '@mui/icons-material/Insights';
import InventoryIcon from '@mui/icons-material/Inventory2';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const collapsedWidth = 72;
const expandedWidth = 260;

export default function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { logout } = useAuth();

  const items = [
    { to: '/admin-dashboard', icon: <DashboardIcon />, label: 'Overview' },
    { to: '/admin-dashboard/bookings', icon: <EventNoteIcon />, label: 'Bookings' },
    { to: '/admin-dashboard/packages', icon: <InventoryIcon />, label: 'Packages' },
    { to: '/admin-dashboard/payments', icon: <ReceiptLongIcon />, label: 'Payments' },
    { to: '/admin-dashboard/analytics', icon: <InsightsIcon />, label: 'Analytics' },
  ];

  const handleLogout = () => {
    logout();
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
        '& .MuiDrawer-paper': {
          width: isExpanded ? expandedWidth : collapsedWidth,
          borderRight: '1px solid #e2e8f0',
          backgroundColor: 'white',
          transition: 'width 0.2s ease',
          boxShadow: '2px 0 10px rgba(0,0,0,0.02)',
          overflowX: 'hidden',
          height: '100vh',
          position: 'relative',
          '&:hover': {
            boxShadow: '4px 0 15px rgba(0,0,0,0.04)'
          }
        },
      }}
    >
      <Toolbar>
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          py: 2, 
          px: 1 
        }}>
          <Box
            sx={{
              width: isExpanded ? 120 : 40,
              height: 40,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: isExpanded ? '1.2rem' : '1rem',
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {isExpanded ? 'MANASVI' : 'M'}
          </Box>
        </Box>
      </Toolbar>
      
      <Box sx={{ overflow: 'hidden', py: 1, px: 1 }}>
        <List>
          {items.map((item) => (
            <Tooltip key={item.to} title={!isExpanded ? item.label : ''} placement="right" arrow>
              <ListItemButton
                component={NavLink}
                to={item.to}
                sx={{
                  minHeight: 48,
                  justifyContent: isExpanded ? 'initial' : 'center',
                  px: 2.5,
                  color: '#64748b',
                  borderRadius: '8px',
                  mx: 0.5,
                  my: 0.5,
                  '&.active': {
                    color: '#4f46e5',
                    backgroundColor: '#eef2ff',
                    '& .MuiListItemIcon-root': {
                      color: '#4f46e5',
                    },
                    '&:hover': {
                      backgroundColor: '#e0e7ff',
                    }
                  },
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    '& .MuiListItemIcon-root': {
                      color: '#4f46e5',
                    },
                    color: '#4f46e5',
                  },
                  transition: 'all 0.2s ease',
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
          
          <Box sx={{ mt: 1, px: 1 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: isExpanded ? 'initial' : 'center',
                px: 2.5,
                color: '#ef4444',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  '& .MuiListItemIcon-root': {
                    color: '#dc2626',
                  },
                  color: '#dc2626',
                },
                transition: 'all 0.2s ease',
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
          </Box>
        </List>
      </Box>
    </Drawer>
  );
}