import appwriteService from '../services/appwriteService';
// Inicializa AppwriteService se necessário
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'neoneducacional';
if (!appwriteService.initialized) {
  appwriteService.initialize(APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID);
}
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de autenticação
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simular usuário logado para desenvolvimento
          setUser({ 
            id: 1, 
            name: 'Administrador', 
            email: 'admin@neoneducacional.com',
            role: 'admin'
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simular delay de verificação
    setTimeout(checkAuth, 500);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('[LOGIN] email enviado:', email);
      console.log('[LOGIN] senha enviada:', password);
      const session = await appwriteService.login(email, password);
      console.log('[LOGIN] session recebida:', session);
      const account = await appwriteService.getCurrentUser();
      console.log('[LOGIN] dados do usuário:', account);
      setUser({
        id: account.$id,
        name: account.name,
        email: account.email,
        role: account.role || 'user',
        photoUrl: account.photoUrl || null,
      });
      localStorage.setItem('authToken', session.$id);
      return { success: true };
    } catch (error) {
      console.error('[LOGIN] Erro no login:', error);
      if (error && error.message) {
        console.log('[LOGIN] Mensagem de erro:', error.message);
      }
      return { success: false, error: error.message || 'Email ou senha incorretos' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
