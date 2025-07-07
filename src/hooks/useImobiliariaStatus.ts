
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ImobiliariaStatus {
  emailVerificado: boolean;
  contratoAssinado: boolean;
}

export const useImobiliariaStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<ImobiliariaStatus>({
    emailVerificado: false,
    contratoAssinado: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.type !== 'imobiliaria') {
      setIsLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        // Buscar status do contrato
        const { data: contrato } = await supabase
          .from('contratos_locarpay')
          .select('status')
          .eq('imobiliaria_id', user.id)
          .single();

        setStatus({
          emailVerificado: user.verificado || false,
          contratoAssinado: contrato?.status === 'assinado'
        });
      } catch (error) {
        console.error('Erro ao buscar status da imobiliária:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [user]);

  return { status, isLoading };
};
