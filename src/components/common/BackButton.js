import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const BackButton = ({ to = "/", label = "Home", ...props }) => {
  return (
    <Button
      component={Link}
      to={to}
      variant="outlined"
      color="primary"
      startIcon={<ArrowBackIosNewIcon fontSize="small" />}
      sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        textTransform: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        color: '#1e40af',
        borderColor: '#1e40af',
        '&:hover': {
          backgroundColor: 'rgba(30, 64, 175, 0.1)',
          borderColor: '#1e3a8a',
          color: '#1e3a8a',
        },
        ...props.sx
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default BackButton;
