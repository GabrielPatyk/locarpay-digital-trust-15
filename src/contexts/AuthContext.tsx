
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserType } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string; needsVerification?: boolean; userName?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string; needsVerification?: boolean; userName?: string }> => {
    try {
      setIsLoading(true);
      
      console.log('Tentativa de login para:', email);
      
      // Usar a função do Supabase para validar login (agora inclui verificado)
      const { data, error } = await supabase.rpc('validar_login', {
        email_input: email,
        senha_input: password
      });

      if (error) {
        console.error('Erro na validação do login:', error);
        return { success: false };
      }

      if (!data || data.length === 0) {
        console.log('Nenhum usuário encontrado ou credenciais inválidas');
        return { success: false };
      }

      const userData = data[0];
      console.log('Dados do usuário retornados:', userData);

      // Verificar se o e-mail foi verificado
      if (!userData.verificado) {
        console.log('E-mail não verificado para:', email);
        return { 
          success: false, 
          needsVerification: true,
          userName: userData.nome
        };
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.nome,
        type: userData.cargo as UserType,
        telefone: userData.telefone,
        ativo: userData.ativo,
        verificado: userData.verificado
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Define redirect path based on user type
      const redirectPaths: Record<string, string> = {
        inquilino: '/inquilino',
        imobiliaria: '/imobiliaria',
        analista: '/analista',
        juridico: '/juridico',
        sdr: '/sdr',
        executivo: '/executivo',
        financeiro: '/financeiro',
        admin: '/admin'
      };
      
      return { 
        success: true, 
        redirectPath: redirectPaths[user.type] || '/dashboard'
      };
    } catch (err) {
      console.error('Erro no login:', err);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
