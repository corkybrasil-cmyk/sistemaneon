import React, { useState } from 'react';
import { Box, Paper, Typography, Alert, TextField, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email === 'admin@escola.com' && password === 'admin123') {
        onLogin({
          id: 1,
          name: 'Administrador',
          email: email,
          role: 'admin'
        });
      } else {
        setError('Email ou senha incorretos. Use: admin@escola.com / admin123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            ERP Escolar
          </Typography>
          <Typography variant="h6" color="textSecondary">
            NeonEducacional
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} placeholder="admin@escola.com" />
        <TextField fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} placeholder="admin123" />
        <Button fullWidth variant="contained" size="large" onClick={handleLogin} disabled={loading} sx={{ py: 1.5 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
          <strong>Credenciais de teste:</strong><br />
          Email: admin@escola.com<br />
          Senha: admin123
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginScreen;
