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

const FinancialModule = () => {
		const [lancamentos, setLancamentos] = useState([]);
	const [expanded, setExpanded] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
		const now = new Date();
		const defaultCompetencia = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
		const [filterCompetencia, setFilterCompetencia] = useState(defaultCompetencia);
		const [filterStatus, setFilterStatus] = useState(''); // '', 'pendente', 'pago', 'atrasado'
		const [filterMode, setFilterMode] = useState('competencia'); // 'competencia' | 'vencimento'
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
					let res;
							if (filterMode === 'competencia' || (filterMode === 'vencimento' && filterResponsavel)) {
						// Consulta por competência (index simples). Filtra status em memória.
								const queries = [Query.equal('competencia', filterCompetencia)];
								if (filterResponsavel) queries.push(Query.equal('responsavelId', filterResponsavel));
								res = await appwriteService.listDocuments('sistema', 'lancamentos_financeiros', queries);
					} else {
						// Modo por vencimento: usa índice combinado (vencimento+status). Se status não for definido, faz fallback para competência.
						if (filterStatus) {
							const [year, month] = filterCompetencia.split('-').map(Number);
							const start = new Date(year, month - 1, 1);
							const end = new Date(year, month, 0, 23, 59, 59, 999);
									const queries = [
								Query.greaterThanEqual('vencimento', start.toISOString()),
								Query.lessThanEqual('vencimento', end.toISOString()),
								Query.equal('status', filterStatus),
									];
									// Nota: adicionar responsavelId aqui pode não usar seu índice combinado; evitamos por performance.
									res = await appwriteService.listDocuments('sistema', 'lancamentos_financeiros', queries);
						} else {
							// Fallback: sem status, volta para competência para não exigir índice de 'vencimento' sozinho
							res = await appwriteService.listDocuments('sistema', 'lancamentos_financeiros', [
								Query.equal('competencia', filterCompetencia),
							]);
						}
					}
					let docs = res?.documents || [];
					// Tipagem: somente mensalidades
					docs = docs.filter((d) => String(d.tipo || '').toLowerCase() === 'mensalidade');
					// Filtro de status em memória quando necessário
					if (filterMode === 'competencia' || !filterStatus) {
						if (filterStatus) {
							docs = docs.filter((d) => String(d.status || '').toLowerCase() === String(filterStatus).toLowerCase());
						}
					}
					setLancamentos(docs);
			} catch (e) {
				console.error('Erro ao carregar responsáveis/alunos:', e);
					setError('Não foi possível carregar os dados.');
			} finally {
				setLoading(false);
			}
		};
			fetchData();
		}, [filterCompetencia, filterStatus, filterMode]);

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
						docsToCreate.push({
							id: `${form.responsavelId}[${nextSeq + i}]`,
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
								docsToCreate.push({
									id: `${form.responsavelId}[${nextSeq + Number(form.quantidade)}]`,
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
				// Trigger reload
				setFilterCompetencia((c) => c); // força o useEffect a rodar
			} catch (e) {
				console.error('Erro ao criar lançamento', e);
					setFormErrorMsg('Não foi possível salvar o plano financeiro.');
			} finally {
				setSaving(false);
			}
		};

	return (
		<Box sx={{ maxWidth: 900, margin: '0 auto', mt: 4 }}>
			<Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
				Gestão Financeira
			</Typography>
					<Typography variant="subtitle1" sx={{ mb: 2 }}>
						Mensalidades
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
						<FormControl size="small" sx={{ minWidth: 190 }}>
							<InputLabel id="modo-label">Modo de filtro</InputLabel>
							<Select labelId="modo-label" label="Modo de filtro" value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
								<MenuItem value="competencia">Por competência</MenuItem>
								<MenuItem value="vencimento">Por vencimento (mês)</MenuItem>
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
						{filterMode === 'vencimento' && !filterStatus && (
							<Tooltip title="Para melhor desempenho ao filtrar por vencimento, selecione um status (usa índice combinado).">
								<Chip label="Dica: selecione um status" size="small" />
							</Tooltip>
						)}
								{filterMode === 'vencimento' && filterResponsavel && (
									<Tooltip title="Filtro por responsável utiliza consulta por competência para melhor desempenho.">
										<Chip label="Usando competência" size="small" />
									</Tooltip>
								)}
								<Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
									<Typography variant="body2" color="text.secondary">Total geral do mês:</Typography>
									<Chip color="primary" label={`R$ ${totalGeral.toFixed(2)}`} />
								</Box>
					</Paper>

					<Paper elevation={2} sx={{ mb: 3 }}>
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
								{agrupado.map((resp) => {
									const rid = resp.responsavelId;
									const open = !!expanded[rid];
									const qtdAlunos = resp.alunos.length;
													return (
										<Box key={rid}>
											<ListItemButton onClick={() => toggleExpand(rid)}>
												<Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
													<ListItemText
														primary={resp.responsavelNome}
																		secondary={`Alunos: ${qtdAlunos} • Lançamentos: ${resp.totalLanc} • Total: R$ ${resp.total.toFixed(2)}`}
													/>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
																		{!!pendentesPorResp.get(rid) && (
																			<Chip color="warning" size="small" label={`Pendentes: ${pendentesPorResp.get(rid)}`} />
																		)}
														{open ? <ExpandLess /> : <ExpandMore />}
													</Box>
												</Box>
											</ListItemButton>
											<Collapse in={open} timeout="auto" unmountOnExit>
												<Divider />
												<List component="div" disablePadding>
													{resp.alunos.map((aluno) => (
														<Box key={aluno.alunoId}>
															<ListItemButton sx={{ pl: 4 }}>
																<ListItemText
																	primary={aluno.alunoNome}
																	secondary={`Total do mês: R$ ${aluno.total.toFixed(2)}`}
																/>
															</ListItemButton>
															{aluno.itens.map((item) => (
																<ListItemButton key={item.$id} sx={{ pl: 6 }}>
																	<ListItemText
																		primary={`Venc.: ${item.vencimento?.slice(0,10) || '—'} • Valor: R$ ${Number(item.valor||0).toFixed(2)}`}
																		secondary={item.descricao || ''}
																	/>
																	<Chip
																		label={String(item.status || '').toUpperCase()}
																		color={item.status === 'pago' || item.status === 'Pago' ? 'success' : item.status === 'atrasado' ? 'error' : 'warning'}
																		size="small"
																	/>
																</ListItemButton>
															))}
															<Divider />
														</Box>
													))}
													{qtdAlunos === 0 && (
														<Box sx={{ pl: 4, pr: 2, py: 1.5 }}>
															<Typography variant="body2" color="text.secondary">Sem lançamentos de mensalidade para este responsável no mês.</Typography>
														</Box>
													)}
												</List>
											</Collapse>
											<Divider />
										</Box>
									);
								})}
								{agrupado.length === 0 && (
							<Box sx={{ p: 3 }}>
										<Typography variant="body2" color="text.secondary">Nenhum lançamento de mensalidade encontrado para o mês atual.</Typography>
							</Box>
						)}
					</List>
				)}
			</Paper>

					<Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 'bold' }} onClick={handleOpenNew}>
				Lançar plano financeiro
			</Button>

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
		</Box>
	);
};

export default FinancialModule;

