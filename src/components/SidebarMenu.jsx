import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import '../SidebarMenuSlide.css';
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
    <motion.div
      initial={false}
      animate={{ x: sidebarOpen ? 0 : -280 }}
      transition={{ type: 'tween', duration: 0.3 }}
      style={{
        width: 280,
        boxSizing: 'border-box',
        background: '#fff',
        borderRight: '1px solid #e0e0e0',
        overflowX: 'hidden',
        height: '100%',
        position: 'relative',
        zIndex: 2,
      }}
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
    </motion.div>
  );
};

export default SidebarMenu;
