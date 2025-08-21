import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AccountsPayableModule = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Contas a Pagar
      </Typography>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Módulo em desenvolvimento
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Este módulo permitirá gerenciar as contas da escola, incluindo:
        </Typography>
        <ul style={{ textAlign: 'left', marginTop: 16 }}>
          <li>Registro de fornecedores</li>
          <li>Controle de contas a pagar</li>
          <li>Agendamento de pagamentos</li>
          <li>Relatórios de gastos</li>
          <li>Fluxo de caixa</li>
          <li>Categorização de despesas</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default AccountsPayableModule;
