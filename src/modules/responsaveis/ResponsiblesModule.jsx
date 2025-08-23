import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import appwriteService from '../../services/appwriteService';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, TextField } from '@mui/material';

const responsavelFields = [
  { field: 'nome', headerName: 'Nome', flex: 1, hideable: false },
  { field: 'cpf', headerName: 'CPF', flex: 0.7, hideable: true },
  { field: 'email', headerName: 'E-mail', flex: 1, hideable: true },
  { field: 'endereco', headerName: 'Endereço', flex: 1, hideable: true },
  { field: 'numero', headerName: 'Número', flex: 0.5, hideable: true },
  { field: 'nascimento', headerName: 'Nascimento', flex: 0.7, hideable: true },
  { field: 'telefone', headerName: 'Telefone', flex: 0.7, hideable: true },
  // Adicione outros campos conforme necessário
];

const defaultColumnConfig = responsavelFields.map(col => ({ field: col.field, visible: true, width: col.flex * 150 }));

const ResponsiblesModule = () => {
  const [responsaveis, setResponsaveis] = useState([]);
  const [columnConfig, setColumnConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('responsaveisColumnConfig');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultColumnConfig;
  });

  useEffect(() => {
    localStorage.setItem('responsaveisColumnConfig', JSON.stringify(columnConfig));
  }, [columnConfig]);

  useEffect(() => {
    const fetchResponsaveis = async () => {
      try {
        const result = await appwriteService.listDocuments('sistema', 'responsaveis');
        setResponsaveis(result.documents);
      } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
      }
    };
    fetchResponsaveis();
  }, []);

  // Filtros
  const [filterNome, setFilterNome] = useState('');
  const [filterCPF, setFilterCPF] = useState('');
  const [filterEmail, setFilterEmail] = useState('');

  // Filtrar responsáveis
  const responsaveisFiltrados = responsaveis.filter(r => {
    if (filterNome && !r.nome?.toLowerCase().includes(filterNome.toLowerCase())) return false;
    if (filterCPF && !r.cpf?.includes(filterCPF)) return false;
    if (filterEmail && !r.email?.toLowerCase().includes(filterEmail.toLowerCase())) return false;
    return true;
  });

  // Colunas para DataGrid
  const gridColumns = columnConfig
    .filter(col => col.visible)
    .map((col, idx) => {
      const base = responsavelFields.find(f => f.field === col.field);
      return {
        ...base,
        field: col.field,
        headerName: base.headerName,
        width: col.width,
        flex: undefined,
        hideable: base.hideable,
        disableColumnMenu: col.field === 'nome',
        sortable: true,
        resizable: true,
      };
    });

  // Alternar visibilidade de coluna
  const handleToggleColumn = (field) => {
    if (field === 'nome') return;
    setColumnConfig(config => config.map(col => col.field === field ? { ...col, visible: !col.visible } : col));
  };

  // Reordenar colunas (exceto nome)
  const handleMoveColumn = (fromIdx, toIdx) => {
    if (fromIdx === 0 || toIdx === 0) return;
    setColumnConfig(config => {
      const cols = [...config];
      const [moved] = cols.splice(fromIdx, 1);
      cols.splice(toIdx, 0, moved);
      return cols;
    });
  };

  // Redimensionar coluna
  const handleColumnResize = (field, newWidth) => {
    setColumnConfig(config => config.map(col => col.field === field ? { ...col, width: newWidth } : col));
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Gestão de Responsáveis
      </Typography>
      {/* Filtros */}
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Nome" value={filterNome} onChange={e => setFilterNome(e.target.value)} variant="outlined" />
        <TextField label="CPF" value={filterCPF} onChange={e => setFilterCPF(e.target.value)} variant="outlined" />
        <TextField label="E-mail" value={filterEmail} onChange={e => setFilterEmail(e.target.value)} variant="outlined" />
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
            <Typography sx={{ fontWeight: col.field === 'nome' ? 'bold' : 'normal' }}>{responsavelFields.find(f => f.field === col.field)?.headerName || col.field}</Typography>
          </Box>
        ))}
      </Box>
      {/* DataGrid */}
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={responsaveisFiltrados}
          columns={gridColumns}
          getRowId={row => row.$id || row.cpf}
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
            noRowsLabel: 'Nenhum responsável encontrado',
            footerRowSelected: (count) => count !== 1 ? `${count.toLocaleString()} linhas selecionadas` : '1 linha selecionada',
            footerTotalRows: 'Total de linhas:',
            toolbarExport: 'Exportar',
            toolbarExportCSV: 'Download CSV',
            toolbarExportPrint: 'Imprimir',
          }}
        />
      </Box>
    </Box>
  );
};

export default ResponsiblesModule;
