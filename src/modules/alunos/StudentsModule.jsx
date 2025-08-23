import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog as MuiDialog } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import appwriteService from '../../services/appwriteService';
import brand from '../../assets/brand.json';
import { TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, Alert } from '@mui/material';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

// Função para formatar CPF visualmente
function formatCPF(cpf) {
	if (!cpf) return '';
	cpf = cpf.replace(/\D/g, '').slice(0, 11);
	if (cpf.length <= 3) return cpf;
	if (cpf.length <= 6) return `${cpf.slice(0,3)}.${cpf.slice(3)}`;
	if (cpf.length <= 9) return `${cpf.slice(0,3)}.${cpf.slice(3,6)}.${cpf.slice(6)}`;
	return `${cpf.slice(0,3)}.${cpf.slice(3,6)}.${cpf.slice(6,9)}-${cpf.slice(9,11)}`;
}
function formatPhone(phone) {
	if (!phone) return '';
	phone = phone.replace(/\D/g, '').slice(0, 11);
	if (phone.length <= 2) return phone;
	if (phone.length <= 7) return `(${phone.slice(0,2)}) ${phone.slice(2)}`;
	if (phone.length <= 11) return `(${phone.slice(0,2)}) ${phone.slice(2,7)}-${phone.slice(7)}`;
	return `(${phone.slice(0,2)}) ${phone.slice(2,7)}-${phone.slice(7,11)}`;
}

