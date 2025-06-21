
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/user';

export const useSupabaseAuth = () => {
  const createDemoUser = async (
    email: string,
    password: string,
    userData: {
      nome_completo: string;
      tipo_usuario: UserType;
      telefone?: string;
      documento?: string;
    }
  ) => {
    try {
      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_completo: userData.nome_completo
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Criar perfil na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: email,
            nome_completo: userData.nome_completo,
            tipo_usuario: userData.tipo_usuario,
            telefone: userData.telefone,
            documento: userData.documento,
            ativo: true
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          return { success: false, error: profileError.message };
        }

        return { success: true, user: authData.user };
      }

      return { success: false, error: 'Usuário não foi criado' };
    } catch (error) {
      console.error('Erro geral:', error);
      return { success: false, error: 'Erro interno' };
    }
  };

  return { createDemoUser };
};
