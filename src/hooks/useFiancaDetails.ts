
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HistoricoItem {
  id: string;
  acao: string;
  usuario_nome: string;
  detalhes: string | null;
  data_criacao: string;
  analisado_por_usuario?: {
    nome: string;
  } | null;
}

export const useFiancaDetails = (fiancaId: string) => {
  const { data: fianca, isLoading: isLoadingFianca } = useQuery({
    queryKey: ['fianca', fiancaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          *,
        usuarios!fiancas_locaticias_id_imobiliaria_fkey(
          id,
          nome,
          email,
          telefone
        )
        `)
        .eq('id', fiancaId)
        .single();

      if (error) {
        console.error('Erro ao buscar fiança:', error);
        throw error;
      }
      return data;
    },
    enabled: !!fiancaId
  });

  const { data: historico = [], isLoading: isLoadingHistorico } = useQuery({
    queryKey: ['historico', fiancaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('historico_fiancas')
        .select(`
          *,
          analisado_por_usuario:usuarios!historico_fiancas_analisado_por_fkey(nome)
        `)
        .eq('fianca_id', fiancaId)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar histórico:', error);
        throw error;
      }
      return data as HistoricoItem[];
    },
    enabled: !!fiancaId
  });

  return {
    fianca,
    historico,
    isLoading: isLoadingFianca || isLoadingHistorico
  };
};
