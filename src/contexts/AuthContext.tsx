
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'inquilino' | 'imobiliaria' | 'analista' | 'juridico' | 'sdr' | 'executivo' | 'financeiro' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: '1', name: 'João Silva', email: 'inquilino@exemplo.com', type: 'inquilino' },
  { id: '2', name: 'Imobiliária Prime', email: 'imobiliaria@exemplo.com', type: 'imobiliaria' },
  { id: '3', name: 'Ana Costa', email: 'analista@locarpay.com', type: 'analista' },
  { id: '4', name: 'Carlos Mendes', email: 'juridico@locarpay.com', type: 'juridico' },
  { id: '5', name: 'Maria Santos', email: 'sdr@locarpay.com', type: 'sdr' },
  { id: '6', name: 'Pedro Lima', email: 'executivo@locarpay.com', type: 'executivo' },
  { id: '7', name: 'Lucas Oliveira', email: 'financeiro@locarpay.com', type: 'financeiro' },
  { id: '8', name: 'Admin Sistema', email: 'admin@locarpay.com', type: 'admin' },
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
