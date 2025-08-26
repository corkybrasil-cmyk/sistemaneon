import React, { useEffect, useMemo, useState } from 'react';
import appwriteService from '../../services/appwriteService';
import { Query } from 'appwrite';
import {
	Box,
	Typography,
	Paper,
	Button,
	List,
	ListItemButton,
	ListItemText,
	Collapse,
	Chip,
	Divider,
	CircularProgress,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Stack,
	Autocomplete,
	Alert,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, ExpandLess, ExpandMore } from '@mui/icons-material';

// Utilitários de status (agregado e cor)
export function getStatusAgregado(itens) {
	if (!Array.isArray(itens) || itens.length === 0) return 'Misto';
	const statusSet = new Set(itens.map((i) => String(i.status || '').toLowerCase()));
	if (statusSet.size === 1) {
		const s = Array.from(statusSet)[0];
		if (s === 'pago') return 'Pago';
		if (s === 'pendente') return 'Pendente';
		if (s === 'atrasado') return 'Atrasado';
		return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Misto';
	}
	return 'Misto';
}

export function getStatusColor(status) {
	if (status === 'Pago') return 'success';
	if (status === 'Pendente') return 'warning';
	if (status === 'Atrasado') return 'error';
	return 'default';
}

// Capitaliza a primeira letra de uma string
function capitalizeFirst(str) {
	if (!str) return '';
	const s = String(str);
	return s.charAt(0).toUpperCase() + s.slice(1);
}

