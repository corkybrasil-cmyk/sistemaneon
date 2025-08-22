import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Alert } from '@mui/material';
import appwriteService from '../../services/appwriteService';

const DATABASE_ID = 'sistema';
const COLLECTION_ID = 'usuarios';

const UsersModule = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', nome: '', funcao: '', ativo: true });
  const [success, setSuccess] = useState('');

  // Carrega usuários
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await appwriteService.listDocuments(DATABASE_ID, COLLECTION_ID);
      setUsers(res.documents);
    } catch (err) {
      setError('Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Adiciona usuário
  const handleAddUser = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Cria usuário no Auth
      await appwriteService.account.create(form.email, form.password, form.nome);
      // Adiciona na coleção usuarios
      await appwriteService.createDocument(DATABASE_ID, COLLECTION_ID, {
        email: form.email,
        nome: form.nome,
        funcao: form.funcao,
        ativo: form.ativo,
      });
      setSuccess('Usuário criado com sucesso!');
      setOpen(false);
      setForm({ email: '', password: '', nome: '', funcao: '', ativo: true });
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Usuários do Sistema</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Novo Usuário</Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Ativo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.$id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.funcao}</TableCell>
                <TableCell>
                  <Switch checked={user.ativo} disabled />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Novo Usuário</DialogTitle>
        <DialogContent>
          <TextField label="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} fullWidth margin="normal" required />
          <TextField label="E-mail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Senha" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Função" value={form.funcao} onChange={e => setForm({ ...form, funcao: e.target.value })} fullWidth margin="normal" required />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography>Ativo</Typography>
            <Switch checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddUser} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Criando...' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersModule;
