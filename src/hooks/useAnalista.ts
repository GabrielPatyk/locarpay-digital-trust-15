
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHistoricoFiancas } from './useHistoricoFiancas';
import type { Tables } from '@/integrations/supabase/types';

type Fianca = Tables<'fiancas_locaticias'>;

export const useAnalista = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { registrarLog } = useHistoricoFiancas();

  const {
    data: fiancas = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['fiancas-analise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          *,
          usuarios!id_imobiliaria(nome)
        `)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data as Fianca[];
    },
    enabled: !!user?.id
  });

  const aprovarFianca = useMutation({
    mutationFn: async ({ 
      fiancaId, 
      score, 
      taxa, 
      observacoes 
    }: { 
      fiancaId: string; 
      score: number; 
      taxa: number; 
      observacoes?: string; 
    }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'aprovada',
          score_credito: score,
          taxa_aplicada: taxa,
          observacoes_aprovacao: observacoes,
          data_analise: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;

      // Registrar log da aprovação
      await registrarLog({
        fiancaId,
        acao: 'Fiança aprovada',
        detalhes: `Score: ${score}, Taxa: ${taxa}%${observacoes ? `, Observações: ${observacoes}` : ''}`
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
    }
  });

  const rejeitarFianca = useMutation({
    mutationFn: async ({ fiancaId, motivo }: { fiancaId: string; motivo: string }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'rejeitada',
          motivo_reprovacao: motivo,
          data_analise: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;

      // Registrar log da rejeição
      await registrarLog({
        fiancaId,
        acao: 'Fiança rejeitada',
        detalhes: motivo
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
    }
  });

  const editarScore = useMutation({
    mutationFn: async ({ fiancaId, novoScore }: { fiancaId: string; novoScore: number }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          score_credito: novoScore,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;

      // Registrar log da edição de score
      await registrarLog({
        fiancaId,
        acao: 'Score de crédito editado',
        detalhes: `Novo score: ${novoScore}`
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
    }
  });

  const getAnaliseStats = () => {
    const totalFiancas = fiancas.length;
    const pendentesAnalise = fiancas.filter(f => f.status_fianca === 'em_analise').length;
    const aprovadas = fiancas.filter(f => f.status_fianca === 'aprovada').length;
    const rejeitadas = fiancas.filter(f => f.status_fianca === 'rejeitada').length;

    return {
      totalFiancas,
      pendentesAnalise,
      aprovadas,
      rejeitadas
    };
  };

  return {
    fiancas,
    isLoading,
    error,
    aprovarFianca,
    rejeitarFianca,
    editarScore,
    isApproving: aprovarFianca.isPending,
    isRejecting: rejeitarFianca.isPending,
    isEditingScore: editarScore.isPending,
    getAnaliseStats,
    registrarLog
  };
};