const FinancialModule = () => {
		const [lancamentos, setLancamentos] = useState([]);
	const [expanded, setExpanded] = useState({});
	const [expandedAluno, setExpandedAluno] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
		const now = new Date();
		const defaultCompetencia = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
		const [filterCompetencia, setFilterCompetencia] = useState(defaultCompetencia);
		const [filterStatus, setFilterStatus] = useState(''); // '', 'pendente', 'pago', 'atrasado'
		// Filtro único por vencimento (mês)
			const [filterResponsavel, setFilterResponsavel] = useState('');
			const [responsaveisAll, setResponsaveisAll] = useState([]);

			// Dialog de novo lançamento
			const [openNew, setOpenNew] = useState(false);
			const [form, setForm] = useState({
					responsavelId: '',
					alunoId: '',
					tipo: 'mensalidade',
					vencimento: '', // yyyy-mm-dd
					valor: '',
					status: 'pendente',
					descricao: '',
					quantidade: 1,
					melhorDia: '', // 1..31
				hasMatricula: false,
				valorMatricula: '',
			});
			const [alunosForResp, setAlunosForResp] = useState([]);
			const [saving, setSaving] = useState(false);
				const [formErrors, setFormErrors] = useState({});
				const [formErrorMsg, setFormErrorMsg] = useState('');

			// Lançamento avulso
			const [openAvulso, setOpenAvulso] = useState(false);
			const [formAvulso, setFormAvulso] = useState({
				responsavelId: '',
				alunoId: '',
				tipo: '',
				vencimento: '',
				valor: '',
				status: 'pendente',
				descricao: ''
			});
			const [alunosForRespAvulso, setAlunosForRespAvulso] = useState([]);
			const [savingAvulso, setSavingAvulso] = useState(false);
			const tiposLancamento = [
				{ value: 'mensalidade', label: 'Mensalidade' },
				{ value: 'taxa_matricula', label: 'Taxa de matrícula' },
				{ value: 'material', label: 'Material' },
				{ value: 'servico', label: 'Serviço' },
				{ value: 'outro', label: 'Outro' },
			];

			const handleOpenAvulso = () => {
				setFormAvulso({ responsavelId: '', alunoId: '', tipo: '', vencimento: '', valor: '', status: 'pendente', descricao: '' });
				setAlunosForRespAvulso([]);
				setFormErrors({});
				setFormErrorMsg('');
				setOpenAvulso(true);
			};

			useEffect(() => {
				if (!openAvulso) return;
				if (!formAvulso.responsavelId) { setAlunosForRespAvulso([]); return; }
				appwriteService
					.listDocuments('sistema', 'alunos')
					.then((r) => {
						const docs = r?.documents || [];
						setAlunosForRespAvulso(docs.filter((d) => (d.responsavelId || d.responsavelID) === formAvulso.responsavelId));
					})
					.catch(() => setAlunosForRespAvulso([]));
			}, [openAvulso, formAvulso.responsavelId]);

			const handleSaveAvulso = async () => {
				if (savingAvulso) return;
				const errs = {};
				if (!formAvulso.responsavelId) errs.responsavelId = 'Selecione o responsável';
				if (!formAvulso.alunoId) errs.alunoId = 'Selecione o aluno';
				if (!formAvulso.tipo) errs.tipo = 'Selecione o tipo';
				if (!formAvulso.vencimento) errs.vencimento = 'Informe a data';
				if (!formAvulso.valor || Number(formAvulso.valor) <= 0) errs.valor = 'Informe um valor válido';
				if (!formAvulso.status) errs.status = 'Selecione o status';
				setFormErrors(errs);
				if (Object.keys(errs).length > 0) { setFormErrorMsg('Preencha os campos obrigatórios.'); return; }
				setSavingAvulso(true);
				try {
					const resp = responsaveisAll.find((r) => r.$id === formAvulso.responsavelId);
					const aluno = alunosForRespAvulso.find((a) => a.$id === formAvulso.alunoId);
					const due = new Date(formAvulso.vencimento + 'T00:00:00');
					const competencia = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}`;
					// Reservar 1 sequência para gerar ID
					const FUNCTION_ID = import.meta.env.VITE_APPWRITE_RESERVE_FUNCTION_ID || 'reserveFinanceSequence';
					const exec = await appwriteService.executeFunction(FUNCTION_ID, { responsavelId: formAvulso.responsavelId, count: 1 });
					let nextSeq = 1;
					try {
						const body = JSON.parse(exec.responseBody || exec.stdout || '{}');
						if (body && typeof body.start === 'number') nextSeq = body.start;
					} catch {}
					let baseId = `${formAvulso.responsavelId}_${nextSeq}`;
					baseId = baseId.replace(/[^a-zA-Z0-9._-]/g, '');
					if (baseId.length > 36) baseId = baseId.slice(0, 36);
					await appwriteService.createDocument('sistema', 'lancamentos_financeiros', baseId, {
						responsavelId: formAvulso.responsavelId,
						responsavelNome: resp?.nome || '',
						alunoId: formAvulso.alunoId,
						alunoNome: aluno?.nome || '',
						tipo: formAvulso.tipo,
						vencimento: due.toISOString(),
						competencia,
						valor: Number(formAvulso.valor),
						status: formAvulso.status,
						descricao: formAvulso.descricao || '',
						criadoEm: new Date().toISOString(),
					});
					setOpenAvulso(false);
					await fetchData();
				} catch (e) {
					console.error('Erro ao criar lançamento avulso', e);
					setFormErrorMsg('Não foi possível salvar o lançamento avulso.');
				} finally {
					setSavingAvulso(false);
				}
			};

			// Modal de detalhes (responsável, aluno ou lançamento)
			const [detailOpen, setDetailOpen] = useState(false);
			const [detail, setDetail] = useState({ type: null, data: null });
			const openDetail = (type, data) => {
				setDetail({ type, data });
				setDetailOpen(true);
			};
			const closeDetail = () => {
				setDetailOpen(false);
				setDetail({ type: null, data: null });
			};

		useEffect(() => {
				// Carregar lista de responsáveis para o filtro global
				appwriteService
					.listDocuments('sistema', 'responsaveis')
					.then((r) => setResponsaveisAll(r?.documents || []))
					.catch(() => {});
			}, []);

			useEffect(() => {
			const fetchData = async () => {
			setLoading(true);
			setError('');
			try {
					// Consulta única por vencimento (mês selecionado)
					const [year, month] = filterCompetencia.split('-').map(Number);
					const start = new Date(year, month - 1, 1);
					const end = new Date(year, month, 0, 23, 59, 59, 999);
					const queries = [
						Query.greaterThanEqual('vencimento', start.toISOString()),
						Query.lessThanEqual('vencimento', end.toISOString()),
					];
					if (filterStatus) queries.push(Query.equal('status', filterStatus));
					const res = await appwriteService.listDocuments('sistema', 'lancamentos_financeiros', queries);
					let docs = res?.documents || [];
					// Filtro por responsável em memória (evita necessidade de índice combinado)
					if (filterResponsavel) {
						docs = docs.filter((d) => d.responsavelId === filterResponsavel);
					}
					// Status já foi aplicado no servidor quando informado; nada extra aqui.
					setLancamentos(docs);
			} catch (e) {
				console.error('Erro ao carregar responsáveis/alunos:', e);
					setError('Não foi possível carregar os dados.');
			} finally {
				setLoading(false);
			}
		};
			fetchData();
		}, [filterCompetencia, filterStatus, filterResponsavel]);

			// Carregar alunos ao selecionar responsável no dialog
			useEffect(() => {
				if (!openNew) return;
				if (!form.responsavelId) {
					setAlunosForResp([]);
					return;
				}
				// Buscar alunos e filtrar por responsável
				appwriteService
					.listDocuments('sistema', 'alunos')
					.then((r) => {
						const docs = r?.documents || [];
						const filtered = docs.filter((d) => (d.responsavelId || d.responsavelID) === form.responsavelId);
						setAlunosForResp(filtered);
					})
					.catch(() => setAlunosForResp([]));
			}, [form.responsavelId, openNew]);

		// Agrupar lançamentos do mês por responsável e por aluno
		const agrupado = useMemo(() => {
			const porResp = new Map();
			for (const l of lancamentos) {
				const rid = l.responsavelId;
				if (!rid) continue;
				const respNome = l.responsavelNome || 'Responsável';
				if (!porResp.has(rid)) {
					porResp.set(rid, { responsavelId: rid, responsavelNome: respNome, alunos: new Map(), total: 0, totalLanc: 0 });
				}
				const respNode = porResp.get(rid);
				respNode.total += Number(l.valor || 0);
				respNode.totalLanc += 1;

				const aid = l.alunoId || 'desconhecido';
				const aNome = l.alunoNome || 'Aluno';
				if (!respNode.alunos.has(aid)) {
					respNode.alunos.set(aid, { alunoId: aid, alunoNome: aNome, itens: [], total: 0 });
				}
				const alunoNode = respNode.alunos.get(aid);
				alunoNode.itens.push(l);
				alunoNode.total += Number(l.valor || 0);
			}
			// converter Map para arrays ordenadas por nome
				const lista = Array.from(porResp.values()).map((r) => ({
				...r,
				alunos: Array.from(r.alunos.values()).sort((a, b) => a.alunoNome.localeCompare(b.alunoNome)),
			}));
			lista.sort((a, b) => a.responsavelNome.localeCompare(b.responsavelNome));
			return lista;
		}, [lancamentos]);

			const pendentesPorResp = useMemo(() => {
				const map = new Map();
				for (const l of lancamentos) {
					const rid = l.responsavelId;
					if (!rid) continue;
					const isPendente = String(l.status || '').toLowerCase() === 'pendente';
					if (!map.has(rid)) map.set(rid, 0);
					if (isPendente) map.set(rid, map.get(rid) + 1);
				}
				return map;
			}, [lancamentos]);

	const toggleExpand = (id) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
	};
	const toggleExpandAluno = (id) => {
		setExpandedAluno((prev) => ({ ...prev, [id]: !prev[id] }));
	};

		const addMonths = (ym, delta) => {
			const [y, m] = ym.split('-').map(Number);
			const d = new Date(y, m - 1 + delta, 1);
			return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
		};

		const totalGeral = useMemo(() => {
			return lancamentos.reduce((acc, l) => acc + Number(l.valor || 0), 0);
		}, [lancamentos]);

		const handleOpenNew = () => {
			setForm({ responsavelId: '', alunoId: '', tipo: 'mensalidade', vencimento: '', valor: '', status: 'pendente', descricao: '', quantidade: 1, melhorDia: '', hasMatricula: false, valorMatricula: '' });
			setAlunosForResp([]);
			setFormErrors({});
			setFormErrorMsg('');
			setOpenNew(true);
		};

				const handleSaveNew = async () => {
			if (saving) return;
				// Validação
				const errs = {};
				if (!form.responsavelId) errs.responsavelId = 'Selecione o responsável';
				if (!form.alunoId) errs.alunoId = 'Selecione o aluno';
				if (!form.vencimento) errs.vencimento = 'Informe a data da 1ª parcela';
				const qtd = Number(form.quantidade);
				if (!qtd || qtd < 1) errs.quantidade = 'Quantidade deve ser maior que zero';
				if (!form.valor || Number(form.valor) <= 0) errs.valor = 'Informe um valor válido';
				const md = Number(form.melhorDia);
				if (!md || md < 1 || md > 31) errs.melhorDia = 'Melhor dia deve estar entre 1 e 31';
				if (!form.status) errs.status = 'Selecione o status';
				if (form.hasMatricula && (!form.valorMatricula || Number(form.valorMatricula) <= 0)) errs.valorMatricula = 'Informe o valor da taxa de matrícula';
				setFormErrors(errs);
				if (Object.keys(errs).length > 0) {
					setFormErrorMsg('Preencha os campos obrigatórios.');
					return;
				}
			setSaving(true);
			try {
				const resp = responsaveisAll.find((r) => r.$id === form.responsavelId);
				const aluno = alunosForResp.find((a) => a.$id === form.alunoId);
					const startDate = new Date(form.vencimento + 'T00:00:00');
					const melhorDia = Number(form.melhorDia) || startDate.getDate();

							// Obter sequência inicial de forma atômica via função do Appwrite
							const countDocs = Number(form.quantidade) + (form.hasMatricula ? 1 : 0);
							// functionId: configure aqui o ID da função criada no Appwrite
							const FUNCTION_ID = import.meta.env.VITE_APPWRITE_RESERVE_FUNCTION_ID || 'reserveFinanceSequence';
							const exec = await appwriteService.executeFunction(FUNCTION_ID, {
								responsavelId: form.responsavelId,
								count: countDocs,
							});
							let nextSeq = 1;
							try {
								const body = JSON.parse(exec.responseBody || exec.stdout || '{}');
								if (body && typeof body.start === 'number') nextSeq = body.start;
							} catch {
								// fallback já é 1
							}

							const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
					const makeDue = (base, addMonths, day) => {
						const y = base.getFullYear();
						const m = base.getMonth() + addMonths;
						const d = new Date(y, m, 1);
						const maxDay = daysInMonth(d.getFullYear(), d.getMonth());
						const targetDay = Math.min(day, maxDay);
								return new Date(d.getFullYear(), d.getMonth(), targetDay);
					};
							const adjustWeekend = (date) => {
								const d = new Date(date);
								const day = d.getDay();
								if (day === 6) { // Sábado
									d.setDate(d.getDate() + 2);
								} else if (day === 0) { // Domingo
									d.setDate(d.getDate() + 1);
								}
								return d;
							};

					// Criar N parcelas
					const docsToCreate = [];
					for (let i = 0; i < Number(form.quantidade); i++) {
								let due = i === 0 ? startDate : makeDue(startDate, i, melhorDia);
								if (i > 0) {
									// Ajuste para não cair em fins de semana nas parcelas após a primeira
									due = adjustWeekend(due);
								}
						const competencia = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}`;
						let baseId = `${form.responsavelId}_${nextSeq + i}`;
						baseId = baseId.replace(/[^a-zA-Z0-9._-]/g, '');
						if (baseId.length > 36) baseId = baseId.slice(0, 36);
						docsToCreate.push({
							id: baseId,
							data: {
								responsavelId: form.responsavelId,
								responsavelNome: resp?.nome || '',
								alunoId: form.alunoId || '',
								alunoNome: aluno?.nome || '',
								tipo: 'mensalidade',
								vencimento: due.toISOString(),
								competencia,
								valor: Number(form.valor),
								status: form.status,
								descricao: form.descricao || '',
								criadoEm: new Date().toISOString(),
							},
						});
					}

							// Lançar taxa de matrícula separadamente, após as mensalidades
							if (form.hasMatricula) {
								const taxaDue = startDate; // mesma data da 1ª parcela
								const taxaCompetencia = `${taxaDue.getFullYear()}-${String(taxaDue.getMonth() + 1).padStart(2, '0')}`;
								let baseId = `${form.responsavelId}_${nextSeq + Number(form.quantidade)}`;
								baseId = baseId.replace(/[^a-zA-Z0-9._-]/g, '');
								if (baseId.length > 36) baseId = baseId.slice(0, 36);
								docsToCreate.push({
									id: baseId,
									data: {
										responsavelId: form.responsavelId,
										responsavelNome: resp?.nome || '',
										alunoId: form.alunoId || '',
										alunoNome: aluno?.nome || '',
										tipo: 'taxa_matricula',
										vencimento: taxaDue.toISOString(),
										competencia: taxaCompetencia,
										valor: Number(form.valorMatricula),
										status: form.status,
										descricao: form.descricao ? `${form.descricao} | Taxa de matrícula` : 'Taxa de matrícula',
										criadoEm: new Date().toISOString(),
									},
								});
							}

					// Persistir sequencialmente para manter ordem
					for (const item of docsToCreate) {
						await appwriteService.createDocument('sistema', 'lancamentos_financeiros', item.id, item.data);
					}

					// Recarregar lista
				setOpenNew(false);
				// Atualiza lista imediatamente após salvar lançamentos
				await fetchData();
			} catch (e) {
				console.error('Erro ao criar lançamento', e);
					setFormErrorMsg('Não foi possível salvar o plano financeiro.');
			} finally {
				setSaving(false);
			}
		};

	return (
		<Box sx={{ maxWidth: '100%', width: '100%', px: { xs: 1, md: 4 }, mt: 2 }}>
			<Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
				Gestão Financeira
			</Typography>
					<Typography variant="subtitle1" sx={{ mb: 2 }}>
						Lançamentos
					</Typography>

							{/* Filtros */}
							<Paper elevation={0} sx={{ mb: 2, p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
						<TextField
							label="Competência"
							type="month"
							value={filterCompetencia}
							onChange={(e) => setFilterCompetencia(e.target.value)}
							size="small"
						/>
								<Stack direction="row" spacing={1}>
									<Button size="small" variant="outlined" onClick={() => setFilterCompetencia(addMonths(filterCompetencia, -1))}>Mês anterior</Button>
									<Button size="small" variant="outlined" onClick={() => setFilterCompetencia(defaultCompetencia)}>Mês atual</Button>
									<Button size="small" variant="outlined" onClick={() => setFilterCompetencia(addMonths(filterCompetencia, 1))}>Próximo mês</Button>
								</Stack>
						<FormControl size="small" sx={{ minWidth: 160 }}>
							<InputLabel id="status-label">Status</InputLabel>
							<Select labelId="status-label" label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
								<MenuItem value="">Todos</MenuItem>
								<MenuItem value="pendente">Pendente</MenuItem>
								<MenuItem value="pago">Pago</MenuItem>
								<MenuItem value="atrasado">Atrasado</MenuItem>
							</Select>
						</FormControl>

								<FormControl size="small" sx={{ minWidth: 220 }}>
									<InputLabel id="resp-label">Responsável</InputLabel>
									<Select labelId="resp-label" label="Responsável" value={filterResponsavel} onChange={(e) => setFilterResponsavel(e.target.value)}>
										<MenuItem value="">Todos</MenuItem>
										{responsaveisAll.map((r) => (
											<MenuItem key={r.$id} value={r.$id}>{r.nome}</MenuItem>
										))}
									</Select>
								</FormControl>

								<Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
									<Typography variant="body2" color="text.secondary">Total geral do mês:</Typography>
									<Chip color="primary" label={`R$ ${totalGeral.toFixed(2)}`} />
								</Box>
					</Paper>

					<Paper elevation={2} sx={{ mb: 3, minHeight: 400, width: '100%', p: 2, boxSizing: 'border-box' }}>
				{loading ? (
					<Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
						<CircularProgress size={20} />
						<Typography>Carregando dados…</Typography>
					</Box>
				) : error ? (
					<Box sx={{ p: 3 }}>
						<Typography color="error">{error}</Typography>
					</Box>
				) : (
					<List>
								{/* Cabeçalho das colunas */}
								<Box sx={{ display: 'flex', fontWeight: 'bold', px: 2, py: 1, borderBottom: '2px solid #ddd', bgcolor: 'background.paper' }}>
									<Box sx={{ flex: 3 }}>Nome</Box>
									<Box sx={{ flex: 2 }}>Vencimento</Box>
									<Box sx={{ flex: 1 }}>Valor</Box>
									<Box sx={{ flex: 1 }}>Status</Box>
								</Box>
								{/* Lista agrupada por responsável, expandindo alunos */}
								{agrupado.length === 0 ? (
									<Box sx={{ p: 3 }}>
										<Typography variant="body2" color="text.secondary">Nenhum lançamento de mensalidade encontrado para o mês atual.</Typography>
										<Typography variant="body2" color="text.secondary">Nenhum lançamento encontrado para o período selecionado.</Typography>
									</Box>
								) : (
									agrupado.map((resp) => {
										const rid = resp.responsavelId;
										const open = !!expanded[rid];
										// Responsável row
										return (
											<React.Fragment key={rid}>
												<Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #eee', bgcolor: 'background.paper', cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }} onClick={() => toggleExpand(rid)}>
													<Box sx={{ flex: 3, fontWeight: 'normal', color: 'text.primary' }} onDoubleClick={(e) => { e.stopPropagation(); openDetail('responsavel', resp); }}>{resp.responsavelNome}</Box>
													<Box sx={{ flex: 2, color: 'text.secondary' }}>
														{resp.alunos
															.flatMap(a => a.itens.map(i => i.vencimento?.slice(0,10) || '—'))
															.filter((v, i, arr) => arr.indexOf(v) === i)
															.join(', ')}
													</Box>
													<Box sx={{ flex: 1, fontWeight: 'normal', color: 'text.primary' }}>
														R$ {resp.alunos.reduce((acc, a) => acc + a.itens.reduce((s, i) => s + Number(i.valor || 0), 0), 0).toFixed(2)}
													</Box>
													<Box sx={{ flex: 1 }}>
														{/* Status agregado do responsável, só mostra se não expandido */}
														{!open && (
															<Chip
																label={getStatusAgregado(resp.alunos.flatMap(a => a.itens))}
																color={getStatusColor(getStatusAgregado(resp.alunos.flatMap(a => a.itens)))}
																size="small"
															/>
														)}
													</Box>
												</Box>
												{/* Alunos vinculados, cada um em sua linha, alinhados */}
												<Collapse in={open} timeout="auto" unmountOnExit>
													{resp.alunos.map((aluno) => {
														const alunoOpen = !!expandedAluno[aluno.alunoId];
														return (
															<React.Fragment key={aluno.alunoId}>
																<Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #f5f5f5', bgcolor: 'background.paper', cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }} onClick={() => toggleExpandAluno(aluno.alunoId)}>
																	<Box sx={{ flex: 3 }} onDoubleClick={(e) => { e.stopPropagation(); openDetail('aluno', aluno); }}>{aluno.alunoNome}</Box>
																	<Box sx={{ flex: 2 }}>{aluno.itens.length > 0 ? (aluno.itens[0].vencimento?.slice(0,10) || '—') : '—'}</Box>
																	<Box sx={{ flex: 1 }}>R$ {aluno.itens.reduce((acc, i) => acc + Number(i.valor || 0), 0).toFixed(2)}</Box>
																	<Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
																		{/* Status agregado do aluno, só mostra se não expandido */}
																		{!alunoOpen && (
																			<Chip
																				label={getStatusAgregado(aluno.itens)}
																				color={getStatusColor(getStatusAgregado(aluno.itens))}
																				size="small"
																			/>
																		)}
																		{alunoOpen && <span></span>}
																	</Box>
																</Box>
																<Collapse in={alunoOpen} timeout="auto" unmountOnExit>
								    {aluno.itens.map((item) => (
																		<Box key={item.$id} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #f0f0f0', bgcolor: 'background.paper', cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }} onDoubleClick={(e) => { e.stopPropagation(); openDetail('lancamento', item); }}>
									    <Box sx={{ flex: 3 }}>{capitalizeFirst(item.tipo || 'conta')}</Box>
																			<Box sx={{ flex: 2 }}>{item.vencimento?.slice(0,10) || '—'}</Box>
																			<Box sx={{ flex: 1 }}>R$ {Number(item.valor||0).toFixed(2)}</Box>
																			<Box sx={{ flex: 1 }}>
																				{/* Status do lançamento, só mostra se aluno está expandido */}
																				<Chip
																					label={String(item.status || '').toUpperCase()}
																					color={item.status === 'pago' || item.status === 'Pago' ? 'success' : item.status === 'atrasado' ? 'error' : 'warning'}
																					size="small"
																				/>
																			</Box>
																		</Box>
																	))}
																</Collapse>
															</React.Fragment>
														);
													})}
												</Collapse>
											</React.Fragment>
										);
									})
								)}
					</List>
				)}
			</Paper>

			{/* Dialog de detalhes */}
			<Dialog open={detailOpen} onClose={closeDetail} maxWidth="sm" fullWidth>
				<DialogTitle>
					{detail.type === 'responsavel' && 'Detalhes do responsável'}
					{detail.type === 'aluno' && 'Detalhes do aluno'}
					{detail.type === 'lancamento' && 'Detalhes do lançamento'}
				</DialogTitle>
				<DialogContent sx={{ pt: 2 }}>
					{detail.type === 'responsavel' && detail.data && (
						<Stack spacing={1}>
							<Typography><strong>Nome:</strong> {detail.data.responsavelNome}</Typography>
							<Typography><strong>ID:</strong> {detail.data.responsavelId}</Typography>
							<Typography><strong>Total do mês:</strong> R$ {Number(detail.data.alunos?.reduce((acc, a) => acc + a.itens.reduce((s, i) => s + Number(i.valor||0), 0), 0) || 0).toFixed(2)}</Typography>
							<Typography><strong>Vencimentos:</strong> {detail.data.alunos?.flatMap(a => a.itens.map(i => i.vencimento?.slice(0,10) || '—')).filter((v, i, arr) => arr.indexOf(v) === i).join(', ') || '—'}</Typography>
						</Stack>
					)}
					{detail.type === 'aluno' && detail.data && (
						<Stack spacing={1}>
							<Typography><strong>Aluno:</strong> {detail.data.alunoNome}</Typography>
							<Typography><strong>ID:</strong> {detail.data.alunoId}</Typography>
							<Typography><strong>Total do mês:</strong> R$ {Number(detail.data.itens?.reduce((acc, i) => acc + Number(i.valor||0), 0) || 0).toFixed(2)}</Typography>
							<Typography><strong>Lançamentos:</strong> {detail.data.itens?.length || 0}</Typography>
						</Stack>
					)}
					{detail.type === 'lancamento' && detail.data && (
						<Stack spacing={1}>
							<Typography><strong>ID:</strong> {detail.data.$id}</Typography>
							<Typography><strong>Responsável:</strong> {detail.data.responsavelNome}</Typography>
							<Typography><strong>Aluno:</strong> {detail.data.alunoNome}</Typography>
							<Typography><strong>Tipo:</strong> {capitalizeFirst(detail.data.tipo || '')}</Typography>
							<Typography><strong>Vencimento:</strong> {detail.data.vencimento?.slice(0,10) || '—'}</Typography>
							<Typography><strong>Competência:</strong> {detail.data.competencia || '—'}</Typography>
							<Typography><strong>Valor:</strong> R$ {Number(detail.data.valor||0).toFixed(2)}</Typography>
							<Typography><strong>Status:</strong> {String(detail.data.status||'').toUpperCase()}</Typography>
							{detail.data.descricao && <Typography><strong>Descrição:</strong> {detail.data.descricao}</Typography>}
						</Stack>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDetail}>Fechar</Button>
				</DialogActions>
			</Dialog>

					<Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 'bold' }} onClick={handleOpenNew}>
				Lançar plano financeiro
			</Button>
					<Button variant="outlined" sx={{ fontWeight: 'bold', ml: 1 }} onClick={handleOpenAvulso}>+ Lançar avulso</Button>

					{/* Dialog novo lançamento */}
							<Dialog open={openNew} onClose={() => setOpenNew(false)} maxWidth="sm" fullWidth>
						<DialogTitle>Novo lançamento</DialogTitle>
						<DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
									{formErrorMsg && <Alert severity="error">{formErrorMsg}</Alert>}
									<Autocomplete
										options={responsaveisAll}
										getOptionLabel={(o) => o?.nome || ''}
										isOptionEqualToValue={(o, v) => o.$id === v.$id}
										value={responsaveisAll.find((r) => r.$id === form.responsavelId) || null}
										onChange={(_, val) => setForm((f) => ({ ...f, responsavelId: val?.$id || '', alunoId: '' }))}
										renderInput={(params) => (
											<TextField {...params} label="Responsável" size="small" error={!!formErrors.responsavelId} helperText={formErrors.responsavelId || ''} />
										)}
									/>
									<Autocomplete
										options={alunosForResp}
										getOptionLabel={(o) => o?.nome || ''}
										isOptionEqualToValue={(o, v) => o.$id === v.$id}
										value={alunosForResp.find((a) => a.$id === form.alunoId) || null}
										onChange={(_, val) => setForm((f) => ({ ...f, alunoId: val?.$id || '' }))}
										disabled={!form.responsavelId}
										renderInput={(params) => (
											<TextField {...params} label="Aluno" size="small" required error={!!formErrors.alunoId} helperText={formErrors.alunoId || ''} />
										)}
									/>
							<TextField
								label="Vencimento"
								type="date"
								size="small"
								InputLabelProps={{ shrink: true }}
								value={form.vencimento}
										onChange={(e) => setForm((f) => ({ ...f, vencimento: e.target.value, melhorDia: f.melhorDia || (e.target.value ? Number(e.target.value.split('-')[2]) : '') }))}
								fullWidth
										error={!!formErrors.vencimento}
										helperText={formErrors.vencimento || ''}
							/>
									<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
										<TextField
											label="Quantidade de parcelas"
											type="number"
											size="small"
											inputProps={{ min: 1 }}
											value={form.quantidade}
											onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))}
											fullWidth
											error={!!formErrors.quantidade}
											helperText={formErrors.quantidade || ''}
										/>
										<TextField
											label="Melhor dia de vencimento"
											type="number"
											size="small"
											inputProps={{ min: 1, max: 31 }}
											value={form.melhorDia}
											onChange={(e) => setForm((f) => ({ ...f, melhorDia: e.target.value }))}
											fullWidth
											error={!!formErrors.melhorDia}
											helperText={formErrors.melhorDia || ''}
										/>
									</Stack>
							<TextField
								label="Valor (R$)"
								type="number"
								size="small"
								inputProps={{ step: '0.01', min: '0' }}
								value={form.valor}
								onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
								fullWidth
										error={!!formErrors.valor}
										helperText={formErrors.valor || ''}
							/>
										<FormControlLabel
											control={<Checkbox checked={form.hasMatricula} onChange={(e) => setForm((f) => ({ ...f, hasMatricula: e.target.checked }))} />}
											label="Incluir taxa de matrícula (valor separado)"
										/>
										{form.hasMatricula && (
											<TextField
												label="Valor da taxa de matrícula (R$)"
												type="number"
												size="small"
												inputProps={{ step: '0.01', min: '0' }}
												value={form.valorMatricula}
												onChange={(e) => setForm((f) => ({ ...f, valorMatricula: e.target.value }))}
												fullWidth
												error={!!formErrors.valorMatricula}
												helperText={formErrors.valorMatricula || ''}
											/>
										)}
							<FormControl fullWidth size="small">
								<InputLabel id="status-new-label">Status</InputLabel>
								<Select
									labelId="status-new-label"
									label="Status"
									value={form.status}
									onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
								>
									<MenuItem value="pendente">Pendente</MenuItem>
									<MenuItem value="pago">Pago</MenuItem>
									<MenuItem value="atrasado">Atrasado</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label="Descrição"
								multiline
								minRows={2}
								size="small"
								value={form.descricao}
								onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
								fullWidth
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpenNew(false)}>Cancelar</Button>
							<Button variant="contained" onClick={handleSaveNew} disabled={saving}>Salvar</Button>
						</DialogActions>
					</Dialog>

			{/* Dialog lançamento avulso */}
			<Dialog open={openAvulso} onClose={() => setOpenAvulso(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Novo lançamento avulso</DialogTitle>
				<DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
					{formErrorMsg && <Alert severity="error">{formErrorMsg}</Alert>}
					<Autocomplete
						options={responsaveisAll}
						getOptionLabel={(o) => o?.nome || ''}
						isOptionEqualToValue={(o, v) => o.$id === v.$id}
						value={responsaveisAll.find((r) => r.$id === formAvulso.responsavelId) || null}
						onChange={(_, val) => setFormAvulso((f) => ({ ...f, responsavelId: val?.$id || '', alunoId: '' }))}
						renderInput={(params) => (
							<TextField {...params} label="Responsável" size="small" error={!!formErrors.responsavelId} helperText={formErrors.responsavelId || ''} />
						)}
					/>
					<Autocomplete
						options={alunosForRespAvulso}
						getOptionLabel={(o) => o?.nome || ''}
						isOptionEqualToValue={(o, v) => o.$id === v.$id}
						value={alunosForRespAvulso.find((a) => a.$id === formAvulso.alunoId) || null}
						onChange={(_, val) => setFormAvulso((f) => ({ ...f, alunoId: val?.$id || '' }))}
						disabled={!formAvulso.responsavelId}
						renderInput={(params) => (
							<TextField {...params} label="Aluno" size="small" required error={!!formErrors.alunoId} helperText={formErrors.alunoId || ''} />
						)}
					/>
					<FormControl fullWidth size="small">
						<InputLabel id="tipo-avulso-label">Tipo</InputLabel>
						<Select labelId="tipo-avulso-label" label="Tipo" value={formAvulso.tipo} onChange={(e) => setFormAvulso((f) => ({ ...f, tipo: e.target.value }))}>
							{tiposLancamento.map((t) => (
								<MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField label="Vencimento" type="date" size="small" InputLabelProps={{ shrink: true }} value={formAvulso.vencimento} onChange={(e) => setFormAvulso((f) => ({ ...f, vencimento: e.target.value }))} fullWidth error={!!formErrors.vencimento} helperText={formErrors.vencimento || ''} />
					<TextField label="Valor (R$)" type="number" size="small" inputProps={{ step: '0.01', min: '0' }} value={formAvulso.valor} onChange={(e) => setFormAvulso((f) => ({ ...f, valor: e.target.value }))} fullWidth error={!!formErrors.valor} helperText={formErrors.valor || ''} />
					<FormControl fullWidth size="small">
						<InputLabel id="status-avulso-label">Status</InputLabel>
						<Select labelId="status-avulso-label" label="Status" value={formAvulso.status} onChange={(e) => setFormAvulso((f) => ({ ...f, status: e.target.value }))}>
							<MenuItem value="pendente">Pendente</MenuItem>
							<MenuItem value="pago">Pago</MenuItem>
							<MenuItem value="atrasado">Atrasado</MenuItem>
						</Select>
					</FormControl>
					<TextField label="Descrição" multiline minRows={2} size="small" value={formAvulso.descricao} onChange={(e) => setFormAvulso((f) => ({ ...f, descricao: e.target.value }))} fullWidth />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenAvulso(false)}>Cancelar</Button>
					<Button variant="contained" onClick={handleSaveAvulso} disabled={savingAvulso}>Salvar</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default FinancialModule;

