import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserType } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string; needsVerification?: boolean; userName?: string; isInactive?: boolean }>;
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

  const verificarEDispararWebhookContrato = async (userId: string, userType: string) => {
    // Só executa para imobiliárias
    if (userType !== 'imobiliaria') return;

    try {
      // Verificar se há contratos pendentes para esta imobiliária
      const { data: contratosPendentes, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .eq('imobiliaria_id', userId)
        .eq('status', 'pendente');

      if (error) {
        console.error('Erro ao verificar contratos pendentes:', error);
        return;
      }

      // Se há contratos pendentes, buscar dados completos da imobiliária e disparar webhook
      if (contratosPendentes && contratosPendentes.length > 0) {
        const { data: dadosImobiliaria, error: errorDados } = await supabase
          .from('usuarios')
          .select(`
            *,
            perfil_usuario (*)
          `)
          .eq('id', userId)
          .single();

        if (errorDados || !dadosImobiliaria) {
          console.error('Erro ao buscar dados da imobiliária:', errorDados);
          return;
        }

        // Preparar payload com todos os dados da imobiliária
        const webhookPayload = {
          id: dadosImobiliaria.id,
          nome: dadosImobiliaria.nome,
          email: dadosImobiliaria.email,
          telefone: dadosImobiliaria.telefone,
          cargo: dadosImobiliaria.cargo,
          cpf: dadosImobiliaria.cpf,
          ativo: dadosImobiliaria.ativo,
          verificado: dadosImobiliaria.verificado,
          primeiro_acesso: dadosImobiliaria.primeiro_acesso,
          criado_em: dadosImobiliaria.criado_em,
          // Dados do perfil se existir
          perfil: dadosImobiliaria.perfil_usuario ? {
            cnpj: dadosImobiliaria.perfil_usuario.cnpj,
            nome_empresa: dadosImobiliaria.perfil_usuario.nome_empresa,
            endereco: dadosImobiliaria.perfil_usuario.endereco,
            numero: dadosImobiliaria.perfil_usuario.numero,
            complemento: dadosImobiliaria.perfil_usuario.complemento,
            bairro: dadosImobiliaria.perfil_usuario.bairro,
            cidade: dadosImobiliaria.perfil_usuario.cidade,
            estado: dadosImobiliaria.perfil_usuario.estado,
            pais: dadosImobiliaria.perfil_usuario.pais
          } : null,
          // Informações sobre os contratos pendentes
          contratos_pendentes: contratosPendentes.length,
          timestamp: new Date().toISOString()
        };

        // Disparar webhook
        try {
          const response = await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
          });

          if (response.ok) {
            console.log('Webhook de contrato pendente disparado com sucesso para imobiliária:', dadosImobiliaria.nome);
          } else {
            console.error('Erro ao disparar webhook de contrato pendente:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Erro na requisição do webhook de contrato pendente:', error);
        }
      }
    } catch (error) {
      console.error('Erro na verificação de contratos pendentes:', error);
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

      // Verificar e disparar webhook para contratos pendentes (apenas para imobiliárias)
      await verificarEDispararWebhookContrato(user.id, user.type);
      
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
