
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserType } from '@/types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: '1', email: 'analista@locarpay.com', name: 'Maria Silva', type: 'analista' },
  { id: '2', email: 'juridico@locarpay.com', name: 'Dr. João Santos', type: 'juridico' },
  { id: '3', email: 'sdr@locarpay.com', name: 'Carlos Oliveira', type: 'sdr' },
  { id: '4', email: 'executivo@locarpay.com', name: 'Ana Costa', type: 'executivo' },
  { 
    id: '5', 
    email: 'imobiliaria@exemplo.com', 
    name: 'Imobiliária Prime', 
    type: 'imobiliaria',
    firstLogin: true,
    contractAccepted: false,
    companyName: 'Imobiliária Prime Ltda',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 456 - Centro, São Paulo/SP',
    fullName: 'Roberto Silva Santos'
  },
  { id: '6', email: 'inquilino@exemplo.com', name: 'Pedro Almeida', type: 'inquilino' },
  { id: '7', email: 'admin@locarpay.com', name: 'Administrador', type: 'admin' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('locarpay_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === '123456') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('locarpay_user', JSON.stringify(foundUser));
      
      // Define redirect path based on user type
      const redirectPath = foundUser.type === 'inquilino' ? '/inquilino' : '/dashboard';
      
      return { success: true, redirectPath };
    }
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('locarpay_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('locarpay_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      updateUser
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
