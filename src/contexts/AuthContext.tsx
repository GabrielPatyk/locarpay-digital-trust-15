
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para mapear dados do Supabase para nosso tipo User
const mapSupabaseUserToUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    // Buscar dados do perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        email: profile.email || supabaseUser.email || '',
        name: profile.nome_completo || supabaseUser.email?.split('@')[0] || '',
        type: profile.tipo_usuario,
        fullName: profile.nome_completo || '',
        firstLogin: false,
        contractAccepted: true
      };
    }
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
  }

  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const mappedUser = await mapSupabaseUserToUser(session.user);
        setUser(mappedUser);
      }
      
      setLoading(false);
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const mappedUser = await mapSupabaseUserToUser(session.user);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error);
        return { success: false };
      }

      if (data.user) {
        const mappedUser = await mapSupabaseUserToUser(data.user);
        if (mappedUser) {
          setUser(mappedUser);
          
          // Define redirect path based on user type
          const redirectPaths = {
            inquilino: '/inquilino',
            imobiliaria: '/imobiliaria',
            analista: '/analista',
            juridico: '/juridico',
            sdr: '/sdr',
            executivo: '/executivo',
            financeiro: '/financeiro',
            admin: '/dashboard'
          };
          
          return { 
            success: true, 
            redirectPath: redirectPaths[mappedUser.type] 
          };
        }
      }

      return { success: false };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isAuthenticated = !!user && !loading;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated, loading }}>
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
