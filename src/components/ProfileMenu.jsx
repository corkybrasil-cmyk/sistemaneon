import React from 'react';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => { handleClose(); logout(); };

  // Avatar: foto ou inicial do nome
  const getAvatar = () => {
    if (user && user.photoUrl) {
      return <Avatar src={user.photoUrl} />;
    }
    if (user && user.name) {
      return (
        <Avatar sx={{ bgcolor: '#7c3aed', color: '#fff' }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
    return <Avatar sx={{ bgcolor: '#7c3aed', color: '#fff' }} />;
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen} size="large">
        {getAvatar()}
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={() => { handleClose(); navigate('/configuracoes'); }}>Configurações</MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/perfil'); }}>Perfil</MenuItem>
        <MenuItem onClick={handleLogout} style={{ color: '#d32f2f' }}>Sair</MenuItem>
      </Menu>
    </>
  );
}
