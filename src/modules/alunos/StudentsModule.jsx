import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/material/locale';


const mockStudents = [
	{ id: 1, name: 'João Silva', idade: 7, turno: 'Manhã', modulo: 1 },
	{ id: 2, name: 'Maria Santos', idade: 8, turno: 'Tarde', modulo: 2 },
	{ id: 3, name: 'Pedro Costa', idade: 7, turno: 'Manhã', modulo: 1 },
	{ id: 4, name: 'Ana Paula', idade: 6, turno: 'Tarde', modulo: 1 },
	{ id: 5, name: 'Lucas Lima', idade: 9, turno: 'Tarde', modulo: 2 },
	{ id: 6, name: 'Beatriz Souza', idade: 10, turno: 'Tarde', modulo: 2 },
	{ id: 7, name: 'Rafael Costa', idade: 5, turno: 'Tarde', modulo: 1 },
	{ id: 8, name: 'Gabriel Martins', idade: 12, turno: 'Tarde', modulo: 2 },
	{ id: 9, name: 'Larissa Alves', idade: 11, turno: 'Tarde', modulo: 2 },
	{ id: 10, name: 'Felipe Rocha', idade: 8, turno: 'Tarde', modulo: 1 },
	{ id: 11, name: 'Carolina Dias', idade: 7, turno: 'Tarde', modulo: 1 },
	{ id: 12, name: 'Vinícius Melo', idade: 6, turno: 'Tarde', modulo: 1 },
	{ id: 13, name: 'Amanda Pires', idade: 9, turno: 'Tarde', modulo: 2 },
	{ id: 14, name: 'Bruno Teixeira', idade: 10, turno: 'Tarde', modulo: 2 },
	{ id: 15, name: 'Juliana Freitas', idade: 5, turno: 'Tarde', modulo: 1 },
	{ id: 16, name: 'Eduardo Ramos', idade: 12, turno: 'Tarde', modulo: 2 },
	{ id: 17, name: 'Sofia Cardoso', idade: 11, turno: 'Tarde', modulo: 2 },
	{ id: 18, name: 'Matheus Barros', idade: 8, turno: 'Manhã', modulo: 1 },
	{ id: 19, name: 'Isabela Faria', idade: 7, turno: 'Manhã', modulo: 1 },
	{ id: 20, name: 'Tiago Nunes', idade: 6, turno: 'Manhã', modulo: 1 },
	{ id: 21, name: 'Camila Borges', idade: 9, turno: 'Tarde', modulo: 2 },
	{ id: 22, name: 'Rodrigo Pinto', idade: 10, turno: 'Tarde', modulo: 2 },
	{ id: 23, name: 'Patrícia Lopes', idade: 5, turno: 'Tarde', modulo: 1 },
	{ id: 24, name: 'Fernando Castro', idade: 12, turno: 'Tarde', modulo: 2 },
	{ id: 25, name: 'Luana Ribeiro', idade: 11, turno: 'Tarde', modulo: 2 },
];

const columns = [
	{ field: 'name', headerName: 'Nome', flex: 1 },
	{ field: 'idade', headerName: 'Idade', flex: 0.5, type: 'number' },
	{ field: 'turno', headerName: 'Turno', flex: 0.7 },
	{ field: 'modulo', headerName: 'Módulo', flex: 0.5, type: 'number' },
];

