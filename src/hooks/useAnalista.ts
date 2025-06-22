
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type FiancaParaAnalise = Tables<'fiancas_para_analise'>;

export interface EstatisticasAnalista {
  totalAnalises: number;
  pendentes: number;
  aprovadas: number;
  reprovadas: number;
  taxaMedia: number;
}

export const useAnalista = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar todas as fianças para análise
  const {
    data: fiancasParaAnalise = [],
    isLoading: isLoadingFiancas,
    error: errorFiancas
  } = useQuery({
    queryKey: ['fiancas-para-analise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_para_analise')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data as FiancaParaAnalise[];
    },
    enabled: !!user?.id && user?.type === 'analista'
  });

  // Buscar estatísticas do analista
  const {
    data: estatisticas,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['estatisticas-analista'],
    queryFn: async (): Promise<EstatisticasAnalista> => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('status_fianca, taxa_aplicada');

      if (error) throw error;

      const totalAnalises = data.length;
      const pendentes = data.filter(f => f.status_fianca === 'em_analise').length;
      const aprovadas = data.filter(f => f.status_fianca === 'aprovada').length;
      const reprovadas = data.filter(f => f.status_fianca === 'rejeitada').length;
      
      const taxasValidas = data
        .filter(f => f.taxa_aplicada && f.status_fianca === 'aprovada')
        .map(f => f.taxa_aplicada as number);
      
      const taxaMedia = taxasValidas.length > 0 
        ? taxasValidas.reduce((acc, taxa) => acc + taxa, 0) / taxasValidas.length 
        : 0;

      return {
        totalAnalises,
        pendentes,
        aprovadas,
        reprovadas,
        taxaMedia: Math.round(taxaMedia * 100) / 100
      };
    },
    enabled: !!user?.id && user?.type === 'analista'
  });

  // Atualizar score e taxa
  const updateScoreETaxa = useMutation({
    mutationFn: async ({ 
      id, 
      score, 
      taxa 
    }: { 
      id: string; 
      score: number; 
      taxa: number; 
    }) => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .update({
          score_credito: score,
          taxa_aplicada: taxa
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas-analista'] });
    }
  });

  // Aprovar fiança
  const aprovarFianca = useMutation({
    mutationFn: async ({
      id,
      score,
      taxa
    }: {
      id: string;
      score: number;
      taxa: number;
    }) => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'aprovada',
          score_credito: score,
          taxa_aplicada: taxa,
          data_analise: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas-analista'] });
    }
  });

  // Reprovar fiança
  const reprovarFianca = useMutation({
    mutationFn: async ({
      id,
      motivo,
      score,
      taxa
    }: {
      id: string;
      motivo: string;
      score?: number;
      taxa?: number;
    }) => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'rejeitada',
          motivo_reprovacao: motivo,
          score_credito: score,
          taxa_aplicada: taxa,
          data_analise: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas-analista'] });
    }
  });

  return {
    fiancasParaAnalise,
    isLoadingFiancas,
    errorFiancas,
    estatisticas,
    isLoadingStats,
    updateScoreETaxa: updateScoreETaxa.mutate,
    isUpdatingScore: updateScoreETaxa.isPending,
    aprovarFianca: aprovarFianca.mutate,
    isApprovingFianca: aprovarFianca.isPending,
    reprovarFianca: reprovarFianca.mutate,
    isReprovingFianca: reprovarFianca.isPending
  };
};
