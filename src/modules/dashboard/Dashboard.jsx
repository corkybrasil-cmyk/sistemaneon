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
  <Card elevation={2} sx={{ height: 180, display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <Box>
        <Typography color="textSecondary" gutterBottom variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" component="div" color={color}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ minHeight: 32, display: 'flex', alignItems: 'center', mt: 1 }}>
        {trend ? (
          <Box display="flex" alignItems="center">
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
        ) : (
          <Box sx={{ width: 48, height: 24 }} />
        )}
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.04)'
        }}
      >
        {React.cloneElement(icon, { fontSize: 'inherit', style: { width: 32, height: 32 }, color })}
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
  <Box sx={{ mt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        Visão geral do sistema escolar
      </Typography>


      {/* Atividades Recentes */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Atividades Recentes
        </Typography>
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

      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: '5rem', lineHeight: 1.2 }} color="textSecondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu.
        </Typography>
      </Box>
    </Paper>

      {/* Gráfico de Receita (placeholder) */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Receita Mensal
        </Typography>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textSecondary">
            Gráfico de receita mensal será implementado aqui
          </Typography>
        </Box>
      </Paper>

    </Box>
  );
};

export default Dashboard;
