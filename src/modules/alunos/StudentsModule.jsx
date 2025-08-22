import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const mockStudents = [
	{ id: 1, name: 'João Silva', email: 'joao@email.com', turma: 'A' },
	{ id: 2, name: 'Maria Santos', email: 'maria@email.com', turma: 'B' },
	{ id: 3, name: 'Pedro Costa', email: 'pedro@email.com', turma: 'A' },
];

const columns = [
	{ field: 'name', headerName: 'Nome', flex: 1 },
	{ field: 'email', headerName: 'Email', flex: 1 },
	{ field: 'turma', headerName: 'Turma', flex: 1 },
];

const StudentsModule = () => {
	const [students, setStudents] = useState(mockStudents);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	const handleRowClick = (params) => {
		setSelectedStudent(params.row);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedStudent(null);
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
					Gestão de Alunos
				</Typography>
				<Button variant="contained" onClick={() => alert('Matricular novo aluno')}>Matricular novo aluno</Button>
			</Box>

			<Box sx={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={students}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					pagination
					disableSelectionOnClick
					onRowClick={handleRowClick}
					autoHeight
				/>
			</Box>

			<Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
				<DialogTitle>Detalhes do Aluno</DialogTitle>
				<DialogContent>
					{selectedStudent && (
						<>
							<Typography variant="h6">{selectedStudent.name}</Typography>
							<Typography>Email: {selectedStudent.email}</Typography>
							<Typography>Turma: {selectedStudent.turma}</Typography>
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

