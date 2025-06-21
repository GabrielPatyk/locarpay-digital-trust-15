
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Primeiro, tentar buscar o perfil existente
      const { data: existingProfile, error: fetchError } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao buscar perfil:', fetchError);
        return;
      }

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Se não existe, criar um novo perfil
        const { data: newProfile, error: createError } = await supabase
          .from('perfil_usuario')
          .insert([{ usuario_id: user.id }])
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar perfil:', createError);
          return;
        }

        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id || !profile) return false;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('perfil_usuario')
        .update(updates)
        .eq('usuario_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar o perfil.",
          variant: "destructive",
        });
        return false;
      }

      setProfile(data);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updates: { nome?: string; email?: string; telefone?: string }) => {
    if (!user?.id) return false;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar os dados pessoais.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Dados atualizados!",
        description: "Suas informações pessoais foram salvas com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.email) return false;

    try {
      setLoading(true);

      // Primeiro, verificar a senha atual
      const { data: validationData, error: validationError } = await supabase.rpc('validar_login', {
        email_input: user.email,
        senha_input: currentPassword
      });

      if (validationError || !validationData || validationData.length === 0) {
        toast({
          title: "Senha incorreta",
          description: "A senha atual está incorreta.",
          variant: "destructive",
        });
        return false;
      }

      // Se a senha atual está correta, hash da nova senha e atualizar
      const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
        password: newPassword
      });

      if (hashError || !hashedPassword) {
        console.error('Erro ao gerar hash da senha:', hashError);
        toast({
          title: "Erro interno",
          description: "Não foi possível processar a nova senha.",
          variant: "destructive",
        });
        return false;
      }

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ senha: hashedPassword })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar senha:', updateError);
        toast({
          title: "Erro ao alterar senha",
          description: "Não foi possível alterar a senha.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  return {
    profile,
    loading,
    updateProfile,
    updateUserData,
    updatePassword,
    reloadProfile: loadProfile
  };
};
