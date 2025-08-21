import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color = 'primary', trend }) => (
  <Card elevation={2}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              {trend.direction === 'up' ? (
                <TrendingUpIcon color="success" fontSize="small" />
              ) : (
                <TrendingDownIcon color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={trend.direction === 'up' ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {trend.value}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = () => {
      setTimeout(() => {
        setDashboardData({
          totalStudents: 250,
          totalClasses: 12,
          totalRevenue: 45000,
          pendingPayments: 8500,
          attendanceRate: 95.2,
          recentActivities: [
            { id: 1, type: 'payment', description: 'Pagamento recebido de João Silva', time: '2 horas atrás' },
            { id: 2, type: 'student', description: 'Novo aluno cadastrado: Maria Santos', time: '3 horas atrás' },
            { id: 3, type: 'incident', description: 'Nova ocorrência registrada para Pedro Costa', time: '5 horas atrás' },
          ],
        });
        setLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        Visão geral do sistema escolar
      </Typography>

      <Grid container spacing={3}>
        {/* Cards de Estatísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Alunos"
            value={dashboardData?.totalStudents}
            icon={<SchoolIcon />}
            color="primary"
            trend={{ direction: 'up', value: 5.2 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Turmas Ativas"
            value={dashboardData?.totalClasses}
            icon={<PeopleIcon />}
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Receita do Mês"
            value={`R$ ${dashboardData?.totalRevenue?.toLocaleString()}`}
            icon={<MoneyIcon />}
            color="success"
            trend={{ direction: 'up', value: 12.5 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taxa de Presença"
            value={`${dashboardData?.attendanceRate}%`}
            icon={<AssignmentIcon />}
            color="info"
            trend={{ direction: 'down', value: 2.1 }}
          />
        </Grid>

        {/* Atividades Recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Atividades Recentes
            </Typography>
            <Box>
              {dashboardData?.recentActivities?.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de Receita (placeholder) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Receita Mensal
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary">
                Gráfico de receita mensal será implementado aqui
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Pagamentos Pendentes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="warning.main">
              Pagamentos Pendentes
            </Typography>
            <Typography variant="h4" color="warning.main">
              R$ {dashboardData?.pendingPayments?.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total de mensalidades em atraso
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
