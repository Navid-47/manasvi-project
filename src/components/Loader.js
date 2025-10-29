import React, { useEffect, useState } from 'react';
import { CircularProgress, LinearProgress, Backdrop } from '@mui/material';

const Loader = ({
  fullScreen = false,
  size = 40,
  label,
  delay = 0,
  variant = 'spinner', // 'spinner' | 'bar'
  progress = 0,        // for variant 'bar': 0-100, or omit for indeterminate
  backdropOpacity = 0.6,
  className = '',
  color = 'var(--brand)'
}) => {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  if (!visible) return null;

  const spinner = (
    <CircularProgress size={size} sx={{ color }} />
  );

  const bar = (
    <div className="w-full min-w-[200px]">
      <LinearProgress
        variant={Number.isFinite(progress) && progress > 0 ? 'determinate' : 'indeterminate'}
        value={progress}
        sx={{
          '& .MuiLinearProgress-bar': { backgroundColor: color },
          '&.MuiLinearProgress-root': { backgroundColor: 'rgba(0,0,0,0.08)' }
        }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <Backdrop
        open
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          color: '#111827',
          backgroundColor: `rgba(255,255,255,${backdropOpacity})`,
          backdropFilter: 'blur(4px)'
        }}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-3">
          {variant === 'bar' ? bar : spinner}
          {label ? <span className="text-sm">{label}</span> : null}
        </div>
      </Backdrop>
    );
  }

  return (
    <div
      className={`w-full flex items-center justify-center py-10 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        {variant === 'bar' ? bar : spinner}
        {label ? <span className="text-sm">{label}</span> : null}
      </div>
    </div>
  );
};

export default Loader;