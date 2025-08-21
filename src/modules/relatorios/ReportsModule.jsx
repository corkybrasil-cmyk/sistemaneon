import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const ReportsModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Relatórios e Análises
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Gerar Relatório
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá a geração de relatórios avançados, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Relatórios financeiros" color="primary" variant="outlined" />
          <Chip label="Desempenho acadêmico" color="primary" variant="outlined" />
          <Chip label="Frequência escolar" color="primary" variant="outlined" />
          <Chip label="Análise de inadimplência" color="primary" variant="outlined" />
          <Chip label="Dashboard executivo" color="primary" variant="outlined" />
          <Chip label="Exportação em PDF/Excel" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportsModule;
