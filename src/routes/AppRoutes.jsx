import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layout Components
import Login from '../components/Login';

// Module Components
import Dashboard from '../modules/dashboard/Dashboard';
import StudentsModule from '../modules/alunos/StudentsModule';
import ResponsiblesModule from '../modules/responsaveis/ResponsiblesModule';
import AttendanceModule from '../modules/chamada/AttendanceModule';
import FinancialModule from '../modules/financeiro/FinancialModule';
import ClassesModule from '../modules/turmas/ClassesModule';
import IncidentsModule from '../modules/ocorrencias/IncidentsModule';
import AccountsPayableModule from '../modules/contas-a-pagar/AccountsPayableModule';
import WhatsAppModule from '../modules/whatsapp/WhatsAppModule';
import ConfigurationsModule from '../modules/configuracoes/ConfigurationsModule';
import ProfessorsModule from '../modules/professores/ProfessorsModule';
import GradesModule from '../modules/notas/GradesModule';
import ScheduleModule from '../modules/horarios/ScheduleModule';
import CommunicationModule from '../modules/comunicacao/CommunicationModule';
import ReportsModule from '../modules/relatorios/ReportsModule';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Importação do módulo de usuários
  const UsersModule = React.lazy(() => import('../modules/usuarios/UsersModule'));

  return (
    <Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/alunos" element={<StudentsModule />} />
      <Route path="/professores" element={<ProfessorsModule />} />
      <Route path="/responsaveis" element={<ResponsiblesModule />} />
      <Route path="/chamada" element={<AttendanceModule />} />
      <Route path="/notas" element={<GradesModule />} />
      <Route path="/financeiro" element={<FinancialModule />} />
      <Route path="/turmas" element={<ClassesModule />} />
      <Route path="/horarios" element={<ScheduleModule />} />
      <Route path="/comunicacao" element={<CommunicationModule />} />
      <Route path="/relatorios" element={<ReportsModule />} />
      <Route path="/configuracoes" element={<ConfigurationsModule />} />
      <Route path="/ocorrencias" element={<IncidentsModule />} />
      <Route path="/contas-a-pagar" element={<AccountsPayableModule />} />
      <Route path="/whatsapp" element={<WhatsAppModule />} />
      <Route path="/usuarios" element={
        <React.Suspense fallback={<div>Carregando usuários...</div>}>
          <UsersModule />
        </React.Suspense>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