const StudentsModule = () => {
	const { user } = useAuth();
	
	// Estados
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [openAddModal, setOpenAddModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [responsaveisAppwrite, setResponsaveisAppwrite] = useState([]);
	const [vinculoDialog, setVinculoDialog] = useState({ open: false, responsavel: null, alunoNome: '' });
	const [errors, setErrors] = useState({});
	const [errorMessage, setErrorMessage] = useState('');
	
	// Estados para filtros
	const [filterTurno, setFilterTurno] = useState('');
	const [filterIdades, setFilterIdades] = useState([]);
	const [filterModulo, setFilterModulo] = useState('');
	
	// Estado para novo estudante
	const [newStudent, setNewStudent] = useState({
		responsavelNome: '',
		responsavelCPF: '',
		responsavelEmail: '',
		responsavelEndereco: '',
		responsavelNumero: '',
		responsavelNascimento: '',
		responsavelTelefone: '',
		alunoNome: '',
		alunoCPF: '',
		alunoNascimento: '',
		turno: '',
		diasSemana: [],
	});

	// Função para obter username do usuário logado
	function getUsername(user) {
		if (!user) return 'desconhecido';
		if (user.username) return user.username;
		if (user.name) return user.name;
		if (user.email) return user.email.split('@')[0];
		return 'desconhecido';
	}

	// Função para buscar estudantes
	const fetchStudents = async () => {
		try {
			const result = await appwriteService.listDocuments('sistema', 'alunos');
			setStudents(result.documents || []);
		} catch (error) {
			console.error('Erro ao buscar alunos:', error);
		}
	};

	// Definição das colunas dinâmicas
	const alunoFields = [
		{ field: 'nome', headerName: 'Nome', flex: 1, hideable: false },
		{ field: 'cpf', headerName: 'CPF', flex: 0.7, hideable: true },
		{ field: 'nascimento', headerName: 'Nascimento', flex: 0.7, hideable: true },
		{ field: 'turno', headerName: 'Turno', flex: 0.7, hideable: true },
		{ field: 'modulo', headerName: 'Módulo', flex: 0.7, hideable: true },
		{ field: 'diasSemana', headerName: 'Dias da Semana', flex: 1, hideable: true, valueGetter: (params) => {
			if (!params.row || typeof params.row.diasSemana === 'undefined') return '';
			return Array.isArray(params.row.diasSemana) ? params.row.diasSemana.join(', ') : params.row.diasSemana;
		} },
		{ field: 'responsavelId', headerName: 'ID Responsável', flex: 0.7, hideable: true },
	];

	// Carregar configuração de colunas do localStorage
	const defaultColumnConfig = alunoFields.map(col => ({ field: col.field, visible: true, width: col.flex * 150 }));
	const [columnConfig, setColumnConfig] = useState(() => {
		try {
			const saved = localStorage.getItem('alunosColumnConfig');
			if (saved) return JSON.parse(saved);
		} catch {}
		return defaultColumnConfig;
	});

	// Calcular idade a partir do nascimento
	const getIdade = nascimento => {
		if (!nascimento) return '';
		const nasc = new Date(nascimento);
		const hoje = new Date();
		let idade = hoje.getFullYear() - nasc.getFullYear();
		const m = hoje.getMonth() - nasc.getMonth();
		if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
		return idade;
	};

	// Filtrar alunos
	const alunosFiltrados = students.filter(aluno => {
		const idade = getIdade(aluno.nascimento);
		if (filterTurno && aluno.turno !== filterTurno) return false;
		if (filterModulo && String(aluno.modulo) !== String(filterModulo)) return false;
		if (filterIdades.length > 0 && !filterIdades.includes(String(idade))) return false;
		return true;
	});

	// Colunas para DataGrid
	const gridColumns = columnConfig
		.filter(col => col.visible)
		.map((col, idx) => {
			const base = alunoFields.find(f => f.field === col.field);
			return {
				...base,
				field: col.field,
				headerName: base.headerName,
				width: col.width,
				flex: undefined,
				hideable: base.hideable,
				valueGetter: base.valueGetter,
				disableColumnMenu: col.field === 'nome',
				sortable: true,
				resizable: true,
			};
		});

	// useEffects
	useEffect(() => {
		localStorage.setItem('alunosColumnConfig', JSON.stringify(columnConfig));
	}, [columnConfig]);

	useEffect(() => {
		fetchStudents();
	}, []);

	// Handlers de interface
	const handleToggleColumn = (field) => {
		if (field === 'nome') return;
		setColumnConfig(config => config.map(col => col.field === field ? { ...col, visible: !col.visible } : col));
	};

	const handleMoveColumn = (fromIdx, toIdx) => {
		if (fromIdx === 0 || toIdx === 0) return;
		setColumnConfig(config => {
			const cols = [...config];
			const [moved] = cols.splice(fromIdx, 1);
			cols.splice(toIdx, 0, moved);
			return cols;
		});
	};

	const handleColumnResize = (field, newWidth) => {
		setColumnConfig(config => config.map(col => col.field === field ? { ...col, width: newWidth } : col));
	};

	const handleRowClick = (params) => {
		setSelectedStudent(params.row);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedStudent(null);
	};

	const handleOpenAddModal = () => {
		setNewStudent({
			responsavelNome: '',
			responsavelCPF: '',
			responsavelEmail: '',
			responsavelEndereco: '',
			responsavelNumero: '',
			responsavelNascimento: '',
			responsavelTelefone: '',
			alunoNome: '',
			alunoCPF: '',
			alunoNascimento: '',
			turno: '',
			diasSemana: [],
		});
		setErrors({});
		setErrorMessage('');
		appwriteService.listDocuments('sistema', 'responsaveis').then(res => {
			setResponsaveisAppwrite(res.documents || []);
		});
		setOpenAddModal(true);
	};

	const handleCloseAddModal = () => {
		setOpenAddModal(false);
		setErrors({});
		setErrorMessage('');
	};

	const handleCancelVinculo = () => {
		setVinculoDialog({ open: false, responsavel: null, alunoNome: '' });
	};

	// Função principal para adicionar estudante
	const handleAddStudent = async () => {
		if (isSaving) return;
		
		// Limpar erros anteriores
		setErrors({});
		setErrorMessage('');

		// Validação dos campos obrigatórios
		const campos = [
			{ nome: 'responsavelNome', label: 'Nome do responsável', valor: newStudent.responsavelNome },
			{ nome: 'responsavelCPF', label: 'CPF do responsável', valor: newStudent.responsavelCPF },
			{ nome: 'responsavelEmail', label: 'Email do responsável', valor: newStudent.responsavelEmail },
			{ nome: 'responsavelEndereco', label: 'Endereço do responsável', valor: newStudent.responsavelEndereco },
			{ nome: 'responsavelNumero', label: 'Número do responsável', valor: newStudent.responsavelNumero },
			{ nome: 'responsavelNascimento', label: 'Nascimento do responsável', valor: newStudent.responsavelNascimento },
			{ nome: 'responsavelTelefone', label: 'Telefone do responsável', valor: newStudent.responsavelTelefone },
			{ nome: 'alunoNome', label: 'Nome do aluno', valor: newStudent.alunoNome },
			{ nome: 'alunoCPF', label: 'CPF do aluno', valor: newStudent.alunoCPF },
			{ nome: 'alunoNascimento', label: 'Nascimento do aluno', valor: newStudent.alunoNascimento },
			{ nome: 'turno', label: 'Turno', valor: newStudent.turno },
		];
		
		const camposFaltando = campos.filter(c => !c.valor || c.valor.trim() === '');
		let faltando = [];
		let newErrors = {};
		
		if (camposFaltando.length > 0) {
			faltando = camposFaltando.map(c => c.label);
			camposFaltando.forEach(c => {
				newErrors[c.nome] = true;
			});
		}
		
		if (newStudent.diasSemana.length === 0) {
			faltando.push('Dias da semana');
			newErrors['diasSemana'] = true;
		}
		
		if (faltando.length > 0) {
			setErrors(newErrors);
			setErrorMessage(`Por favor, preencha os seguintes campos obrigatórios: ${faltando.join(', ')}`);
			return;
		}

		setIsSaving(true);

		try {
			// Formatar CPFs
			const cleanCPF = cpf => cpf.replace(/\D/g, '');
			const formatCPFForData = cpf => cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
			
			const cpfResponsavelID = cleanCPF(newStudent.responsavelCPF);
			const cpfAlunoID = cleanCPF(newStudent.alunoCPF);
			const cpfResponsavelFormatado = formatCPFForData(newStudent.responsavelCPF);
			const cpfAlunoFormatado = formatCPFForData(newStudent.alunoCPF);

			// Buscar responsável existente
			const result = await appwriteService.listDocuments('sistema', 'responsaveis', []);
			const responsavelExistente = result.documents.find(r => r.$id === cpfResponsavelID);

			const usuarioLogado = getUsername(user);
			const dataMatricula = new Date().toISOString();

			if (responsavelExistente) {
				// Responsável existe - vincular novo aluno
				const alunoData = {
					nome: newStudent.alunoNome,
					cpf: cpfAlunoFormatado,
					nascimento: newStudent.alunoNascimento,
					turno: newStudent.turno,
					diasSemana: newStudent.diasSemana,
					responsavelId: responsavelExistente.$id,
					criadoPor: usuarioLogado,
					dataMatricula,
				};

				const alunoDoc = await appwriteService.createDocument('sistema', 'alunos', cpfAlunoID, alunoData);
				
				const novosAlunosID = Array.isArray(responsavelExistente.alunosID)
					? [...responsavelExistente.alunosID, alunoDoc.$id]
					: [alunoDoc.$id];
				
				await appwriteService.updateDocument('sistema', 'responsaveis', responsavelExistente.$id, {
					alunosID: novosAlunosID
				});
			} else {
				// Criar novo responsável e aluno
				const responsavelData = {
					nome: newStudent.responsavelNome,
					cpf: cpfResponsavelFormatado,
					email: newStudent.responsavelEmail,
					endereco: newStudent.responsavelEndereco,
					numero: newStudent.responsavelNumero,
					nascimento: newStudent.responsavelNascimento,
					telefone: newStudent.responsavelTelefone,
					criadoPor: usuarioLogado,
					dataMatricula,
					alunosID: [],
				};

				const responsavelDoc = await appwriteService.createDocument('sistema', 'responsaveis', cpfResponsavelID, responsavelData);

				const alunoData = {
					nome: newStudent.alunoNome,
					cpf: cpfAlunoFormatado,
					nascimento: newStudent.alunoNascimento,
					turno: newStudent.turno,
					diasSemana: newStudent.diasSemana,
					responsavelId: responsavelDoc.$id,
					criadoPor: usuarioLogado,
					dataMatricula,
				};

				const alunoDoc = await appwriteService.createDocument('sistema', 'alunos', cpfAlunoID, alunoData);

				await appwriteService.updateDocument('sistema', 'responsaveis', responsavelDoc.$id, {
					alunosID: [alunoDoc.$id]
				});
			}

			await fetchStudents();
			setOpenAddModal(false);
		} catch (error) {
			console.error('Erro ao cadastrar aluno/responsável:', error);
		} finally {
			setIsSaving(false);
		}
	};

	// Função para confirmar vínculo ao responsável existente
	const handleConfirmVinculo = async () => {
		setVinculoDialog({ open: false, responsavel: null, alunoNome: '' });
		if (isSaving) return;
		setIsSaving(true);
		
		try {
			const usuarioLogado = getUsername(user);
			const dataMatricula = new Date().toISOString();
			const cleanCPF = cpf => cpf.replace(/\D/g, '');
			const formatCPFForData = cpf => cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
			
			const alunoData = {
				nome: newStudent.alunoNome,
				cpf: formatCPFForData(newStudent.alunoCPF),
				nascimento: newStudent.alunoNascimento,
				turno: newStudent.turno,
				diasSemana: newStudent.diasSemana,
				responsavelId: vinculoDialog.responsavel.$id,
				criadoPor: usuarioLogado,
				dataMatricula,
			};

			const cpfAlunoID = cleanCPF(newStudent.alunoCPF);
			const alunoDoc = await appwriteService.createDocument('sistema', 'alunos', cpfAlunoID, alunoData);
			
			const antigosAlunosID = Array.isArray(vinculoDialog.responsavel.alunosID) ? vinculoDialog.responsavel.alunosID : [];
			const novosAlunosID = [...antigosAlunosID, alunoDoc.$id];
			
			await appwriteService.updateDocument('sistema', 'responsaveis', vinculoDialog.responsavel.$id, {
				alunosID: novosAlunosID
			});
			
			await fetchStudents();
			setOpenAddModal(false);
		} catch (error) {
			console.error('Erro ao vincular aluno ao responsável existente:', error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Button 
					variant="contained" 
					onClick={handleOpenAddModal} 
					sx={{ 
						background: brand.corPrincipal, 
						color: '#fff', 
						fontWeight: 600, 
						'&:hover': { 
							background: brand.corSecundaria, 
							color: brand.corPrincipal 
						} 
					}}
				>
					Matricular novo aluno
				</Button>
			</Box>

			{/* Filtros */}
			<Box display="flex" gap={2} mb={2}>
				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel id="turno-label">Turno</InputLabel>
					<Select labelId="turno-label" value={filterTurno} onChange={e => setFilterTurno(e.target.value)} label="Turno">
						<MenuItem value="">Todos</MenuItem>
						<MenuItem value="Manhã">Manhã</MenuItem>
						<MenuItem value="Tarde">Tarde</MenuItem>
					</Select>
				</FormControl>
				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel id="idade-label">Idade</InputLabel>
					<Select
						labelId="idade-label"
						multiple
						value={filterIdades}
						onChange={e => setFilterIdades(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
						renderValue={selected => selected.length === 0 ? 'Todas' : selected.join(', ')}
						label="Idade"
					>
						{[...new Set(students.map(a => String(getIdade(a.nascimento))))].filter(Boolean).map(age => (
							<MenuItem key={age} value={age}>
								<Checkbox checked={filterIdades.indexOf(age) > -1} />
								<ListItemText primary={age} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel id="modulo-label">Módulo</InputLabel>
					<Select labelId="modulo-label" value={filterModulo} onChange={e => setFilterModulo(e.target.value)} label="Módulo">
						<MenuItem value="">Todos</MenuItem>
						{[...new Set(students.map(a => a.modulo))].filter(Boolean).map(mod => (
							<MenuItem key={mod} value={mod}>{mod}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* Configuração de colunas */}
			<Box mb={2}>
				<Typography variant="subtitle2" sx={{ mb: 1 }}>Colunas visíveis:</Typography>
				{columnConfig.map((col, idx) => (
					<Box key={col.field} display="inline-flex" alignItems="center" mr={2}>
						<Checkbox
							checked={col.visible}
							disabled={col.field === 'nome'}
							onChange={() => handleToggleColumn(col.field)}
						/>
						<Typography sx={{ fontWeight: col.field === 'nome' ? 'bold' : 'normal' }}>
							{alunoFields.find(f => f.field === col.field)?.headerName || col.field}
						</Typography>
					</Box>
				))}
			</Box>

			{/* DataGrid */}
			<Box sx={{ height: 500, width: '100%' }}>
				<DataGrid
					rows={alunosFiltrados}
					columns={gridColumns}
					getRowId={row => row.$id || row.id || row.cpf}
					pageSize={10}
					rowsPerPageOptions={[5, 10, 20]}
					disableColumnSelector
					disableColumnFilter
					onColumnOrderChange={(params) => {
						const fromIdx = params.oldIndex;
						const toIdx = params.targetIndex;
						handleMoveColumn(fromIdx, toIdx);
					}}
					onColumnResize={(params) => {
						handleColumnResize(params.colDef.field, params.width);
					}}
					localeText={{
						columnMenuSortAsc: 'Ordenar crescente',
						columnMenuSortDesc: 'Ordenar decrescente',
						noRowsLabel: 'Nenhum aluno encontrado',
						footerRowSelected: (count) => count !== 1 ? `${count.toLocaleString()} linhas selecionadas` : '1 linha selecionada',
						footerTotalRows: 'Total de linhas:',
						toolbarExport: 'Exportar',
						toolbarExportCSV: 'Download CSV',
						toolbarExportPrint: 'Imprimir',
					}}
				/>
			</Box>

			{/* Modal para adicionar estudante */}
			<Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
				<DialogTitle>Matricular novo aluno</DialogTitle>
				<DialogContent>
					{errorMessage && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{errorMessage}
						</Alert>
					)}
					<Box display="flex" flexDirection="column" gap={2} mt={1}>
						<Typography variant="subtitle1" sx={{ mb: 1 }}>Dados do responsável</Typography>
						<TextField 
							label="Nome do responsável" 
							value={newStudent.responsavelNome} 
							onChange={e => setNewStudent({ ...newStudent, responsavelNome: e.target.value })} 
							fullWidth 
							error={errors.responsavelNome}
							helperText={errors.responsavelNome ? 'Campo obrigatório' : ''}
						/>
						<TextField 
							label="CPF do responsável" 
							value={formatCPF(newStudent.responsavelCPF)}
							onChange={e => {
								let val = e.target.value.replace(/\D/g, '').slice(0, 11);
								setNewStudent({ ...newStudent, responsavelCPF: val });
							}}
							fullWidth
							inputProps={{ maxLength: 14 }}
							placeholder="000.000.000-00"
							error={errors.responsavelCPF}
							helperText={errors.responsavelCPF ? 'Campo obrigatório' : ''}
						/>
						<TextField 
							label="E-mail" 
							value={newStudent.responsavelEmail} 
							onChange={e => setNewStudent({ ...newStudent, responsavelEmail: e.target.value })} 
							fullWidth 
							error={errors.responsavelEmail}
							helperText={errors.responsavelEmail ? 'Campo obrigatório' : ''}
						/>
						<Box display="flex" gap={2}>
							<TextField 
								label="Endereço residencial" 
								value={newStudent.responsavelEndereco} 
								onChange={e => setNewStudent({ ...newStudent, responsavelEndereco: e.target.value })} 
								fullWidth 
								error={errors.responsavelEndereco}
								helperText={errors.responsavelEndereco ? 'Campo obrigatório' : ''}
							/>
							<TextField 
								label="Número" 
								value={newStudent.responsavelNumero} 
								onChange={e => setNewStudent({ ...newStudent, responsavelNumero: e.target.value })} 
								sx={{ maxWidth: 120 }} 
								error={errors.responsavelNumero}
								helperText={errors.responsavelNumero ? 'Campo obrigatório' : ''}
							/>
						</Box>
						<TextField 
							label="Data de nascimento do responsável" 
							type="date" 
							InputLabelProps={{ shrink: true }} 
							value={newStudent.responsavelNascimento} 
							onChange={e => setNewStudent({ ...newStudent, responsavelNascimento: e.target.value })} 
							fullWidth 
							error={errors.responsavelNascimento}
							helperText={errors.responsavelNascimento ? 'Campo obrigatório' : ''}
						/>
						<TextField 
							label="Telefone do responsável" 
							value={formatPhone(newStudent.responsavelTelefone)}
							onChange={e => {
								let val = e.target.value.replace(/\D/g, '').slice(0, 11);
								setNewStudent({ ...newStudent, responsavelTelefone: val });
							}}
							fullWidth
							inputProps={{ maxLength: 15 }}
							placeholder="(00) 00000-0000"
							error={errors.responsavelTelefone}
							helperText={errors.responsavelTelefone ? 'Campo obrigatório' : ''}
						/>

						<Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Dados do aluno</Typography>
						<TextField 
							label="Nome do aluno" 
							value={newStudent.alunoNome} 
							onChange={e => setNewStudent({ ...newStudent, alunoNome: e.target.value })} 
							fullWidth 
							error={errors.alunoNome}
							helperText={errors.alunoNome ? 'Campo obrigatório' : ''}
						/>
						<TextField 
							label="CPF do aluno" 
							value={formatCPF(newStudent.alunoCPF)}
							onChange={e => {
								let val = e.target.value.replace(/\D/g, '').slice(0, 11);
								setNewStudent({ ...newStudent, alunoCPF: val });
							}}
							fullWidth
							inputProps={{ maxLength: 14 }}
							placeholder="000.000.000-00"
							error={errors.alunoCPF}
							helperText={errors.alunoCPF ? 'Campo obrigatório' : ''}
						/>
						<TextField 
							label="Data de nascimento do aluno" 
							type="date" 
							InputLabelProps={{ shrink: true }} 
							value={newStudent.alunoNascimento} 
							onChange={e => setNewStudent({ ...newStudent, alunoNascimento: e.target.value })} 
							fullWidth 
							error={errors.alunoNascimento}
							helperText={errors.alunoNascimento ? 'Campo obrigatório' : ''}
						/>
						<TextField 
							label="Turno" 
							select 
							value={newStudent.turno} 
							onChange={e => setNewStudent({ ...newStudent, turno: e.target.value })} 
							fullWidth
							error={errors.turno}
							helperText={errors.turno ? 'Campo obrigatório' : ''}
						>
							<MenuItem value="Manhã">Manhã</MenuItem>
							<MenuItem value="Tarde">Tarde</MenuItem>
						</TextField>
						<Box>
							<Typography sx={{ mb: 1, color: errors.diasSemana ? 'error.main' : 'inherit' }}>
								Dias da semana {errors.diasSemana && '(Campo obrigatório)'}
							</Typography>
							<Box display="flex" gap={2}>
								{['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(dia => (
									<Button
										key={dia}
										variant={newStudent.diasSemana.includes(dia) ? 'contained' : 'outlined'}
										color={errors.diasSemana ? 'error' : 'primary'}
										onClick={() => {
											setNewStudent({
												...newStudent,
												diasSemana: newStudent.diasSemana.includes(dia)
													? newStudent.diasSemana.filter(d => d !== dia)
													: [...newStudent.diasSemana, dia]
											});
										}}
									>
										{dia}
									</Button>
								))}
							</Box>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseAddModal}>Cancelar</Button>
					<Box sx={{ position: 'relative', display: 'inline-block' }}>
						<Button 
							onClick={handleAddStudent} 
							variant="contained" 
							disabled={isSaving}
						>
							{isSaving ? 'Salvando...' : 'Salvar'}
						</Button>
						{isSaving && (
							<Box sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								bgcolor: 'rgba(255,255,255,0.01)',
								zIndex: 2,
								pointerEvents: 'all',
								borderRadius: 1
							}} />
						)}
					</Box>
				</DialogActions>
			</Dialog>

			{/* Popup de vínculo de responsável existente */}
			<MuiDialog open={vinculoDialog.open} onClose={handleCancelVinculo} maxWidth="xs">
				<DialogTitle>Vincular responsável existente</DialogTitle>
				<DialogContent>
					<Typography>
						Este CPF já está vinculado ao responsável pelo aluno(a): {vinculoDialog.alunoNome || 'Aluno existente'}.
						Deseja vincular esta nova matrícula à este responsável?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelVinculo}>Cancelar</Button>
					<Button onClick={handleConfirmVinculo} variant="contained">Vincular</Button>
				</DialogActions>
			</MuiDialog>
		</Box>
	);
};

export default StudentsModule;
