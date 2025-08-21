import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const WhatsAppModule = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Integração WhatsApp
      </Typography>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Módulo em desenvolvimento
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Este módulo permitirá automações via WhatsApp, incluindo:
        </Typography>
        <ul style={{ textAlign: 'left', marginTop: 16 }}>
          <li>Notificações automáticas de faltas</li>
          <li>Lembretes de pagamento</li>
          <li>Alertas de mensalidades em atraso</li>
          <li>Comunicados gerais</li>
          <li>Confirmação de recebimento de mensagens</li>
          <li>Templates personalizáveis</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default WhatsAppModule;
