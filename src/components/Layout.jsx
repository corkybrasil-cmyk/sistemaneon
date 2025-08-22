import React, { useState } from 'react';
import {
  Box,
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
  {/* AppBar removed */}
  <Box id="box">
    {children}
  </Box>
    </>
  );
}

export default Layout;

