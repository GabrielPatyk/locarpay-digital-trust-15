
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useContratoStatus = () => {
  const { user } = useAuth();
  const [contratoAssinado, setContratoAssinado] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const verificarStatusContrato = async () => {
    if (!user || user.type !== 'imobiliaria') {
      setContratoAssinado(null);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('contratos_locarpay')
        .select('assinado')
        .eq('id_imobiliaria', user.id)
        .eq('modelo_contrato', 'imobiliaria_locarpay')
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar status do contrato:', error);
        setContratoAssinado(null);
        return;
      }

      setContratoAssinado(data?.assinado || false);
    } catch (err) {
      console.error('Erro ao verificar status do contrato:', err);
      setContratoAssinado(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarStatusContrato();
  }, [user]);

  return {
    contratoAssinado,
    loading,
    refetch: verificarStatusContrato
  };
};
