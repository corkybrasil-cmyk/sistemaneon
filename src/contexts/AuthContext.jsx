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
      
      // Simular login para desenvolvimento
      if (email === 'admin@escola.com' && password === 'admin123') {
        const userData = {
          id: 1,
          name: 'Administrador',
          email: email,
          role: 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        return { success: true };
      } else {
        return { success: false, error: 'Email ou senha incorretos' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
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
