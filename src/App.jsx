import React, { useState } from 'react';
import './AppLayout.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import logo from './assets/logo.svg';
import {
  Box,
  Drawer,
  AppBar,
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
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
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
import Dashboard from './modules/dashboard/DashboardClean';
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
import SidebarMenu from './components/SidebarMenu';

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

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Alunos', icon: <SchoolIcon />, path: '/alunos' },
  { text: 'Professores', icon: <PeopleIcon />, path: '/professores' },
  { text: 'Frequência', icon: <AssignmentIcon />, path: '/frequencia' },
  { text: 'Notas', icon: <GradeIcon />, path: '/notas' },
  { text: 'Financeiro', icon: <MoneyIcon />, path: '/financeiro' },
  { text: 'Turmas', icon: <ClassIcon />, path: '/turmas' },
  { text: 'Horários', icon: <ScheduleIcon />, path: '/horarios' },
  { text: 'Comunicação', icon: <ChatIcon />, path: '/comunicacao' },
  { text: 'Relatórios', icon: <ReportIcon />, path: '/relatorios' },
  { text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' },
];

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (email === 'admin@escola.com' && password === 'admin123') {
        onLogin({
          id: 1,
          name: 'Administrador',
          email: email,
          role: 'admin'
        });
      } else {
        setError('Email ou senha incorretos. Use: admin@escola.com / admin123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            ERP Escolar
          </Typography>
          <Typography variant="h6" color="textSecondary">
            NeonEducacional
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="admin@escola.com"
        />
        
        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          placeholder="admin123"
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
          <strong>Credenciais de teste:</strong><br />
          Email: admin@escola.com<br />
          Senha: admin123
        </Typography>
      </Paper>
    </Box>
  );
};

const MainLayout = ({ user, onLogout, showHeader = true }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => location.pathname.startsWith(item.path));
    return currentItem ? currentItem.text : 'Dashboard';
  };

  return (
    <div className="layout-root">
      <div className="layout-header">
        {showHeader && (
          <Header
            theme={theme}
            user={user}
            anchorEl={anchorEl}
            handleProfileMenuOpen={handleProfileMenuOpen}
            handleProfileMenuClose={handleProfileMenuClose}
            onLogout={onLogout}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
      </div>
      <div className="layout-body">
        <div className="layout-drawer" style={{ width: 280 }}>
          <SidebarMenu
            open={sidebarOpen}
            onClose={handleDrawerToggle}
            menuItems={menuItems}
            sidebarOpen={sidebarOpen}
          />
        </div>
        <div className="layout-content" style={{ marginLeft: sidebarOpen ? 0 : '-280px', transition: 'margin-left 0.3s' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alunos" element={<StudentsModule />} />
            <Route path="/professores" element={<ProfessorsModule />} />
            <Route path="/frequencia" element={<AttendanceModule />} />
            <Route path="/notas" element={<GradesModule />} />
            <Route path="/financeiro" element={<FinancialModule />} />
            <Route path="/turmas" element={<ClassesModule />} />
            <Route path="/horarios" element={<ScheduleModule />} />
            <Route path="/comunicacao" element={<CommunicationModule />} />
            <Route path="/relatorios" element={<ReportsModule />} />
            <Route path="/configuracoes" element={<ConfigModule />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user ? (
          <MainLayout user={user} onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
