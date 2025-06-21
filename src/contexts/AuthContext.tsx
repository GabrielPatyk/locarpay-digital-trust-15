
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  nome_completo: string | null;
  tipo_usuario: 'inquilino' | 'analista' | 'juridico' | 'admin' | 'sdr' | 'executivo' | 'imobiliaria' | 'financeiro' | null;
  documento: string | null;
  telefone: string | null;
  data_nascimento: string | null;
  criado_em: string;
}

interface AuthContextType {
  user: User | null;
  perfil_usuario: Profile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  updateProfile: (profile: Profile) => void;
  isAuthenticated: boolean;
  isLoadingProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [perfil_usuario, setPerfilUsuario] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    console.log('Buscando perfil para usuário:', userId);
    setIsLoadingProfile(true);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      console.log('Perfil encontrado:', profile);
      setPerfilUsuario(profile);
      
      // Update user type based on profile
      if (profile && profile.tipo_usuario) {
        setUser(prevUser => {
          if (prevUser) {
            const updatedUser = { ...prevUser, type: profile.tipo_usuario };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
          }
          return prevUser;
        });
      }
      
      return profile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão existente:', session);
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email || '',
          type: 'inquilino', // Default, será atualizado pelo perfil
          fullName: '',
          firstLogin: false,
          contractAccepted: true
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Fetch profile after setting user
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email || '',
          type: 'inquilino', // Default, será atualizado pelo perfil
          fullName: '',
          firstLogin: false,
          contractAccepted: true
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Fetch profile after auth change
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        console.log('Usuário deslogado');
        setUser(null);
        setPerfilUsuario(null);
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    console.log('Tentando fazer login com:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Resultado do login:', { data, error });

      if (error) {
        console.error('Erro no login:', error);
        return { success: false };
      }

      if (data.user) {
        console.log('Login bem-sucedido para:', data.user.email);
        return { success: true, redirectPath: '/dashboard' };
      }

      return { success: false };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return { success: false };
    }
  };

  const logout = async () => {
    console.log('Fazendo logout');
    await supabase.auth.signOut();
    setUser(null);
    setPerfilUsuario(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updateProfile = (profile: Profile) => {
    setPerfilUsuario(profile);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      perfil_usuario, 
      login, 
      logout, 
      updateUser, 
      updateProfile, 
      isAuthenticated, 
      isLoadingProfile 
    }}>
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
