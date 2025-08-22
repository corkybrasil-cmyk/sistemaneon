import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Alert } from '@mui/material';
import appwriteService from '../../services/appwriteService';
import { Query } from 'appwrite';

// Inicialize AppwriteService com endpoint e projectId válidos
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'neoneducacional';
if (!appwriteService.initialized) {
  appwriteService.initialize(APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID);
}

const DATABASE_ID = 'sistema';
const COLLECTION_ID = 'usuarios';

const UsersModule = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ usuario: '', password: '', nome: '', funcao: '', ativo: true });
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
    let createdDoc = null;
    try {
      console.log('Iniciando cadastro de usuário...');
      // Checa se já existe usuário com o mesmo nome de usuário na coleção
      const res = await appwriteService.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('usuario', form.usuario)
      ]);
      console.log('Resultado da checagem de usuário na coleção:', res);
      if (res.documents && res.documents.length > 0) {
        setError('Já existe um usuário com este nome de usuário cadastrado.');
        setLoading(false);
        return;
      }
      console.log('Usuário não existe na coleção, criando documento...');
      // Cria usuário na coleção primeiro
      createdDoc = await appwriteService.createDocument(DATABASE_ID, COLLECTION_ID, {
        usuario: form.usuario,
        password: form.password,
        nome: form.nome,
        sobrenome: form.sobrenome,
        funcao: form.funcao,
        ativo: form.ativo,
      });
      console.log('Documento criado na coleção usuarios:', createdDoc);

      // Cria usuário no Auth com email fictício
      const fakeEmail = `${form.usuario}@neonmaringa.com.br`;
      try {
        await appwriteService.account.create('unique()', fakeEmail, form.password, `${form.nome} ${form.sobrenome}`);
        console.log('Usuário criado no Auth com sucesso!');
        setSuccess('Usuário criado com sucesso!');
        setOpen(false);
        setForm({ usuario: '', password: '', nome: '', sobrenome: '', funcao: '', ativo: true });
        fetchUsers();
      } catch (authErr) {
        console.log('Falha ao criar usuário no Auth:', authErr);
        // Se falhar no Auth, remove da coleção
        if (createdDoc && createdDoc.$id) {
          await appwriteService.deleteDocument(DATABASE_ID, COLLECTION_ID, createdDoc.$id);
        }
        setError(authErr.message || 'Erro ao criar usuário no Auth. Cadastro revertido.');
      }
    } catch (err) {
      console.log('Falha geral no cadastro:', err);
      setError(err.message || 'Erro ao criar usuário');
      console.log('setError chamado');
    } finally {
      console.log('Finalizando processo de cadastro.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Usuários do Sistema</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Novo Usuário</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>Email</TableCell> */}
              <TableCell>Nome</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Ativo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.$id}>
                {/* <TableCell>{user.email}</TableCell> */}
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
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TextField label="Usuário" value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} fullWidth margin="normal" required />
          <TextField label="Sobrenome" value={form.sobrenome} onChange={e => setForm({ ...form, sobrenome: e.target.value })} fullWidth margin="normal" required />
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
