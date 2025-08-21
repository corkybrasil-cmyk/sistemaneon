import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const IncidentsModule = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Sistema de Ocorrências
      </Typography>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Módulo em desenvolvimento
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Este módulo permitirá gerenciar ocorrências dos alunos, incluindo:
        </Typography>
        <ul style={{ textAlign: 'left', marginTop: 16 }}>
          <li>Registro de ocorrências disciplinares</li>
          <li>Classificação por tipo e gravidade</li>
          <li>Notificação automática aos responsáveis</li>
          <li>Histórico completo por aluno</li>
          <li>Relatórios estatísticos</li>
          <li>Planos de ação pedagógica</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default IncidentsModule;
