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
  List,
  ListItem,
  Divider,
  InputLabel,
  Select,
  MenuItem
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
  const [savingIndividual, setSavingIndividual] = useState({});
  const [turno, setTurno] = useState('Manhã');
  const [presencas, setPresencas] = useState({});
  const [observacoes, setObservacoes] = useState({});
  const [horariosChegada, setHorariosChegada] = useState({});
  const [motivosFalta, setMotivosFalta] = useState({});
  const [presencasSalvas, setPresencasSalvas] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hoje = new Date();
  const diaSemanaPT = getDayOfWeek(hoje);
  const dataFormatada = formatDateBR(hoje);

  // Lista de motivos de falta
  const motivosFaltaOpcoes = [
    'Doença',
    'Consulta médica',
    'Viagem familiar',
    'Problema pessoal',
    'Transporte',
    'Clima/Tempo',
    'Emergência familiar',
    'Outro motivo'
  ];

  // Buscar alunos do turno selecionado que estudam hoje
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await appwriteService.listDocuments('sistema', 'alunos');
        const todosAlunos = result.documents || [];
        
        const alunosFiltrados = todosAlunos.filter(aluno => {
          const turnoCorreto = aluno.turno === turno;
          const estudaHoje = Array.isArray(aluno.diasSemana) 
            ? aluno.diasSemana.includes(diaSemanaPT)
            : false;
          return turnoCorreto && estudaHoje;
        });

        setAlunos(alunosFiltrados);
        setPresencas({});
        setObservacoes({});
        setHorariosChegada({});
        setMotivosFalta({});
        setPresencasSalvas({});
        setSavingIndividual({});
        
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setError('Erro ao carregar lista de alunos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, [turno, diaSemanaPT]);

  const handlePresencaChange = (alunoId, situacao) => {
    setPresencas(prev => ({ ...prev, [alunoId]: situacao }));

    if (situacao !== 'observacao') {
      setObservacoes(prev => ({ ...prev, [alunoId]: '' }));
    }
    if (situacao !== 'atraso') {
      setHorariosChegada(prev => ({ ...prev, [alunoId]: '' }));
    }
    if (situacao !== 'falta') {
      setMotivosFalta(prev => ({ ...prev, [alunoId]: '' }));
    }
  };

  const handleObservacaoChange = (alunoId, observacao) => {
    setObservacoes(prev => ({ ...prev, [alunoId]: observacao }));
  };

  const handleHorarioChegadaChange = (alunoId, horario) => {
    setHorariosChegada(prev => ({ ...prev, [alunoId]: horario }));
  };

  const handleMotivoFaltaChange = (alunoId, motivo) => {
    setMotivosFalta(prev => ({ ...prev, [alunoId]: motivo }));
  };

  const validarChamadaIndividual = (alunoId) => {
    if (!presencas[alunoId]) {
      setError(`Selecione uma situação para o aluno.`);
      return false;
    }
    if (presencas[alunoId] === 'observacao' && !observacoes[alunoId]?.trim()) {
      setError(`Preencha a observação para continuar.`);
      return false;
    }
    if (presencas[alunoId] === 'atraso' && !horariosChegada[alunoId]?.trim()) {
      setError(`Informe o horário de chegada para continuar.`);
      return false;
    }
    if (presencas[alunoId] === 'falta' && !motivosFalta[alunoId]?.trim()) {
      setError(`Selecione o motivo da falta para continuar.`);
      return false;
    }
    return true;
  };

  const salvarPresencaIndividual = async (aluno) => {
    if (!validarChamadaIndividual(aluno.$id)) return;

    setSavingIndividual(prev => ({ ...prev, [aluno.$id]: true }));
    setError('');

    try {
      const registroPresenca = {
        alunoId: aluno.$id,
        alunoNome: aluno.nome,
        situacao: presencas[aluno.$id],
        observacao: observacoes[aluno.$id] || '',
        horarioChegada: horariosChegada[aluno.$id] || '',
        motivoFalta: motivosFalta[aluno.$id] || '',
        responsavelId: aluno.responsavelId || '',
        data: hoje.toISOString(),
        turno: turno,
        diaSemana: diaSemanaPT,
        criadoEm: new Date().toISOString()
      };

      const dataId = hoje.toISOString().split('T')[0];
      const presencaId = `${dataId}_${turno.toLowerCase()}_${aluno.$id}`;

      await appwriteService.createDocument('sistema', 'presencas_individuais', presencaId, registroPresenca);
      setPresencasSalvas(prev => ({ ...prev, [aluno.$id]: true }));
      setSuccess(`Presença de ${aluno.nome} salva com sucesso!`);
      setTimeout(() => setSuccess(''), 2000);

    } catch (err) {
      console.error('Erro ao salvar presença individual:', err);
      if (err.message?.includes('already exists')) {
        setError(`Presença de ${aluno.nome} já foi registrada hoje para este turno.`);
      } else {
        setError(`Erro ao salvar presença de ${aluno.nome}. Tente novamente.`);
      }
    } finally {
      setSavingIndividual(prev => ({ ...prev, [aluno.$id]: false }));
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
        <Typography variant="body1" color="textSecondary">
          Turno: <strong>{turno}</strong> | Alunos do dia: <strong>{alunos.length}</strong>
        </Typography>
      </Paper>

      {/* Mensagens */}
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
          {/* Resumo */}
          {Object.keys(presencas).length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Resumo da Chamada</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`Presentes: ${Object.values(presencas).filter(s => s === 'presente').length}`} color="success" variant="outlined" />
                <Chip label={`Faltas: ${Object.values(presencas).filter(s => s === 'falta').length}`} color="error" variant="outlined" />
                <Chip label={`Atrasos: ${Object.values(presencas).filter(s => s === 'atraso').length}`} color="warning" variant="outlined" />
                <Chip label={`Observações: ${Object.values(presencas).filter(s => s === 'observacao').length}`} color="info" variant="outlined" />
              </Box>
            </Paper>
          )}

          {/* Lista de alunos */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Lista de Alunos - {turno}</Typography>
            
            {/* Cabeçalho */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '40px 1fr 120px 280px 150px 120px',
              gap: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2, fontWeight: 'bold'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>#</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Nome do Aluno</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dias</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Situação</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Status</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Ação</Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {alunos.map((aluno, index) => (
                <React.Fragment key={aluno.$id}>
                  <ListItem sx={{ 
                    flexDirection: 'column', alignItems: 'stretch', p: 2,
                    border: presencas[aluno.$id] ? 2 : 1,
                    borderColor: presencas[aluno.$id] ? `${getSituacaoColor(presencas[aluno.$id])}.main` : 'divider',
                    borderRadius: 1, mb: 1,
                    bgcolor: presencas[aluno.$id] ? `${getSituacaoColor(presencas[aluno.$id])}.50` : 'background.paper'
                  }}>
                    {/* Linha principal */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '40px 1fr 120px 280px 150px 120px',
                      gap: 2, alignItems: 'center',
                      mb: (presencas[aluno.$id] === 'observacao' || presencas[aluno.$id] === 'atraso' || presencas[aluno.$id] === 'falta') ? 2 : 0
                    }}>
                      <Typography variant="h6" sx={{ textAlign: 'center' }}>{index + 1}</Typography>
                      
                      <Typography variant="h6">{aluno.nome}</Typography>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                        {Array.isArray(aluno.diasSemana) ? aluno.diasSemana.map(d => d.charAt(0)).join(', ') : aluno.diasSemana}
                      </Typography>

                      <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                          row
                          value={presencas[aluno.$id] || ''}
                          onChange={(e) => handlePresencaChange(aluno.$id, e.target.value)}
                        >
                          <FormControlLabel value="presente" control={<Radio color="success" size="small" />} label="P" sx={{ mr: 1 }} />
                          <FormControlLabel value="falta" control={<Radio color="error" size="small" />} label="F" sx={{ mr: 1 }} />
                          <FormControlLabel value="atraso" control={<Radio color="warning" size="small" />} label="A" sx={{ mr: 1 }} />
                          <FormControlLabel value="observacao" control={<Radio color="info" size="small" />} label="O" />
                        </RadioGroup>
                      </FormControl>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {presencas[aluno.$id] && !presencasSalvas[aluno.$id] && (
                          <>
                            {getSituacaoIcon(presencas[aluno.$id])}
                            <Chip label={presencas[aluno.$id] === 'presente' ? 'P' : presencas[aluno.$id] === 'falta' ? 'F' : presencas[aluno.$id] === 'atraso' ? 'A' : 'O'} color={getSituacaoColor(presencas[aluno.$id])} size="small" />
                          </>
                        )}
                        {presencasSalvas[aluno.$id] && (
                          <Chip label="Salvo" color="success" size="small" sx={{ bgcolor: 'success.main', color: 'white' }} />
                        )}
                      </Box>

                      <Box>
                        {!presencasSalvas[aluno.$id] ? (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => salvarPresencaIndividual(aluno)}
                            disabled={!presencas[aluno.$id] || savingIndividual[aluno.$id]}
                            sx={{ minWidth: 80 }}
                          >
                            {savingIndividual[aluno.$id] ? 'Salvando...' : 'Salvar'}
                          </Button>
                        ) : (
                          <Button variant="outlined" size="small" color="success" disabled sx={{ minWidth: 80 }}>
                            ✓ Salvo
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* Campos extras */}
                    {presencas[aluno.$id] === 'observacao' && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth multiline rows={2} label="Descreva a observação"
                          value={observacoes[aluno.$id] || ''}
                          onChange={(e) => handleObservacaoChange(aluno.$id, e.target.value)}
                          required size="small" sx={{ bgcolor: 'background.paper' }}
                        />
                      </Box>
                    )}

                    {presencas[aluno.$id] === 'atraso' && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          type="time" label="Horário de chegada"
                          value={horariosChegada[aluno.$id] || ''}
                          onChange={(e) => handleHorarioChegadaChange(aluno.$id, e.target.value)}
                          required size="small" InputLabelProps={{ shrink: true }}
                          sx={{ bgcolor: 'background.paper', minWidth: 200 }}
                        />
                      </Box>
                    )}

                    {presencas[aluno.$id] === 'falta' && (
                      <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth size="small" sx={{ bgcolor: 'background.paper' }}>
                          <InputLabel>Motivo da falta</InputLabel>
                          <Select
                            label="Motivo da falta"
                            value={motivosFalta[aluno.$id] || ''}
                            onChange={(e) => handleMotivoFaltaChange(aluno.$id, e.target.value)}
                            required
                          >
                            {motivosFaltaOpcoes.map((motivo) => (
                              <MenuItem key={motivo} value={motivo}>{motivo}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                  </ListItem>
                  
                  {index < alunos.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>

            {/* Legenda */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>Legenda:</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Typography variant="body2">P = Presente</Typography>
                <Typography variant="body2">F = Falta</Typography>
                <Typography variant="body2">A = Atraso</Typography>
                <Typography variant="body2">O = Observação</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Botões */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                setPresencas({});
                setObservacoes({});
                setHorariosChegada({});
                setMotivosFalta({});
                setPresencasSalvas({});
                setError('');
                setSuccess('');
              }}
              disabled={saving}
              sx={{ minWidth: 150 }}
            >
              Limpar Tudo
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AttendanceModule;
