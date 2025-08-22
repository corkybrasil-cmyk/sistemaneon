import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {

  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const notificationCount = 0;
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const getAvatar = () => {
    if (user && user.photoUrl) {
      return <Avatar src={user.photoUrl} />;
    }
    if (user && user.name) {
      return <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>;
    }
    return <Avatar><AccountCircle /></Avatar>;
  };

  return (
    <div id="principal" style={{ margin: '32px 32px 0 32px' }}>
      {children}
    </div>
  );
}

export default Layout;

