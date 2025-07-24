import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContratoFianca {
  id: string;
  fianca_id: string;
  status_contrato: string;
  url_assinatura_inquilino: string | null;
  documentos: string | null;
  data_envio: string | null;
  data_assinatura: string | null;
  created_at: string;
}

export const useContratoFianca = (fiancaId: string) => {
  return useQuery({
    queryKey: ['contrato-fianca', fiancaId],
    queryFn: async () => {
      if (!fiancaId) return null;

      const { data, error } = await supabase
        .from('contratos_fianca')
        .select('*')
        .eq('fianca_id', fiancaId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar contrato da fiança:', error);
        return null;
      }

      return data as ContratoFianca | null;
    },
    enabled: !!fiancaId
  });
};