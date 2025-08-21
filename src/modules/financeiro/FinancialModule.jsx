import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const FinancialModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestão Financeira
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Nova Cobrança
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá o controle financeiro completo, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Mensalidades" color="primary" variant="outlined" />
          <Chip label="Boletos automáticos" color="primary" variant="outlined" />
          <Chip label="Controle de inadimplência" color="primary" variant="outlined" />
          <Chip label="Relatórios financeiros" color="primary" variant="outlined" />
          <Chip label="Descontos e bolsas" color="primary" variant="outlined" />
          <Chip label="Fluxo de caixa" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default FinancialModule;
