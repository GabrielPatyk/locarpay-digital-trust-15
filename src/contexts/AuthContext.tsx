
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

const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'inquilino@exemplo.com', 
    type: 'inquilino',
    fullName: 'João Silva dos Santos',
    firstLogin: false,
    contractAccepted: true
  },
  { 
    id: '2', 
    name: 'Imobiliária Prime', 
    email: 'imobiliaria@exemplo.com', 
    type: 'imobiliaria',
    companyName: 'Imobiliária Prime Ltda',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    fullName: 'Roberto Silva',
    firstLogin: true,
    contractAccepted: false
  },
  { 
    id: '3', 
    name: 'Ana Costa', 
    email: 'analista@locarpay.com', 
    type: 'analista',
    fullName: 'Ana Costa Oliveira',
    firstLogin: false,
    contractAccepted: true
  },
  { 
    id: '4', 
    name: 'Carlos Mendes', 
    email: 'juridico@locarpay.com', 
    type: 'juridico',
    fullName: 'Carlos Mendes Santos',
    firstLogin: false,
    contractAccepted: true
  },
  { 
    id: '5', 
    name: 'Maria Santos', 
    email: 'sdr@locarpay.com', 
    type: 'sdr',
    fullName: 'Maria Santos Lima',
    firstLogin: false,
    contractAccepted: true
  },
  { 
    id: '6', 
    name: 'Pedro Lima', 
    email: 'executivo@locarpay.com', 
    type: 'executivo',
    fullName: 'Pedro Lima Costa',
    firstLogin: false,
    contractAccepted: true
  },
  { 
    id: '7', 
    name: 'Lucas Oliveira', 
    email: 'financeiro@locarpay.com', 
    type: 'financeiro',
    fullName: 'Lucas Oliveira Santos',
    firstLogin: false,
    contractAccepted: true
  },
  { 
    id: '8', 
    name: 'Admin Sistema', 
    email: 'admin@locarpay.com', 
    type: 'admin',
    fullName: 'Administrador do Sistema',
    firstLogin: false,
    contractAccepted: true
  },
];

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
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    // Try Supabase authentication first
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

    // Fallback to mock users for development
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
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
        redirectPath: redirectPaths[foundUser.type] 
      };
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
