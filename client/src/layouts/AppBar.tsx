import { AppBar as MuiAppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

export default function AppBar({ onDrawerToggle } : { onDrawerToggle: () => void }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#002364FF',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          MoneyPal
        </Typography>

        
        {isAuthenticated ? (
          <>
           <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{ pr:2}}
            >
            Logout
          </Button>
          <IconButton
            color='inherit'
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{display: { sm: 'none' }}}
          >
            <MenuIcon />
          </IconButton>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}