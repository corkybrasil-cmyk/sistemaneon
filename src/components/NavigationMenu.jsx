import ProfileMenu from './ProfileMenu';
import React from 'react';
import brand from '../assets/brand.json';
import logo from '../assets/logo.svg';
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Box, Button, Tooltip, Fade } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useLocation, useNavigate } from 'react-router-dom';

const categories = [
  {
    label: 'Administrativo',
    pages: [
      { label: 'Alunos', path: '/alunos' },
      { label: 'Responsáveis', path: '/responsaveis' },
    ],
  },
  {
    label: 'Financeiro',
    pages: [
      { label: 'Financeiro', path: '/financeiro' },
      { label: 'Contas a Pagar', path: '/contas-a-pagar' },
    ],
  },
  {
    label: 'Pedagógico',
    pages: [
      { label: 'Chamada', path: '/chamada' },
      { label: 'Notas', path: '/notas' },
      { label: 'Turmas', path: '/turmas' },
      { label: 'Horários', path: '/horarios' },
      { label: 'Ocorrências', path: '/ocorrencias' },
    ],
  },
  {
    label: 'Outros',
    pages: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Professores', path: '/professores' },
      { label: 'Comunicação', path: '/comunicacao' },
      { label: 'Relatórios', path: '/relatorios' },
      { label: 'Configurações', path: '/configuracoes' },
      { label: 'WhatsApp', path: '/whatsapp' },
      { label: 'Usuários', path: '/usuarios' },
    ],
  },
];

export default function NavigationMenu() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = React.useState(null);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [tooltipCategory, setTooltipCategory] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  // Tooltip timer
  const tooltipTimerRef = React.useRef();
  const handleCategoryMouseEnter = (categoryLabel) => {
    setHoveredCategory(categoryLabel);
    tooltipTimerRef.current = setTimeout(() => {
      setTooltipOpen(true);
      setTooltipCategory(categoryLabel);
    }, 2000);
  };
  const handleCategoryMouseLeave = () => {
    setHoveredCategory(null);
    setTooltipOpen(false);
    setTooltipCategory(null);
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
  };
  const handleCategoryClick = (categoryLabel) => {
    setSelectedCategory(selectedCategory === categoryLabel ? null : categoryLabel);
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ boxShadow: 0, background: `linear-gradient(90deg, ${brand.corPrincipal} 80%, ${brand.corSecundaria} 100%)` }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={logo} alt="Logo Neon" style={{ height: 46 }} />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>
  <Box sx={{ background: `linear-gradient(90deg, ${brand.corPrincipal} 80%, ${brand.corSecundaria} 100%)`, borderBottom: 1, borderColor: brand.corSecundaria, width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {categories.map(category => (
              <Box key={category.label} sx={{ position: 'relative' }}>
                <Tooltip
                  title="Clique para ver as páginas nesta categoria"
                  open={tooltipOpen && tooltipCategory === category.label}
                  TransitionComponent={Fade}
                  arrow
                  placement="bottom"
                  disableHoverListener
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
                      width: 'auto',
                      overflow: 'visible',
                    }}
                  >
                    <Button
                      sx={{
                        width: '100%',
                        textTransform: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: 0,
                        minWidth: 0,
                        marginRight: 0,
                        transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                      onMouseEnter={() => handleCategoryMouseEnter(category.label)}
                      onMouseLeave={handleCategoryMouseLeave}
                      onClick={() => handleCategoryClick(category.label)}
                    >
                      <span style={{ marginLeft: 24, color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{category.label}</span>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          width: hoveredCategory === category.label ? 32 : 0,
                          height: 32,
                          verticalAlign: 'middle',
                          transition: 'width 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s, transform 0.2s',
                          opacity: hoveredCategory === category.label ? 1 : 0,
                          transform: hoveredCategory === category.label ? 'translateY(0)' : 'translateY(-8px)',
                        }}
                      >
                        <ArrowDropDownIcon sx={{ fontSize: 32, color: '#fff' }} />
                      </Box>
                    </Button>
                  </Box>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Painel de páginas da categoria clicada */}
      {selectedCategory && (
        <Box sx={{ bgcolor: '#f5f5f5', borderBottom: 1, borderColor: 'divider', width: '100%', py: 1, px: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          {categories.find(cat => cat.label === selectedCategory).pages.map(page => (
            <Button
              key={page.path}
              sx={{ textTransform: 'none' }}
              onClick={() => { navigate(page.path); setSelectedCategory(null); }}
              color={location.pathname.startsWith(page.path) ? 'primary' : 'inherit'}
            >
              {page.label}
            </Button>
          ))}
        </Box>
      )}

      {/* Segunda Tab MUI: painel deslizante */}

    </>
  );
}
