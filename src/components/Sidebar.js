import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, ListItemIcon, Toolbar, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';

const defaultItems = [
  { label: 'Dashboard', path: '/user-dashboard', icon: <DashboardIcon /> },
  { label: 'My Bookings', path: '/user-dashboard/bookings', icon: <EventSeatIcon /> },
  { label: 'Payment History', path: '/user-dashboard/payments', icon: <PaymentIcon /> },
  { label: 'Profile', path: '/user-dashboard/profile', icon: <PersonIcon /> },
];

const Sidebar = ({ open = true, width = 260, items = defaultItems, currentPath = '/', onNavigate }) => {
  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{ sx: { width, borderRight: '1px solid var(--border)' } }}
    >
      <Toolbar />
      <Box className="px-4 py-3">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
        </div>
        <Typography variant="subtitle2" className="text-text-muted mb-3">Menu</Typography>
        <List>
          {items.map((item) => {
            const active = currentPath === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => onNavigate?.(item.path)}
                selected={active}
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  '&.Mui-selected': { backgroundColor: 'rgba(0,123,255,0.12)' },
                  '&:hover': { backgroundColor: 'rgba(0,123,255,0.08)' },
                }}
              >
                {item.icon ? <ListItemIcon sx={{ minWidth: 36, color: active ? 'var(--brand)' : 'inherit' }}>{item.icon}</ListItemIcon> : null}
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500, color: active ? 'var(--brand)' : 'inherit' }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;