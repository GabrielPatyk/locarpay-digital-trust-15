
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

  const atualizarStatusFianca = useMutation({
    mutationFn: async ({ fiancaId, novoStatus }: { fiancaId: string; novoStatus: Tables<'fiancas_locaticias'>['status_fianca'] }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({ 
          status_fianca: novoStatus,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;

      const acoes: Record<string, string> = {
        'pagamento_disponivel': 'Link de pagamento anexado',
        'comprovante_enviado': 'Comprovante de pagamento enviado',
        'ativa': 'Fiança ativada'
      };

      await registrarLog({
        fiancaId,
        acao: acoes[novoStatus] || `Status alterado para ${novoStatus}`,
        detalhes: `Status alterado para ${novoStatus}`
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-financeiro'] });
    }
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

  const getStats = () => {
    const totalFiancas = fiancas.length;
    const aguardandoLink = fiancas.filter(f => f.status_fianca === 'enviada_ao_financeiro').length;
    const linkEnviado = fiancas.filter(f => f.status_fianca === 'pagamento_disponivel').length;
    const pagos = fiancas.filter(f => f.status_fianca === 'comprovante_enviado').length;
    
    const valorTotal = fiancas.reduce((acc, f) => acc + (f.imovel_valor_aluguel || 0), 0);
    const valorPago = fiancas
      .filter(f => ['comprovante_enviado', 'ativa'].includes(f.status_fianca))
      .reduce((acc, f) => acc + (f.imovel_valor_aluguel || 0), 0);

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
    isLoading,
    error,
    atualizarStatusFianca,
    isUpdating: atualizarStatusFianca.isPending,
    anexarLinkPagamento,
    confirmarPagamento,
    isAttachingLink: anexarLinkPagamento.isPending,
    isConfirmingPayment: confirmarPagamento.isPending,
    getFinanceiroStats,
    getStats,
    registrarLog
  };
};
