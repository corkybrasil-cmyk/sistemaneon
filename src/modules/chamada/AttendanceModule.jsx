import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { CheckCircle, Cancel, Schedule, Comment } from '@mui/icons-material';
import appwriteService from '../../services/appwriteService';

// Função para obter o dia da semana em português
const getDayOfWeek = (date) => {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
};

// Função para formatar data no padrão brasileiro
const formatDateBR = (date) => {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const AttendanceModule = () => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [turno, setTurno] = useState('Manhã'); // Manhã ou Tarde
  const [presencas, setPresencas] = useState({});
  const [observacoes, setObservacoes] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hoje = new Date();
  const diaSemanaPT = getDayOfWeek(hoje);
  const dataFormatada = formatDateBR(hoje);

  // Buscar alunos do turno selecionado que estudam hoje
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await appwriteService.listDocuments('sistema', 'alunos');
        const todosAlunos = result.documents || [];
        
        // Filtrar por turno e dia da semana
        const alunosFiltrados = todosAlunos.filter(aluno => {
          const turnoCorreto = aluno.turno === turno;
          const estudaHoje = Array.isArray(aluno.diasSemana) 
            ? aluno.diasSemana.includes(diaSemanaPT)
            : false;
          return turnoCorreto && estudaHoje;
        });

        setAlunos(alunosFiltrados);
        
        // Limpar presenças anteriores quando mudar turno/alunos
        setPresencas({});
        setObservacoes({});
        
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setError('Erro ao carregar lista de alunos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, [turno, diaSemanaPT]);

  // Verificar se já existe chamada para hoje
  useEffect(() => {
    const verificarChamadaExistente = async () => {
      try {
        const inicioHoje = new Date(hoje);
        inicioHoje.setHours(0, 0, 0, 0);
        
        const fimHoje = new Date(hoje);
        fimHoje.setHours(23, 59, 59, 999);

        // Verificar se existe chamada para hoje neste turno
        const result = await appwriteService.listDocuments('sistema', 'chamadas', [
          // Adicionar queries se necessário para filtrar por data e turno
        ]);
        
        // Verificar se já foi feita chamada hoje para este turno
        const chamadaHoje = result.documents?.find(chamada => {
          const dataChamada = new Date(chamada.data);
          return dataChamada.toDateString() === hoje.toDateString() && 
                 chamada.turno === turno;
        });

        if (chamadaHoje) {
          setSuccess('Chamada já foi registrada hoje para este turno.');
        }
        
      } catch (err) {
        console.error('Erro ao verificar chamada existente:', err);
      }
    };

    if (alunos.length > 0) {
      verificarChamadaExistente();
    }
  }, [alunos, turno, hoje]);

  const handlePresencaChange = (alunoId, situacao) => {
    setPresencas(prev => ({
      ...prev,
      [alunoId]: situacao
    }));

    // Limpar observação se não for "observacao"
    if (situacao !== 'observacao') {
      setObservacoes(prev => ({
        ...prev,
        [alunoId]: ''
      }));
    }
  };

  const handleObservacaoChange = (alunoId, observacao) => {
    setObservacoes(prev => ({
      ...prev,
      [alunoId]: observacao
    }));
  };

  const validarChamada = () => {
    const alunosSemSituacao = alunos.filter(aluno => !presencas[aluno.$id]);
    
    if (alunosSemSituacao.length > 0) {
      setError(`Selecione uma situação para todos os alunos. Faltam: ${alunosSemSituacao.map(a => a.nome).join(', ')}`);
      return false;
    }

    // Verificar se alunos com "observacao" têm texto preenchido
    const alunosComObservacaoSemTexto = alunos.filter(aluno => 
      presencas[aluno.$id] === 'observacao' && !observacoes[aluno.$id]?.trim()
    );

    if (alunosComObservacaoSemTexto.length > 0) {
      setError(`Preencha as observações para: ${alunosComObservacaoSemTexto.map(a => a.nome).join(', ')}`);
      return false;
    }

    return true;
  };

  const salvarChamada = async () => {
    if (!validarChamada()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Preparar dados da chamada
      const dadosChamada = {
        data: hoje.toISOString(),
        turno: turno,
        diaSemana: diaSemanaPT,
        registros: alunos.map(aluno => ({
          alunoId: aluno.$id,
          alunoNome: aluno.nome,
          situacao: presencas[aluno.$id],
          observacao: observacoes[aluno.$id] || '',
          responsavelId: aluno.responsavelId || ''
        })),
        totalAlunos: alunos.length,
        presentes: Object.values(presencas).filter(s => s === 'presente').length,
        faltas: Object.values(presencas).filter(s => s === 'falta').length,
        atrasos: Object.values(presencas).filter(s => s === 'atraso').length,
        observacoes: Object.values(presencas).filter(s => s === 'observacao').length,
        criadoEm: new Date().toISOString()
      };

      // Gerar ID único para a chamada (data + turno)
      const dataId = hoje.toISOString().split('T')[0]; // YYYY-MM-DD
      const chamadaId = `${dataId}_${turno.toLowerCase()}`;

      await appwriteService.createDocument('sistema', 'chamadas', chamadaId, dadosChamada);

      setSuccess('Chamada registrada com sucesso!');
      
      // Limpar formulário após 3 segundos
      setTimeout(() => {
        setPresencas({});
        setObservacoes({});
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('Erro ao salvar chamada:', err);
      setError('Erro ao salvar chamada. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const getSituacaoIcon = (situacao) => {
    switch (situacao) {
      case 'presente': return <CheckCircle color="success" />;
      case 'falta': return <Cancel color="error" />;
      case 'atraso': return <Schedule color="warning" />;
      case 'observacao': return <Comment color="info" />;
      default: return null;
    }
  };

  const getSituacaoColor = (situacao) => {
    switch (situacao) {
      case 'presente': return 'success';
      case 'falta': return 'error';
      case 'atraso': return 'warning';
      case 'observacao': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Controle de Chamada
      </Typography>

      {/* Cabeçalho com informações do dia */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {dataFormatada}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant={turno === 'Manhã' ? 'contained' : 'outlined'}
                onClick={() => setTurno('Manhã')}
                disabled={loading}
              >
                Manhã
              </Button>
              <Button
                variant={turno === 'Tarde' ? 'contained' : 'outlined'}
                onClick={() => setTurno('Tarde')}
                disabled={loading}
              >
                Tarde
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body1" color="textSecondary">
                Turno: <strong>{turno}</strong>
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Alunos do dia: <strong>{alunos.length}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Mensagens de erro e sucesso */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Lista de alunos */}
      {!loading && alunos.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Nenhum aluno encontrado para {turno.toLowerCase()} de {diaSemanaPT.toLowerCase()}
          </Typography>
        </Paper>
      )}

      {!loading && alunos.length > 0 && (
        <>
          {/* Resumo da chamada */}
          {Object.keys(presencas).length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumo da Chamada
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Presentes: ${Object.values(presencas).filter(s => s === 'presente').length}`}
                  color="success"
                  variant="outlined"
                />
                <Chip 
                  label={`Faltas: ${Object.values(presencas).filter(s => s === 'falta').length}`}
                  color="error"
                  variant="outlined"
                />
                <Chip 
                  label={`Atrasos: ${Object.values(presencas).filter(s => s === 'atraso').length}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip 
                  label={`Observações: ${Object.values(presencas).filter(s => s === 'observacao').length}`}
                  color="info"
                  variant="outlined"
                />
              </Box>
            </Paper>
          )}

          {/* Lista de alunos para chamada */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lista de Alunos - {turno}
            </Typography>
            
            {/* Cabeçalho da tabela */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '40px 1fr 150px 300px 200px',
              gap: 2,
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              mb: 2,
              fontWeight: 'bold'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>#</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Nome do Aluno</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dias da Semana</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Situação</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Status</Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {alunos.map((aluno, index) => (
                <React.Fragment key={aluno.$id}>
                  <ListItem 
                    sx={{ 
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      p: 2,
                      border: presencas[aluno.$id] ? 2 : 1,
                      borderColor: presencas[aluno.$id] 
                        ? `${getSituacaoColor(presencas[aluno.$id])}.main`
                        : 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: presencas[aluno.$id] 
                        ? `${getSituacaoColor(presencas[aluno.$id])}.50`
                        : 'background.paper'
                    }}
                  >
                    {/* Linha principal com informações do aluno */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '40px 1fr 150px 300px 200px',
                      gap: 2,
                      alignItems: 'center',
                      mb: presencas[aluno.$id] === 'observacao' ? 2 : 0
                    }}>
                      {/* Coluna 1: Número */}
                      <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        {index + 1}
                      </Typography>

                      {/* Coluna 2: Nome do Aluno */}
                      <Box>
                        <Typography variant="h6">
                          {aluno.nome}
                        </Typography>
                      </Box>

                      {/* Coluna 3: Dias da Semana */}
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {Array.isArray(aluno.diasSemana) 
                            ? aluno.diasSemana.join(', ') 
                            : aluno.diasSemana}
                        </Typography>
                      </Box>

                      {/* Coluna 4: Opções de Presença */}
                      <Box>
                        <FormControl component="fieldset" fullWidth>
                          <RadioGroup
                            row
                            value={presencas[aluno.$id] || ''}
                            onChange={(e) => handlePresencaChange(aluno.$id, e.target.value)}
                          >
                            <FormControlLabel 
                              value="presente" 
                              control={<Radio color="success" size="small" />} 
                              label="P" 
                              sx={{ mr: 1 }}
                            />
                            <FormControlLabel 
                              value="falta" 
                              control={<Radio color="error" size="small" />} 
                              label="F" 
                              sx={{ mr: 1 }}
                            />
                            <FormControlLabel 
                              value="atraso" 
                              control={<Radio color="warning" size="small" />} 
                              label="A" 
                              sx={{ mr: 1 }}
                            />
                            <FormControlLabel 
                              value="observacao" 
                              control={<Radio color="info" size="small" />} 
                              label="O" 
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      {/* Coluna 5: Status Visual */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {presencas[aluno.$id] && (
                          <>
                            {getSituacaoIcon(presencas[aluno.$id])}
                            <Chip 
                              label={
                                presencas[aluno.$id] === 'presente' ? 'Presente' :
                                presencas[aluno.$id] === 'falta' ? 'Falta' :
                                presencas[aluno.$id] === 'atraso' ? 'Atraso' :
                                'Observação'
                              }
                              color={getSituacaoColor(presencas[aluno.$id])}
                              size="small"
                            />
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Campo de observação (linha separada) */}
                    {presencas[aluno.$id] === 'observacao' && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Descreva a observação"
                          value={observacoes[aluno.$id] || ''}
                          onChange={(e) => handleObservacaoChange(aluno.$id, e.target.value)}
                          required
                          size="small"
                          sx={{ bgcolor: 'background.paper' }}
                        />
                      </Box>
                    )}
                  </ListItem>
                  
                  {index < alunos.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>

            {/* Legenda */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Legenda:
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Typography variant="body2">P = Presente</Typography>
                <Typography variant="body2">F = Falta</Typography>
                <Typography variant="body2">A = Atraso</Typography>
                <Typography variant="body2">O = Observação</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Botão para salvar chamada */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={salvarChamada}
              disabled={saving || Object.keys(presencas).length === 0}
              sx={{ minWidth: 200 }}
            >
              {saving ? 'Salvando...' : 'Lançar Presenças'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AttendanceModule;
