import React, { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Divider, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationBell = ({ notifications = [], onReadAll }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton
        aria-label="Notifications"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="text-text hover:scale-105 transition-transform"
      >
        <Badge badgeContent={unreadCount} color="primary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { minWidth: 280, borderRadius: '12px' } }}
      >
        <MenuItem disableRipple>
          <ListItemText primary="Notifications" secondary={unreadCount ? `${unreadCount} unread` : 'All caught up'} />
        </MenuItem>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No notifications" />
          </MenuItem>
        ) : (
          notifications.slice(0, 6).map((n) => (
            <MenuItem key={n.id} onClick={() => setAnchorEl(null)} sx={{ alignItems: 'start', gap: 1 }}>
              <div className={`w-2 h-2 rounded-full mt-2 ${n.read ? 'bg-border' : 'bg-brand'}`} />
              <ListItemText primary={n.title} secondary={n.time || ''} />
            </MenuItem>
          ))
        )}
        <Divider />
        <MenuItem disableRipple>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              onReadAll?.();
              setAnchorEl(null);
            }}
            sx={{
              backgroundColor: 'var(--brand)',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              '&:hover': { backgroundColor: 'var(--brand-dark)' },
            }}
          >
            Mark all as read
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationBell;