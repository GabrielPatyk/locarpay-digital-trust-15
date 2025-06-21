
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    // Simulate API call
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
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated }}>
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
