import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import AppBar from './AppBar';
import AppDrawer from './Drawer';
import { useState } from 'react';
import InterceptorProvider from '../components/InterceptorProvider';

export default function MainLayout() {
  const [mobileOpen, setMoblieOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMoblieOpen((prev) => !prev);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <InterceptorProvider />

      <AppBar onDrawerToggle={handleDrawerToggle} />

      <AppDrawer mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f5f7fa',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}