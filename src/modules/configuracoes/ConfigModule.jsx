import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const ConfigModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Configurações do Sistema
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Nova Configuração
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá configurar todos os aspectos do sistema, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Dados da escola" color="primary" variant="outlined" />
          <Chip label="Usuários e permissões" color="primary" variant="outlined" />
          <Chip label="Configurações de backup" color="primary" variant="outlined" />
          <Chip label="Integrações externas" color="primary" variant="outlined" />
          <Chip label="Personalização visual" color="primary" variant="outlined" />
          <Chip label="Logs do sistema" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default ConfigModule;
