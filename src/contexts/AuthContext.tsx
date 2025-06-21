
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserProfile(parsedUser.id);
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Convert supabase user to our User type
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || '',
          type: 'inquilino', // Default type, will be updated from profile
          fullName: session.user.user_metadata?.full_name || '',
          firstLogin: true,
          contractAccepted: false
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setPerfilUsuario(null);
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

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
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (data.user && !error) {
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email || '',
        type: 'inquilino', // Default type, will be updated from profile
        fullName: data.user.user_metadata?.full_name || '',
        firstLogin: true,
        contractAccepted: false
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Fetch profile to check if complete
      await fetchUserProfile(data.user.id);
      
      return { success: true, redirectPath: '/dashboard' };
    }

    return { success: false };
  };

  const logout = async () => {
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
