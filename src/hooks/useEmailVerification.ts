
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendVerificationEmail = async (email: string, nome: string) => {
    setIsLoading(true);
    try {
      // Primeiro, gerar um novo token para o usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('Usuário não encontrado');
      }

      // Gerar novo token de verificação
      const { data: tokenData, error: tokenError } = await supabase.rpc(
        'gerar_token_verificacao',
        { usuario_id: userData.id }
      );

      if (tokenError) {
        throw new Error('Erro ao gerar token de verificação');
      }

      // Enviar e-mail de verificação
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          email,
          nome,
          token: tokenData,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar e-mail de verificação');
      }

      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para ativar sua conta.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao enviar e-mail de verificação:', error);
      toast({
        title: "Erro ao enviar e-mail",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendVerificationEmail,
    isLoading,
  };
};
