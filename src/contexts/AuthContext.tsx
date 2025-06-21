
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserType } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    try {
      setIsLoading(true);
      
      // Chamar a função do Supabase para validar login
      const { data, error } = await supabase.rpc('validar_login', {
        email_input: email,
        senha_input: password
      });

      if (error) {
        console.error('Erro na validação:', error);
        return { success: false };
      }

      if (data && data.length > 0) {
        const userData = data[0];
        
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.nome,
          type: userData.cargo as UserType,
          telefone: userData.telefone,
          ativo: userData.ativo
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
          admin: '/dashboard',
          corretor: '/dashboard'
        };
        
        return { 
          success: true, 
          redirectPath: redirectPaths[userData.cargo] || '/dashboard'
        };
      }
      
      return { success: false };
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
