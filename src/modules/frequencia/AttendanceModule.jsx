import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AttendanceModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Controle de Frequência
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Registrar Frequência
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá o controle completo de frequência, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Registro de presença" color="primary" variant="outlined" />
          <Chip label="Faltas justificadas" color="primary" variant="outlined" />
          <Chip label="Relatórios de frequência" color="primary" variant="outlined" />
          <Chip label="Notificações automáticas" color="primary" variant="outlined" />
          <Chip label="Histórico por turma" color="primary" variant="outlined" />
          <Chip label="Estatísticas gerais" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default AttendanceModule;
