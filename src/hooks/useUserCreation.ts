
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEmailVerification } from './useEmailVerification';

interface CreateUserData {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  telefone?: string;
  cnpj?: string;
}

export const useUserCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { sendVerificationEmail } = useEmailVerification();

  const createUser = async (userData: CreateUserData) => {
    setIsLoading(true);
    try {
      // Para imobiliárias, usar CNPJ como senha padrão
      const senhaParaHash = userData.cargo === 'imobiliaria' && userData.cnpj 
        ? userData.cnpj.replace(/\D/g, '') // Remove caracteres não numéricos
        : userData.senha;

      // Hash da senha
      const { data: hashedPassword, error: hashError } = await supabase.rpc(
        'hash_password',
        { password: senhaParaHash }
      );

      if (hashError) {
        throw new Error('Erro ao processar senha');
      }

      // Criar usuário no banco
      const { data: newUser, error: createError } = await supabase
        .from('usuarios')
        .insert({
          nome: userData.nome,
          email: userData.email,
          senha: hashedPassword,
          cargo: userData.cargo,
          telefone: userData.telefone,
          verificado: false, // Sempre false para novos usuários
          primeiro_acesso: userData.cargo === 'imobiliaria' ? true : false, // TRUE para imobiliárias
        })
        .select()
        .single();

      if (createError) {
        if (createError.code === '23505') {
          throw new Error('E-mail já cadastrado no sistema');
        }
        throw new Error('Erro ao criar usuário');
      }

      // Enviar e-mail de verificação automaticamente
      const emailResult = await sendVerificationEmail(userData.email, userData.nome);
      
      if (emailResult.success) {
        toast({
          title: "Usuário criado com sucesso!",
          description: `E-mail de verificação enviado para ${userData.email}`,
        });
      } else {
        toast({
          title: "Usuário criado",
          description: "Erro ao enviar e-mail de verificação. Tente reenviar manualmente.",
          variant: "destructive",
        });
      }

      return { success: true, user: newUser };
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    isLoading,
  };
};
