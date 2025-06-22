
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Fianca = Tables<'fiancas_locaticias'>;

export interface FiancaFinanceiro extends Fianca {
  usuarios?: {
    nome: string;
  };
}

export const useFinanceiro = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: fiancas = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['fiancas-financeiro'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          *,
          usuarios!criado_por(nome)
        `)
        .in('status_fianca', ['enviada_ao_financeiro', 'pagamento_disponivel' as any, 'comprovante_enviado' as any])
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data as FiancaFinanceiro[];
    },
    enabled: !!user?.id
  });

  const {
    data: todasFiancas = [],
    isLoading: isLoadingTodas
  } = useQuery({
    queryKey: ['todas-fiancas-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data as Fianca[];
    },
    enabled: !!user?.id
  });

  const atualizarStatusFianca = useMutation({
    mutationFn: async ({ fiancaId, novoStatus }: { fiancaId: string; novoStatus: string }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({ 
          status_fianca: novoStatus as any,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['todas-fiancas-stats'] });
    }
  });

  const getStats = () => {
    const totalFiancas = todasFiancas.length;
    const aguardandoLink = fiancas.filter(f => f.status_fianca === 'enviada_ao_financeiro').length;
    const linkEnviado = fiancas.filter(f => (f.status_fianca as any) === 'pagamento_disponivel').length;
    const pagos = todasFiancas.filter(f => (f.status_fianca as any) === 'comprovante_enviado').length;
    const valorTotal = todasFiancas.reduce((sum, f) => sum + Number(f.imovel_valor_aluguel || 0), 0);
    const valorPago = todasFiancas
      .filter(f => (f.status_fianca as any) === 'comprovante_enviado')
      .reduce((sum, f) => sum + Number(f.imovel_valor_aluguel || 0), 0);

    return {
      totalFiancas,
      aguardandoLink,
      linkEnviado,
      pagos,
      valorTotal,
      valorPago
    };
  };

  return {
    fiancas,
    isLoading: isLoading || isLoadingTodas,
    error,
    atualizarStatusFianca,
    isUpdating: atualizarStatusFianca.isPending,
    getStats
  };
};
