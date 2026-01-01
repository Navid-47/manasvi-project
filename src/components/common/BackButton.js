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
        '&:hover': {
          backgroundColor: 'rgba(37, 99, 235, 0.04)',
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
