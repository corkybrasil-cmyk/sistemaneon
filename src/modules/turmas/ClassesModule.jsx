import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const ClassesModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestão de Turmas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Nova Turma
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá o gerenciamento completo de turmas, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Criação de turmas" color="primary" variant="outlined" />
          <Chip label="Vinculação de alunos" color="primary" variant="outlined" />
          <Chip label="Atribuição de professores" color="primary" variant="outlined" />
          <Chip label="Grade horária" color="primary" variant="outlined" />
          <Chip label="Disciplinas da turma" color="primary" variant="outlined" />
          <Chip label="Relatórios por turma" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default ClassesModule;
