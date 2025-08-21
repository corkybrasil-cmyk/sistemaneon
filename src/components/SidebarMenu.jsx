import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 280;

const SidebarMenu = ({ open, onClose, menuItems, sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: sidebarOpen ? drawerWidth : 64,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      open={open}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(item.path)}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: sidebarOpen ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: '#4B009720',
                  borderRight: `3px solid #4B0097`,
                  '& .MuiListItemIcon-root': { color: '#4B0097' },
                  '& .MuiListItemText-primary': { color: '#4B0097', fontWeight: 'bold' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 2 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SidebarMenu;
