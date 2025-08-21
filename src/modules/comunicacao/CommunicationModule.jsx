import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const CommunicationModule = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Comunicação e WhatsApp
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Nova Mensagem
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulo em Desenvolvimento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Este módulo permitirá a comunicação automatizada via WhatsApp, incluindo:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Mensagens automáticas" color="primary" variant="outlined" />
          <Chip label="Avisos para responsáveis" color="primary" variant="outlined" />
          <Chip label="Notificações de falta" color="primary" variant="outlined" />
          <Chip label="Lembrete de mensalidade" color="primary" variant="outlined" />
          <Chip label="Campanhas promocionais" color="primary" variant="outlined" />
          <Chip label="Histórico de mensagens" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default CommunicationModule;
