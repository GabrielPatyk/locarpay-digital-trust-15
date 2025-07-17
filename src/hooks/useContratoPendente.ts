
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { Tables } from '@/integrations/supabase/types';

type ContratoPendente = Tables<'contratos_imobiliaria_locarpay'>;

export const useContratoPendente = (user: User | null) => {
  const [contratoPendente, setContratoPendente] = useState<ContratoPendente | null>(null);
  const [loading, setLoading] = useState(false);

  const verificarContratoPendente = async () => {
    if (!user || user.type !== 'imobiliaria') {
      setContratoPendente(null);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('contratos_imobiliaria_locarpay')
        .select('*')
        .eq('id_imobiliaria', user.id)
        .eq('modelo_contrato', 'imobiliaria_locarpay')
        .eq('assinado', false)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar contrato pendente:', error);
        return;
      }

      setContratoPendente(data || null);
    } catch (err) {
      console.error('Erro ao verificar contrato pendente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarContratoPendente();
  }, [user]);

  const atualizarStatusContrato = async () => {
    await verificarContratoPendente();
  };

  return {
    contratoPendente,
    loading,
    atualizarStatusContrato
  };
};
