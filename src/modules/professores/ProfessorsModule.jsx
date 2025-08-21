import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const ProfessorsModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestão de Professores
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Novo Professor
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá o gerenciamento completo de professores, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Cadastro de professores" color="primary" variant="outlined" />
          <Chip label="Horários de aula" color="primary" variant="outlined" />
          <Chip label="Disciplinas lecionadas" color="primary" variant="outlined" />
          <Chip label="Turmas atribuídas" color="primary" variant="outlined" />
          <Chip label="Avaliações de desempenho" color="primary" variant="outlined" />
          <Chip label="Relatórios" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfessorsModule;
