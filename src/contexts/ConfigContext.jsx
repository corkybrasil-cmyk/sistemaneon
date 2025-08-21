import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [apiKeys, setApiKeys] = useState({
    appwrite: {
      endpoint: '',
      projectId: '',
      databaseId: '',
    },
    whatsapp: {
      token: '',
      phoneNumberId: '',
    },
    openai: {
      apiKey: '',
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      // Carregar configurações do backend (chaves criptografadas)
      const response = await fetch('/api/config');
      if (response.ok) {
        const configs = await response.json();
        setApiKeys(configs);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApiKey = async (service, key, value) => {
    try {
      const updatedKeys = {
        ...apiKeys,
        [service]: {
          ...apiKeys[service],
          [key]: value,
        },
      };

      // Enviar para o backend para armazenamento seguro
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(updatedKeys),
      });

      if (response.ok) {
        setApiKeys(updatedKeys);
        return { success: true };
      } else {
        return { success: false, error: 'Erro ao salvar configuração' };
      }
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const getApiKey = (service, key) => {
    return apiKeys[service]?.[key] || '';
  };

  const value = {
    apiKeys,
    updateApiKey,
    getApiKey,
    loading,
    loadConfigurations,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
