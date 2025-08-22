import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Sidebar from './Sidebar';
import { useTheme } from '@mui/material/styles';
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

  const theme = useTheme();
  const { user, logout } = useAuth();

  return (
    <>

      <div
        id="principal-sidebar"
        style={{
          display: 'flex',
        }}
      >
        <div
          id="sidebar"
          style={{
            width: 240,
            height: '100%',
          }}
        >
          <Sidebar />
        </div>
        <div
          id="principal"
          style={{
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;

