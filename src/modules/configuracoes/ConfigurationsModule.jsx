import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useConfig } from '../../contexts/ConfigContext';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`config-tabpanel-${index}`}
    aria-labelledby={`config-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ConfigurationsModule = () => {
  const { apiKeys, updateApiKey, loading } = useConfig();
  const [activeTab, setActiveTab] = useState(0);
  const [showPasswords, setShowPasswords] = useState({});
  const [localKeys, setLocalKeys] = useState({});
  const [saveStatus, setSaveStatus] = useState({});

  useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const togglePasswordVisibility = (service, field) => {
    setShowPasswords(prev => ({
      ...prev,
      [`${service}_${field}`]: !prev[`${service}_${field}`]
    }));
  };

  const handleInputChange = (service, field, value) => {
    setLocalKeys(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const handleSave = async (service) => {
    try {
      setSaveStatus(prev => ({ ...prev, [service]: 'saving' }));
      
      for (const [key, value] of Object.entries(localKeys[service] || {})) {
        await updateApiKey(service, key, value);
      }
      
      setSaveStatus(prev => ({ ...prev, [service]: 'success' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [service]: null }));
      }, 3000);
    } catch (error) {
      setSaveStatus(prev => ({ ...prev, [service]: 'error' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [service]: null }));
      }, 3000);
    }
  };

  const renderConfigCard = (title, service, fields, description) => (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={title}
        subheader={description}
        action={
          <Button
            variant="contained"
            startIcon={saveStatus[service] === 'saving' ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={() => handleSave(service)}
            disabled={saveStatus[service] === 'saving'}
          >
            Salvar
          </Button>
        }
      />
      <CardContent>
        {saveStatus[service] === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Configurações salvas com sucesso!
          </Alert>
        )}
        {saveStatus[service] === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Erro ao salvar configurações. Tente novamente.
          </Alert>
        )}
        
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} md={field.fullWidth ? 12 : 6} key={field.key}>
              <TextField
                fullWidth
                label={field.label}
                placeholder={field.placeholder}
                type={
                  field.type === 'password' && !showPasswords[`${service}_${field.key}`]
                    ? 'password'
                    : 'text'
                }
                value={localKeys[service]?.[field.key] || ''}
                onChange={(e) => handleInputChange(service, field.key, e.target.value)}
                helperText={field.helperText}
                InputProps={field.type === 'password' ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility(service, field.key)}
                        edge="end"
                      >
                        {showPasswords[`${service}_${field.key}`] ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                } : undefined}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Configurações do Sistema
      </Typography>
      
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        Configure as chaves de API e integrações externas do sistema
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="configurações">
          <Tab label="Appwrite" />
          <Tab label="WhatsApp" />
          <Tab label="OpenAI" />
          <Tab label="Geral" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {renderConfigCard(
            'Configurações do Appwrite',
            'appwrite',
            [
              {
                key: 'endpoint',
                label: 'Endpoint',
                placeholder: 'https://cloud.appwrite.io/v1',
                helperText: 'URL do servidor Appwrite',
                fullWidth: true
              },
              {
                key: 'projectId',
                label: 'Project ID',
                placeholder: 'seu-project-id',
                helperText: 'ID do projeto no Appwrite'
              },
              {
                key: 'databaseId',
                label: 'Database ID',
                placeholder: 'seu-database-id',
                helperText: 'ID do banco de dados'
              }
            ],
            'Configure a conexão com o banco de dados Appwrite'
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {renderConfigCard(
            'Configurações do WhatsApp Business',
            'whatsapp',
            [
              {
                key: 'token',
                label: 'Access Token',
                placeholder: 'EAAxxxxxxxxxxxxx',
                type: 'password',
                helperText: 'Token de acesso do WhatsApp Business API',
                fullWidth: true
              },
              {
                key: 'phoneNumberId',
                label: 'Phone Number ID',
                placeholder: '1234567890',
                helperText: 'ID do número de telefone configurado'
              }
            ],
            'Configure a integração com WhatsApp Business API para envio de mensagens automáticas'
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {renderConfigCard(
            'Configurações do OpenAI',
            'openai',
            [
              {
                key: 'apiKey',
                label: 'API Key',
                placeholder: 'sk-xxxxxxxxxxxxxxxx',
                type: 'password',
                helperText: 'Chave de API do OpenAI para funcionalidades de IA',
                fullWidth: true
              }
            ],
            'Configure a chave de API do OpenAI para funcionalidades de inteligência artificial'
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Card>
            <CardHeader
              title="Configurações Gerais"
              subheader="Configurações globais do sistema"
            />
            <CardContent>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Segurança das Chaves:</strong><br />
                  • Todas as chaves de API são criptografadas antes de serem armazenadas<br />
                  • As chaves são processadas pelo backend para maior segurança<br />
                  • Nunca exponha chaves sensíveis no frontend<br />
                  • Use variáveis de ambiente para configurações de produção
                </Typography>
              </Alert>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Status das Integrações
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Appwrite
                      </Typography>
                      <Typography variant="h6" color={localKeys.appwrite?.endpoint ? 'success.main' : 'error.main'}>
                        {localKeys.appwrite?.endpoint ? 'Configurado' : 'Não Configurado'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        WhatsApp
                      </Typography>
                      <Typography variant="h6" color={localKeys.whatsapp?.token ? 'success.main' : 'error.main'}>
                        {localKeys.whatsapp?.token ? 'Configurado' : 'Não Configurado'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        OpenAI
                      </Typography>
                      <Typography variant="h6" color={localKeys.openai?.apiKey ? 'success.main' : 'error.main'}>
                        {localKeys.openai?.apiKey ? 'Configurado' : 'Não Configurado'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ConfigurationsModule;