const StudentsModule = () => {
			const [students] = useState(mockStudents);
				const [idades, setIdades] = useState([]);
				const [turno, setTurno] = useState('');
				const [modulo, setModulo] = useState('');
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [openAddModal, setOpenAddModal] = useState(false);
	const [newStudent, setNewStudent] = useState({
		responsavelNome: '',
		responsavelCPF: '',
		responsavelEmail: '',
		responsavelEndereco: '',
		responsavelNumero: '',
		responsavelNascimento: '',
		responsavelTelefone: '',
		alunoNome: '',
		alunoNascimento: '',
		turno: '',
		diasSemana: [],
	});

	const handleRowClick = (params) => {
		setSelectedStudent(params.row);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedStudent(null);
	};

	const handleOpenAddModal = () => {
		setNewStudent({ name: '', idade: '', turno: '', modulo: '' });
		setOpenAddModal(true);
	};

	const handleCloseAddModal = () => {
		setOpenAddModal(false);
	};

	const handleAddStudent = () => {
		// Validação simples
		if (!newStudent.responsavelNome || !newStudent.responsavelCPF || !newStudent.responsavelEmail || !newStudent.responsavelEndereco || !newStudent.responsavelNumero || !newStudent.responsavelNascimento || !newStudent.responsavelTelefone || !newStudent.alunoNome || !newStudent.alunoNascimento || !newStudent.turno || newStudent.diasSemana.length === 0) return;
		// Aqui você pode integrar com o backend/Appwrite
		// Por enquanto, apenas adiciona ao mock
		students.push({
			id: students.length + 1,
			name: newStudent.alunoNome,
			idade: '', // Não informado
			turno: newStudent.turno,
			modulo: '', // Não informado
			responsavelNome: newStudent.responsavelNome,
			responsavelCPF: newStudent.responsavelCPF,
			responsavelEmail: newStudent.responsavelEmail,
			responsavelEndereco: newStudent.responsavelEndereco,
			responsavelNumero: newStudent.responsavelNumero,
			responsavelNascimento: newStudent.responsavelNascimento,
			responsavelTelefone: newStudent.responsavelTelefone,
			alunoNascimento: newStudent.alunoNascimento,
			diasSemana: newStudent.diasSemana,
		});
		setOpenAddModal(false);
	};

	// Filtra alunos por idade, turno e módulo
	const filteredStudents = students.filter(student => {
		if (idades.length > 0 && !idades.includes(student.idade)) return false;
		if (turno && student.turno !== turno) return false;
		if (modulo && student.modulo !== Number(modulo)) return false;
		return true;
	});

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
					Gestão de Alunos
				</Typography>
				<Button variant="contained" onClick={handleOpenAddModal}>Matricular novo aluno</Button>
			<Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
				<DialogTitle>Matricular novo aluno</DialogTitle>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2} mt={1}>
						<Typography variant="subtitle1" sx={{ mb: 1 }}>Dados do responsável</Typography>
						<TextField label="Nome do responsável" value={newStudent.responsavelNome} onChange={e => setNewStudent({ ...newStudent, responsavelNome: e.target.value })} fullWidth />
						<TextField label="CPF do responsável" value={newStudent.responsavelCPF} onChange={e => setNewStudent({ ...newStudent, responsavelCPF: e.target.value })} fullWidth />
						<TextField label="E-mail" value={newStudent.responsavelEmail} onChange={e => setNewStudent({ ...newStudent, responsavelEmail: e.target.value })} fullWidth />
						<Box display="flex" gap={2}>
							<TextField label="Endereço residencial" value={newStudent.responsavelEndereco} onChange={e => setNewStudent({ ...newStudent, responsavelEndereco: e.target.value })} fullWidth />
							<TextField label="Número" value={newStudent.responsavelNumero} onChange={e => setNewStudent({ ...newStudent, responsavelNumero: e.target.value })} sx={{ maxWidth: 120 }} />
						</Box>
						<TextField label="Data de nascimento do responsável" type="date" InputLabelProps={{ shrink: true }} value={newStudent.responsavelNascimento} onChange={e => setNewStudent({ ...newStudent, responsavelNascimento: e.target.value })} fullWidth />
						<TextField label="Telefone do responsável" value={newStudent.responsavelTelefone} onChange={e => setNewStudent({ ...newStudent, responsavelTelefone: e.target.value })} fullWidth />

						<Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Dados do aluno</Typography>
						<TextField label="Nome do aluno" value={newStudent.alunoNome} onChange={e => setNewStudent({ ...newStudent, alunoNome: e.target.value })} fullWidth />
						<TextField label="Data de nascimento do aluno" type="date" InputLabelProps={{ shrink: true }} value={newStudent.alunoNascimento} onChange={e => setNewStudent({ ...newStudent, alunoNascimento: e.target.value })} fullWidth />
						<TextField label="Turno" select value={newStudent.turno} onChange={e => setNewStudent({ ...newStudent, turno: e.target.value })} fullWidth>
							<MenuItem value="Manhã">Manhã</MenuItem>
							<MenuItem value="Tarde">Tarde</MenuItem>
						</TextField>
						<Box>
							<Typography sx={{ mb: 1 }}>Dias da semana</Typography>
							<Box display="flex" gap={2}>
								{['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(dia => (
									<Button
										key={dia}
										variant={newStudent.diasSemana.includes(dia) ? 'contained' : 'outlined'}
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
					<Button onClick={handleAddStudent} variant="contained">Salvar</Button>
				</DialogActions>
			</Dialog>
			</Box>

			<Box display="flex" gap={2} mb={2}>
				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel id="idade-label">Idade</InputLabel>
					<Select
						labelId="idade-label"
						multiple
						value={idades}
						onChange={e => setIdades(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
						renderValue={(selected) => selected.length === 0 ? 'Todas' : selected.join(', ')}
						label="Idade"
					>
						{[...new Set(students.map(s => s.idade))].map(age => (
							<MenuItem key={age} value={age}>
								<Checkbox checked={idades.indexOf(age) > -1} />
								<ListItemText primary={age} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					label="Turno"
					variant="outlined"
					value={turno}
					onChange={e => setTurno(e.target.value)}
					sx={{ width: 140 }}
					select
				>
					<MenuItem value="">Todos</MenuItem>
					{[...new Set(students.map(s => s.turno))].map(t => (
						<MenuItem key={t} value={t}>{t}</MenuItem>
					))}
				</TextField>
				<TextField
					label="Módulo"
					variant="outlined"
					value={modulo}
					onChange={e => setModulo(e.target.value)}
					sx={{ width: 120 }}
					select
				>
					<MenuItem value="">Todos</MenuItem>
					{[...new Set(students.map(s => s.modulo))].map(m => (
						<MenuItem key={m} value={m}>{m}</MenuItem>
					))}
				</TextField>
			</Box>

			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={filteredStudents}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					pagination
					disableSelectionOnClick
					onRowClick={handleRowClick}
					autoHeight
					sx={{
						'.MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within': {
							outline: 'none',
							backgroundColor: 'inherit',
						},
						'.MuiDataGrid-row.Mui-selected': {
							backgroundColor: 'inherit !important',
						},
						'.MuiDataGrid-cell[data-field="name"]:hover': {
							cursor: 'pointer',
							textDecoration: 'underline',
						},
					}}
					disableColumnSelector
					disableColumnFilter
					localeText={{
						// Ordenação
						columnMenuSortAsc: 'Ordenar crescente',
						columnMenuSortDesc: 'Ordenar decrescente',
						// Outros textos principais
						noRowsLabel: 'Nenhum aluno encontrado',
						footerRowSelected: (count) => count !== 1 ? `${count.toLocaleString()} linhas selecionadas` : '1 linha selecionada',
						footerTotalRows: 'Total de linhas:',
						// Paginação
						toolbarExport: 'Exportar',
						toolbarExportCSV: 'Download CSV',
						toolbarExportPrint: 'Imprimir',
						// ...adicione outras traduções conforme necessário
					}}
				/>
			</Box>

			<Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
				<DialogTitle>Detalhes do Aluno</DialogTitle>
				<DialogContent>
					{selectedStudent && (
						<>
							<Typography variant="h6">{selectedStudent.name}</Typography>
							<Typography>Idade: {selectedStudent.idade} anos</Typography>
							<Typography>Turno: {selectedStudent.turno}</Typography>
							<Typography>Módulo: {selectedStudent.modulo}</Typography>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal}>Fechar</Button>
					{/* Adicione outros botões de ação aqui */}
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default StudentsModule;

