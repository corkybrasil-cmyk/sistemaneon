import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AttendanceModule = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Controle de Chamada
      </Typography>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Módulo em desenvolvimento
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Este módulo permitirá gerenciar a presença dos alunos, incluindo:
        </Typography>
        <ul style={{ textAlign: 'left', marginTop: 16 }}>
          <li>Registro de presença/falta diária</li>
          <li>Relatórios de frequência</li>
          <li>Alertas automáticos para responsáveis</li>
          <li>Justificativas de faltas</li>
          <li>Estatísticas de presença por turma</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default AttendanceModule;
