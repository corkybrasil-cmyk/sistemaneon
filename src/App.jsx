import React, { useState, useEffect } from 'react';
import appwriteService from './services/appwriteService';
import './AppLayout.css';
// Header import removed
import Layout from './components/Layout';
import AppBar from '@mui/material/AppBar';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import logo from './assets/logo.svg';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  TextField,
  Alert,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  // Removed SidebarMenu and menuItems imports
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  AttachMoney as MoneyIcon,
  Class as ClassIcon,
  Schedule as ScheduleIcon,
  Chat as ChatIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
  AccountCircle,
  ExitToApp,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

// Importar componentes
import Dashboard from './modules/dashboard/Dashboard';
import StudentsModule from './modules/alunos/StudentsModule';
import ProfessorsModule from './modules/professores/ProfessorsModule';
import AttendanceModule from './modules/frequencia/AttendanceModule';
import GradesModule from './modules/notas/GradesModule';
import FinancialModule from './modules/financeiro/FinancialModule';
import ClassesModule from './modules/turmas/ClassesModule';
import ScheduleModule from './modules/horarios/ScheduleModule';
import CommunicationModule from './modules/comunicacao/CommunicationModule';
import ReportsModule from './modules/relatorios/ReportsModule';
import ConfigModule from './modules/configuracoes/ConfigModule';
// SidebarMenu import removed
import LoginScreen from './components/LoginScreen';
// menuItems import removed

const drawerWidth = 280;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});





function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Usa variáveis de ambiente do Vite
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    appwriteService.initialize(endpoint, projectId);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomThemeProvider>
        <AuthProvider>
          <Router>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  ERP NeonEducacional
                </Typography>
              </Toolbar>
            </AppBar>
            <Layout>
              <AppRoutes />
            </Layout>
          </Router>
        </AuthProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default App;
