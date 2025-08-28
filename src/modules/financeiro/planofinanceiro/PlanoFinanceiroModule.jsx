// Função para formatar data no padrão brasileiro
// ...existing code...
import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, TextField, MenuItem, Select, InputLabel, FormControl, Button, CircularProgress, Autocomplete } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import appwriteService from '../../../services/appwriteService';
import { useLocation } from 'react-router-dom';
import { Query } from 'appwrite';

const PlanoFinanceiroModule = () => {
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const location = useLocation();
  // Se vier do modal, pode receber dados do aluno via state
  const alunoFromModal = location.state?.aluno || null;
  const statusFromModal = typeof location.state?.status === 'string' ? location.state.status : '';
  const competenciaFromModal = typeof location.state?.competencia === 'string' ? location.state.competencia : 'atual';

  const [alunos, setAlunos] = useState([]);
  const [selectedAlunos, setSelectedAlunos] = useState(alunoFromModal ? [alunoFromModal] : []);
  const [status, setStatus] = useState(statusFromModal);
  const [competencia, setCompetencia] = useState(competenciaFromModal);
  // Removido customDate antigo
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar alunos para filtro
  useEffect(() => {
    appwriteService.listDocuments('sistema', 'alunos').then(r => {
      setAlunos(r.documents || []);
    });
  }, []);

  // Carregar lançamentos ao selecionar aluno ou filtro
  useEffect(() => {
    if (!selectedAlunos.length) {
      setLancamentos([]);
      return;
    }
    setLoading(true);
    // Monta queries
    let queries = [];
    if (status) queries.push({ field: 'status', value: status });
    if (competencia === 'atual') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      queries.push({ field: 'vencimento', op: '>=', value: start.toISOString() });
      queries.push({ field: 'vencimento', op: '<=', value: end.toISOString() });
    } else if (competencia === 'passado') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      queries.push({ field: 'vencimento', op: '>=', value: start.toISOString() });
      queries.push({ field: 'vencimento', op: '<=', value: end.toISOString() });
    } else if (competencia === 'seguinte') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
      queries.push({ field: 'vencimento', op: '>=', value: start.toISOString() });
      queries.push({ field: 'vencimento', op: '<=', value: end.toISOString() });
    } else if (competencia === 'personalizado' && customDate) {
    } else if (competencia === 'personalizado' && customDateStart && customDateEnd) {
      const start = new Date(customDateStart);
      const end = new Date(customDateEnd);
      queries.push({ field: 'vencimento', op: '>=', value: start.toISOString() });
      queries.push({ field: 'vencimento', op: '<=', value: end.toISOString() });
    }
    // Filtro por alunos
  // Filtro por alunos
  const alunoIds = Array.isArray(selectedAlunos) ? selectedAlunos.map(a => a.$id) : [];
  queries.push({ field: 'alunoId', value: alunoIds });
    // Monta queries para Appwrite
    let appwriteQueries = [];
    queries.forEach(q => {
      if (q.field === 'alunoId') {
        if (q.value.length === 1) {
          appwriteQueries.push(Query.equal('alunoId', q.value[0]));
        } else if (q.value.length > 1) {
          appwriteQueries.push(Query.equal('alunoId', q.value));
        }
      } else if (q.field === 'status') {
        appwriteQueries.push(Query.equal('status', q.value));
      } else if (q.field === 'vencimento' && q.op === '>=') {
        appwriteQueries.push(Query.greaterThanEqual('vencimento', q.value));
      } else if (q.field === 'vencimento' && q.op === '<=') {
        appwriteQueries.push(Query.lessThanEqual('vencimento', q.value));
      }
    });
    appwriteService.listDocuments('sistema', 'lancamentos_financeiros', appwriteQueries).then(r => {
      setLancamentos(r.documents || []);
      setLoading(false);
    });
  }, [selectedAlunos, status, competencia, customDateStart, customDateEnd]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Plano Financeiro Completo
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Autocomplete
          multiple
          options={alunos}
          getOptionLabel={option => option.nome}
          value={selectedAlunos}
          onChange={(_, value) => setSelectedAlunos(value)}
          renderInput={params => (
            <TextField {...params} label="Aluno(s)" size="small" />
          )}
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="pago">Pago</MenuItem>
            <MenuItem value="atrasado">Atrasado</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="competencia-select-label">Vencimento</InputLabel>
          <Select
            labelId="competencia-select-label"
            value={competencia}
            onChange={e => setCompetencia(e.target.value)}
          >
            <MenuItem value="atual">Mês atual</MenuItem>
            <MenuItem value="passado">Mês passado</MenuItem>
            <MenuItem value="seguinte">Mês seguinte</MenuItem>
      <MenuItem value="todos">Todos</MenuItem>
      <MenuItem value="intervalo">Intervalo personalizado</MenuItem>
          </Select>
        </FormControl>
    {competencia === 'intervalo' && (
          <>
            <TextField
              label="Data inicial"
              type="date"
              size="small"
              value={customDateStart}
              onChange={e => setCustomDateStart(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
            <TextField
              label="Data final"
              type="date"
              size="small"
              value={customDateEnd}
              onChange={e => setCustomDateEnd(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
          </>
        )}
      </Box>
      {loading ? (
        <CircularProgress />
      ) : lancamentos.length === 0 ? (
        <Typography color="text.secondary">Selecione um ou mais alunos para visualizar os lançamentos.</Typography>
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={lancamentos.map(l => ({
              id: l.$id,
              aluno: l.alunoNome,
              tipo: l.tipo,
              valor: Number(l.valor).toFixed(2),
              vencimento: l.vencimento ? formatDateBR(l.vencimento) : '',
              status: l.status,
              descricao: l.descricao || '',
            }))}
            columns={[
              { field: 'aluno', headerName: 'Aluno', flex: 1 },
              { field: 'tipo', headerName: 'Tipo', flex: 1 },
              { field: 'valor', headerName: 'Valor (R$)', flex: 1 },
              { field: 'vencimento', headerName: 'Vencimento', flex: 1 },
              { field: 'status', headerName: 'Status', flex: 1 },
              { field: 'descricao', headerName: 'Descrição', flex: 2 },
            ]}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            autoHeight
            disableSelectionOnClick
          />
        </Box>

      )}
    </Container>
  );
}

// Função para formatar data no padrão brasileiro
function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('pt-BR');
}

export default PlanoFinanceiroModule;
