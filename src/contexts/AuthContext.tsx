
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserType } from '@/types/user';
import type { Session } from '@supabase/supabase-js';

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

  // Função para buscar dados do usuário da tabela usuarios
  const fetchUserData = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.nome,
        type: data.cargo as UserType,
        telefone: data.telefone,
        ativo: data.ativo
      };
    } catch (err) {
      console.error('Erro inesperado ao buscar usuário:', err);
      return null;
    }
  };

  useEffect(() => {
    // Verificar sessão inicial
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
          const userData = await fetchUserData(session.user.email);
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user?.email) {
          const userData = await fetchUserData(session.user.email);
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
        setIsLoading(false);
      }
    );

    initAuth();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    try {
      setIsLoading(true);
      
      // Primeiro, autenticar com o Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Erro na autenticação:', authError);
        return { success: false };
      }

      // Buscar dados do usuário na tabela usuarios
      const userData = await fetchUserData(email);
      
      if (!userData) {
        console.error('Usuário não encontrado na tabela usuarios');
        await supabase.auth.signOut();
        return { success: false };
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Define redirect path based on user type
      const redirectPaths: Record<string, string> = {
        inquilino: '/inquilino',
        imobiliaria: '/imobiliaria',
        analista: '/analista',
        juridico: '/juridico',
        sdr: '/sdr',
        executivo: '/executivo',
        financeiro: '/financeiro',
        admin: '/admin',
        corretor: '/dashboard'
      };
      
      return { 
        success: true, 
        redirectPath: redirectPaths[userData.type] || '/dashboard'
      };
    } catch (err) {
      console.error('Erro no login:', err);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
