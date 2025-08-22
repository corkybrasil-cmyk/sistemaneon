import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';



const Layout = ({ children }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useCustomTheme();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ERP NeonEducacional
          </Typography>
          <IconButton color="inherit" onClick={toggleDarkMode} sx={{ mr: 1 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton color="inherit" onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <IconButton>
                <AccountCircle fontSize="small" />
              </IconButton>
              <Typography variant="body2">
                {user?.name || 'Usuário'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user?.email || 'usuario@escola.com'}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <IconButton>
                <ExitToApp fontSize="small" />
              </IconButton>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ pt: 8 }}>
        {children}
      </Box>
    </>
  );
}

export default Layout;

