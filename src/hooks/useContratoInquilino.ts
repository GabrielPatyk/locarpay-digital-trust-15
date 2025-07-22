import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type StatusContrato = Database['public']['Enums']['status_contrato'];

export interface ContratoInquilino {
  id: string;
  fianca_id: string;
  status_contrato: StatusContrato;
  url_contrato: string | null;
  data_envio: string | null;
  data_assinatura: string | null;
  created_at: string;
}

export const useContratoInquilino = () => {
  const { user } = useAuth();

  const { data: contrato, isLoading, error, refetch } = useQuery({
    queryKey: ['contrato-inquilino', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Primeiro buscar a fiança do inquilino
      const { data: fianca, error: fiancaError } = await supabase
        .from('fiancas_locaticias')
        .select('id')
        .eq('inquilino_usuario_id', user.id)
        .maybeSingle();

      if (fiancaError || !fianca) {
        return null;
      }

      // Depois buscar o contrato vinculado à fiança
      const { data: contratoData, error: contratoError } = await supabase
        .from('contratos_fianca')
        .select(`
          id,
          fianca_id,
          status_contrato,
          url_assinatura_inquilino,
          data_envio,
          data_assinatura,
          created_at
        `)
        .eq('fianca_id', fianca.id)
        .maybeSingle();

      if (contratoError || !contratoData) {
        return null;
      }

      return {
        ...contratoData,
        url_contrato: contratoData.url_assinatura_inquilino
      } as ContratoInquilino;
    },
    enabled: !!user?.id
  });

  const getStatusText = (status: StatusContrato) => {
    switch (status) {
      case 'gerando_link': return 'Gerando Link';
      case 'assinatura_locarpay': return 'Assinatura LocarPay';
      case 'assinatura_inquilino': return 'Aguardando sua Assinatura';
      case 'assinatura_imobiliaria': return 'Aguardando Imobiliária';
      case 'assinado': return 'Assinado';
      default: return status;
    }
  };

  const getStatusColor = (status: StatusContrato) => {
    switch (status) {
      case 'gerando_link': return 'bg-gray-500';
      case 'assinatura_locarpay': return 'bg-blue-500';
      case 'assinatura_inquilino': return 'bg-orange-500';
      case 'assinatura_imobiliaria': return 'bg-yellow-500';
      case 'assinado': return 'bg-success';
      default: return 'bg-gray-500';
    }
  };

  return {
    contrato,
    isLoading,
    error,
    refetch,
    getStatusText,
    getStatusColor
  };
};