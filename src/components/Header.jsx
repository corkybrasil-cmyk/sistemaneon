import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import logo from '../assets/logo.svg';

const Header = ({ theme, user, anchorEl, handleProfileMenuOpen, handleProfileMenuClose, onLogout, handleDrawerToggle }) => (
  <AppBar
    position="static"
    sx={{ backgroundColor: '#4B0097', color: theme.palette.text.primary }}
  >
    <Toolbar sx={{ minHeight: 64, px: 2 }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: '40.5px', width: 'auto', maxWidth: '270px' }} 
        />
      </Box>
      <IconButton
        color="inherit"
        onClick={handleProfileMenuOpen}
        sx={{ p: 0 }}
      >
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
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">
              {user?.name || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.email || 'usuario@escola.com'}
            </Typography>
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </Toolbar>
  </AppBar>
);

export default Header;
