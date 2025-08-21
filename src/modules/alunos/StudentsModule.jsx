import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const StudentsModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestão de Alunos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Novo Aluno
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá o gerenciamento completo de alunos, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Cadastro de alunos" color="primary" variant="outlined" />
          <Chip label="Edição de dados" color="primary" variant="outlined" />
          <Chip label="Histórico escolar" color="primary" variant="outlined" />
          <Chip label="Responsáveis vinculados" color="primary" variant="outlined" />
          <Chip label="Turmas matriculadas" color="primary" variant="outlined" />
          <Chip label="Relatórios" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentsModule;
