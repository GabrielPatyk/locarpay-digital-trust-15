
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

interface ContratoPendente {
  id: string;
  id_imobiliaria: string;
  id_executivo: string;
  criado_por: string;
  data_criacao: string;
  modelo_contrato: string;
  link_assinatura: string | null;
  arquivo_download: string | null;
  assinado: boolean;
  dados_contrato: any;
}

export const useContratoPendente = (user: User | null) => {
  const [contratoPendente, setContratoPendente] = useState<ContratoPendente | null>(null);
  const [loading, setLoading] = useState(false);

  const verificarContratoPendente = async () => {
    if (!user || user.type !== 'imobiliaria') {
      console.log('User is not imobiliaria or is null:', user);
      setContratoPendente(null);
      return;
    }

    try {
      setLoading(true);
      console.log('Checking contract for user:', user.id);
      
      const { data, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .eq('id_imobiliaria', user.id)
        .eq('modelo_contrato', 'imobiliaria_locarpay')
        .eq('assinado', false)
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar contrato pendente:', error);
        return;
      }

      console.log('Contract data found:', data);
      setContratoPendente(data || null);
    } catch (err) {
      console.error('Erro ao verificar contrato pendente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useContratoPendente effect triggered, user:', user);
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
