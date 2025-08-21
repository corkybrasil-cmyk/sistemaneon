import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ResponsiblesModule = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Gestão de Responsáveis
      </Typography>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Módulo em desenvolvimento
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Este módulo permitirá gerenciar os responsáveis pelos alunos, incluindo:
        </Typography>
        <ul style={{ textAlign: 'left', marginTop: 16 }}>
          <li>Cadastro de responsáveis</li>
          <li>Vinculação com alunos</li>
          <li>Dados de contato</li>
          <li>Histórico de comunicações</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default ResponsiblesModule;
