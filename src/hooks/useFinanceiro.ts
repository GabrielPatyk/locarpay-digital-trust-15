
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHistoricoFiancas } from './useHistoricoFiancas';
import type { Tables } from '@/integrations/supabase/types';

type Fianca = Tables<'fiancas_locaticias'>;

export const useFinanceiro = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { registrarLog } = useHistoricoFiancas();

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
          usuarios!id_imobiliaria(nome)
        `)
        .in('status_fianca', [
          'aprovada', 
          'enviada_ao_financeiro', 
          'aguardando_geracao_pagamento',
          'pagamento_disponivel',
          'comprovante_enviado',
          'ativa'
        ])
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data as Fianca[];
    },
    enabled: !!user?.id
  });

  const anexarLinkPagamento = useMutation({
    mutationFn: async ({ fiancaId, linkPagamento }: { fiancaId: string; linkPagamento: string }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({ 
          status_fianca: 'pagamento_disponivel',
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;

      // Registrar log do anexo do link
      await registrarLog({
        fiancaId,
        acao: 'Link de pagamento anexado',
        detalhes: `Link: ${linkPagamento}`
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-financeiro'] });
    }
  });

  const confirmarPagamento = useMutation({
    mutationFn: async (fiancaId: string) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({ 
          status_fianca: 'ativa',
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;

      // Registrar log da confirmação do pagamento
      await registrarLog({
        fiancaId,
        acao: 'Pagamento confirmado',
        detalhes: 'Fiança ativada após confirmação do pagamento'
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-financeiro'] });
    }
  });

  const getFinanceiroStats = () => {
    const totalFiancas = fiancas.length;
    const aguardandoPagamento = fiancas.filter(f => 
      ['aprovada', 'enviada_ao_financeiro', 'aguardando_geracao_pagamento'].includes(f.status_fianca)
    ).length;
    const pagamentoDisponivel = fiancas.filter(f => f.status_fianca === 'pagamento_disponivel').length;
    const comprovantesEnviados = fiancas.filter(f => f.status_fianca === 'comprovante_enviado').length;
    const ativas = fiancas.filter(f => f.status_fianca === 'ativa').length;

    return {
      totalFiancas,
      aguardandoPagamento,
      pagamentoDisponivel,
      comprovantesEnviados,
      ativas
    };
  };

  return {
    fiancas,
    isLoading,
    error,
    anexarLinkPagamento,
    confirmarPagamento,
    isAttachingLink: anexarLinkPagamento.isPending,
    isConfirmingPayment: confirmarPagamento.isPending,
    getFinanceiroStats,
    registrarLog
  };
};
