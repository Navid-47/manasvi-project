import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader = ({ fullScreen = false, size = 40 }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
        <CircularProgress size={size} sx={{ color: 'var(--brand)' }} />
      </div>
    );
  }
  return (
    <div className="w-full flex items-center justify-center py-10">
      <CircularProgress size={size} sx={{ color: 'var(--brand)' }} />
    </div>
  );
};

export default Loader;