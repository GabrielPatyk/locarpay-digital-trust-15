
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserType } from '@/types/user';
import { useContratoPendente } from '@/hooks/useContratoPendente';
import ContractModal from '@/components/ContractModal';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string; needsVerification?: boolean; userName?: string; isInactive?: boolean }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  contratoPendente: any;
  atualizarStatusContrato: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContractModal, setShowContractModal] = useState(false);
  
  const { contratoPendente, atualizarStatusContrato } = useContratoPendente(user);

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

  // Mostrar modal de contrato se necessário
  useEffect(() => {
    if (user?.type === 'imobiliaria' && contratoPendente && !contratoPendente.assinado) {
      setShowContractModal(true);
    } else {
      setShowContractModal(false);
    }
  }, [user, contratoPendente]);

  const handleContractAccept = () => {
    if (contratoPendente?.link_assinatura) {
      // Redirecionar para o link de assinatura
      window.open(contratoPendente.link_assinatura, '_blank');
    } else {
      // Mostrar mensagem que o link ainda não está disponível
      alert('O link para assinatura ainda não está disponível. Tente novamente mais tarde.');
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string; needsVerification?: boolean; userName?: string; isInactive?: boolean }> => {
    try {
      setIsLoading(true);
      
      console.log('Tentativa de login para:', email);
      
      // Primeiro, verificar se o usuário existe e está ativo
      const { data: userCheck, error: userCheckError } = await supabase
        .from('usuarios')
        .select('ativo, verificado, nome')
        .eq('email', email)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        console.error('Erro ao verificar usuário:', userCheckError);
        return { success: false };
      }

      if (!userCheck) {
        console.log('Usuário não encontrado');
        return { success: false };
      }

      // Verificar se a conta está ativa
      if (!userCheck.ativo) {
        console.log('Conta inativa para:', email);
        return { 
          success: false, 
          isInactive: true
        };
      }

      // Usar a função do Supabase para validar login
      const { data, error } = await supabase.rpc('validar_login', {
        email_input: email,
        senha_input: password
      });

      if (error) {
        console.error('Erro na validação do login:', error);
        return { success: false };
      }

      if (!data || data.length === 0) {
        console.log('Credenciais inválidas');
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

      // Buscar dados adicionais do usuário incluindo imagem_perfil
      const { data: fullUserData, error: fullUserError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userData.id)
        .single();

      if (fullUserError) {
        console.error('Erro ao buscar dados completos do usuário:', fullUserError);
        return { success: false };
      }

      const user: User = {
        id: fullUserData.id,
        email: fullUserData.email,
        name: fullUserData.nome,
        type: fullUserData.cargo as UserType,
        telefone: fullUserData.telefone,
        ativo: fullUserData.ativo,
        verificado: fullUserData.verificado,
        imagem_perfil: fullUserData.imagem_perfil,
        criado_por: fullUserData.criado_por
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

  const logout = async () => {
    try {
      // Invalidar sessão do Supabase se existir
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout do Supabase:', error);
    } finally {
      // Limpar estado local independentemente de erros
      setUser(null);
      localStorage.removeItem('user');
      
      // Redirecionar para login
      window.location.href = '/login';
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser, 
      isAuthenticated, 
      isLoading,
      contratoPendente,
      atualizarStatusContrato
    }}>
      {children}
      
      {/* Modal de contrato que bloqueia o acesso */}
      {showContractModal && user && (
        <ContractModal
          isOpen={showContractModal}
          user={user}
          onAccept={handleContractAccept}
        />
      )}
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
