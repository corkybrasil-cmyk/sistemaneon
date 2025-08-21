import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const GradesModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestão de Notas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Lançar Notas
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá o gerenciamento completo de notas, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Lançamento de notas" color="primary" variant="outlined" />
          <Chip label="Boletins escolares" color="primary" variant="outlined" />
          <Chip label="Médias por bimestre" color="primary" variant="outlined" />
          <Chip label="Histórico acadêmico" color="primary" variant="outlined" />
          <Chip label="Relatórios de desempenho" color="primary" variant="outlined" />
          <Chip label="Portal do responsável" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default GradesModule;
