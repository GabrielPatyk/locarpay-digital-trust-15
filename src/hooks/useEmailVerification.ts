
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
        .eq('email', email);

      if (userError || !userData || userData.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      const user = userData[0];

      // Gerar novo token de verificação
      const { data: tokenData, error: tokenError } = await supabase.rpc(
        'gerar_token_verificacao',
        { usuario_id: user.id }
      );

      if (tokenError) {
        throw new Error('Erro ao gerar token de verificação');
      }

      // Enviar webhook
      const webhookData = {
        email,
        token: tokenData,
        usuario_id: user.id,
        link: `${window.location.origin}/verificar-email?token=${tokenData}`
      };

      await fetch('https://webhook.locarpay.com.br/webhook/Validar-Email-Da-Conta-LocarPay-Webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      toast({
        title: "E-mail enviado!",
        description: "Verificação enviada para seu e-mail. Verifique sua caixa de entrada.",
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
