import React from 'react';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

// Sidebar MUI customizado
const pages = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Alunos', path: '/alunos' },
  { label: 'Professores', path: '/professores' },
  { label: 'Responsáveis', path: '/responsaveis' },
  { label: 'Chamada', path: '/chamada' },
  { label: 'Notas', path: '/notas' },
  { label: 'Financeiro', path: '/financeiro' },
  { label: 'Turmas', path: '/turmas' },
  { label: 'Horários', path: '/horarios' },
  { label: 'Comunicação', path: '/comunicacao' },
  { label: 'Relatórios', path: '/relatorios' },
  { label: 'Configurações', path: '/configuracoes' },
  { label: 'Ocorrências', path: '/ocorrencias' },
  { label: 'Contas a Pagar', path: '/contas-a-pagar' },
  { label: 'WhatsApp', path: '/whatsapp' },
  { label: 'Usuários', path: '/usuarios' },
];

const Sidebar = () => {
  return (
    <div
      style={{
        width: 240,
        background: '#263238',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 32,
        height: '100vh',
      }}
    >
      {pages.map(page => (
        <Link
          key={page.path}
          to={page.path}
          style={{ color: '#fff', textDecoration: 'none', marginBottom: 12, fontSize: 16, width: '100%', textAlign: 'center', display: 'block', padding: '8px 0', borderRadius: 4 }}
        >
          {page.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
