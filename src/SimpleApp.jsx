import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

const SimpleApp = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          ERP NeonEducacional
        </Typography>
        
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          Sistema de Gestão Escolar
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          🎉 <strong>Projeto criado com sucesso!</strong>
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            ✅ React + Vite funcionando<br />
            ✅ Material-UI carregado<br />
            ✅ Estrutura modular criada<br />
            ✅ Rotas configuradas<br />
            ✅ Contextos preparados
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          onClick={() => window.location.reload()}
        >
          Ir para Login
        </Button>
      </Paper>
    </Box>
  );
};

export default SimpleApp;
