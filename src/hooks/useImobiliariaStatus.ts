
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useImobiliariaStatus = () => {
  const { user } = useAuth();

  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ['imobiliaria-status', user?.id],
    queryFn: async () => {
      if (!user?.id || user?.type !== 'imobiliaria') {
        return { emailVerificado: false, contratoAssinado: false };
      }

      try {
        // Buscar dados do usuário para verificação de email
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('verificado')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Erro ao buscar dados do usuário:', userError);
          throw userError;
        }

        // Buscar dados do contrato
        const { data: contratoData, error: contratoError } = await supabase
          .from('contratos_locarpay')
          .select('status')
          .eq('imobiliaria_id', user.id)
          .eq('status', 'assinado')
          .limit(1);

        if (contratoError) {
          console.error('Erro ao buscar dados do contrato:', contratoError);
          throw contratoError;
        }

        return {
          emailVerificado: userData?.verificado || false,
          contratoAssinado: contratoData && contratoData.length > 0
        };
      } catch (error) {
        console.error('Erro ao buscar status da imobiliária:', error);
        return { emailVerificado: false, contratoAssinado: false };
      }
    },
    enabled: !!user?.id && user?.type === 'imobiliaria'
  });

  return {
    status: status || { emailVerificado: false, contratoAssinado: false },
    isLoading,
    refetch
  };
};
