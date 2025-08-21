import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const ScheduleModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Grade Horária
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Novo Horário
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá o gerenciamento da grade horária, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Grade semanal" color="primary" variant="outlined" />
          <Chip label="Alocação de salas" color="primary" variant="outlined" />
          <Chip label="Horário dos professores" color="primary" variant="outlined" />
          <Chip label="Conflitos automáticos" color="primary" variant="outlined" />
          <Chip label="Substituições" color="primary" variant="outlined" />
          <Chip label="Impressão de horários" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default ScheduleModule;
