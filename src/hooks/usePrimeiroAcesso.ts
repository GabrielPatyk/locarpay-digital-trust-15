import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePrimeiroAcesso = () => {
  const [isPrimeiroAcesso, setIsPrimeiroAcesso] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const verificarPrimeiroAcesso = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('primeiro_acesso, cargo')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar primeiro acesso:', error);
          setIsLoading(false);
          return;
        }

        // Só mostrar modal se for imobiliária e primeiro acesso
        setIsPrimeiroAcesso(data?.primeiro_acesso === true && data?.cargo === 'imobiliaria');
      } catch (error) {
        console.error('Erro ao verificar primeiro acesso:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verificarPrimeiroAcesso();
  }, [user?.id]);

  const disparaWebhookPrimeiroAcesso = async () => {
    if (!user?.id || !user?.email) return;

    try {
      const { data, error } = await supabase.functions.invoke('primeiro-acesso-webhook', {
        body: {
          userId: user.id,
          email: user.email
        }
      });

      if (error) {
        console.error('Erro ao disparar webhook:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao disparar webhook primeiro acesso:', error);
      throw error;
    }
  };

  const marcarPrimeiroAcessoConcluido = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ primeiro_acesso: false })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao marcar primeiro acesso concluído:', error);
        throw error;
      }

      setIsPrimeiroAcesso(false);
    } catch (error) {
      console.error('Erro ao marcar primeiro acesso concluído:', error);
      throw error;
    }
  };

  return {
    isPrimeiroAcesso,
    isLoading,
    disparaWebhookPrimeiroAcesso,
    marcarPrimeiroAcessoConcluido
  };
};