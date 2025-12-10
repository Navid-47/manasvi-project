# Manasvi Travel - Design System

## Color Palette

### Primary Colors
- **Primary Blue**: `#1A56DB` (Main brand color, used for primary actions)
- **Light Blue**: `#3B82F6` (Hover/focus states)
- **Dark Blue**: `#1E40AF` (Active/pressed states)

### Secondary Colors
- **Amber**: `#F59E0B` (Accent color, CTAs)
- **Light Amber**: `#FBBF24` (Hover states)
- **Dark Amber**: `#D97706` (Active states)

### Status Colors
- **Success**: `#059669` (Green)
- **Error**: `#DC2626` (Red)
- **Warning**: `#D97706` (Amber)
- **Info**: `#0284C7` (Blue)

### Neutral Colors
- **Text Primary**: `#1F2937`
- **Text Secondary**: `#4B5563`
- **Disabled**: `#9CA3AF`
- **Background**: `#F8FAFC`
- **Paper/Cards**: `#FFFFFF`

## Typography

### Font Family
- **Primary**: `Poppins`
- **Fallback**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

### Headings
```css
h1 {
  font-size: 3rem;      /* 48px */
  font-weight: 800;
  line-height: 1.2;
}

h2 {
  font-size: 2.5rem;    /* 40px */
  font-weight: 700;
  line-height: 1.25;
}

h3 {
  font-size: 2rem;      /* 32px */
  font-weight: 700;
  line-height: 1.3;
}

h4 {
  font-size: 1.5rem;    /* 24px */
  font-weight: 600;
  line-height: 1.35;
}

h5 {
  font-size: 1.25rem;   /* 20px */
  font-weight: 600;
  line-height: 1.4;
}

h6 {
  font-size: 1.125rem;  /* 18px */
  font-weight: 600;
  line-height: 1.45;
}
```

### Body Text
- **Body 1**: `1rem` (16px) - Main content
- **Body 2**: `0.875rem` (14px) - Secondary content
- **Caption**: `0.75rem` (12px) - Captions, hints

## Spacing
- **Base Unit**: `8px`
- **Common Spacings**:
  - Small: `8px`
  - Medium: `16px`
  - Large: `24px`
  - X-Large: `32px`
  - XX-Large: `48px`

## Components

### Buttons
```jsx
// Primary Button
<Button variant="contained" color="primary">
  Primary Action
</Button>

// Secondary Button
<Button variant="outlined" color="primary">
  Secondary Action
</Button>

// Text Button
<Button color="primary">
  Text Action
</Button>
```

### Cards
```jsx
<Card>
  <CardMedia
    component="img"
    height="140"
    image="/example.jpg"
    alt="Example"
  />
  <CardContent>
    <Typography variant="h6" component="div">
      Card Title
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Card content goes here.
    </Typography>
  </CardContent>
</Card>
```

### Forms
```jsx
<Box component="form" noValidate sx={{ mt: 1 }}>
  <TextField
    margin="normal"
    required
    fullWidth
    id="email"
    label="Email Address"
    name="email"
    autoComplete="email"
    autoFocus
  />
  <TextField
    margin="normal"
    required
    fullWidth
    name="password"
    label="Password"
    type="password"
    id="password"
    autoComplete="current-password"
  />
  <Button
    type="submit"
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
  >
    Sign In
  </Button>
</Box>
```

## Best Practices

1. **Consistent Spacing**
   - Use the 8px grid system for all measurements
   - Use theme.spacing() for consistent spacing

2. **Responsive Design**
   - Use Material-UI's breakpoints for responsive layouts
   - Test on multiple screen sizes

3. **Accessibility**
   - Ensure sufficient color contrast
   - Use semantic HTML elements
   - Add proper ARIA labels

4. **Performance**
   - Optimize images
   - Lazy load non-critical components
   - Use React.memo for performance optimization

## Theme Usage

### Using Theme in Components
```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ 
      color: theme.palette.primary.main,
      padding: theme.spacing(2)
    }}>
      Styled with theme
    </div>
  );
}
```

### Custom Styling
```jsx
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
    },
  },
  // ... other styles
}));
```

## Common Patterns

### Responsive Grid
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* Content */}
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    {/* Content */}
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    {/* Content */}
  </Grid>
</Grid>
```

### Loading States
```jsx
{loading ? (
  <Box display="flex" justifyContent="center" my={4}>
    <CircularProgress />
  </Box>
) : (
  <Content />
)}
```

## Icons
- Use Material-UI Icons for consistency
- All icons should be imported from `@mui/icons-material`
- Use appropriate size and color props

## Animation
- Use theme.transitions for consistent timing functions
- Keep animations subtle and purposeful
- Prefer opacity and transform for better performance

## Z-Index
- AppBar: 1200
- Drawer: 1100
- Modal: 1300
- Snackbar: 1400
- Tooltip: 1500
