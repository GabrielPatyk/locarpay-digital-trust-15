
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHistoricoFiancas } from './useHistoricoFiancas';
import type { Tables } from '@/integrations/supabase/types';

type Fianca = Tables<'fiancas_locaticias'>;

const sendWebhook = async (fiancaData: any) => {
  try {
    console.log('Enviando webhook para:', 'https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6');
    
    await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fiancaData)
    });
    
    console.log('Webhook enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
};

const getFiancaCompleteData = async (fiancaId: string) => {
  // Buscar todos os dados da fiança
  const { data: fianca, error: fiancaError } = await supabase
    .from('fiancas_locaticias')
    .select('*')
    .eq('id', fiancaId)
    .single();

  if (fiancaError) throw fiancaError;

  // Buscar dados da imobiliária
  const { data: imobiliaria, error: imobiliariaError } = await supabase
    .from('usuarios')
    .select(`
      *,
      perfil_usuario(*)
    `)
    .eq('id', fianca.id_imobiliaria)
    .single();

  if (imobiliariaError) throw imobiliariaError;

  return {
    fianca,
    imobiliaria: {
      ...imobiliaria,
      perfil: imobiliaria.perfil_usuario
    }
  };
};

// Função para baixar comprovante
const visualizarComprovante = async (comprovanteUrl: string) => {
  if (!comprovanteUrl) {
    console.error('URL do comprovante não encontrada');
    return;
  }

  console.log('Tentando baixar comprovante:', comprovanteUrl);

  try {
    let downloadUrl: string;
    let fileName: string;

    // Se for uma URL completa do Supabase Storage
    if (comprovanteUrl.includes('supabase')) {
      downloadUrl = comprovanteUrl;
      fileName = comprovanteUrl.split('/').pop() || 'comprovante';
    } else {
      // Se for apenas o caminho do arquivo, construir a URL completa
      const { data } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(comprovanteUrl);

      console.log('URL pública gerada:', data?.publicUrl);

      if (!data?.publicUrl) {
        console.error('Erro ao gerar URL pública do comprovante');
        return;
      }

      downloadUrl = data.publicUrl;
      fileName = comprovanteUrl.split('/').pop() || 'comprovante';
    }

    // Fazer o download do arquivo
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error('Erro ao baixar o arquivo');
    }

    const blob = await response.blob();
    
    // Criar um link temporário para download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Limpar o link temporário
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log('Comprovante baixado com sucesso');
  } catch (error) {
    console.error('Erro ao baixar comprovante:', error);
    throw error;
  }
};

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
      console.log('Buscando fianças para financeiro...');
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          *,
          usuarios!fiancas_locaticias_criado_por_fkey(nome)
        `)
        .in('status_fianca', [
          'enviada_ao_financeiro', 
          'pagamento_disponivel', 
          'comprovante_enviado',
          'pagamento_confirmado'
        ])
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar fianças:', error);
        throw error;
      }
      
      console.log('Fianças encontradas:', data?.length || 0);
      return data as Fianca[];
    },
    enabled: !!user?.id
  });

  const atualizarStatusFianca = useMutation({
    mutationFn: async ({ fiancaId, novoStatus }: { fiancaId: string; novoStatus: Tables<'fiancas_locaticias'>['status_fianca'] }) => {
      console.log('Atualizando status da fiança:', fiancaId, 'para:', novoStatus);
      
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
        'pagamento_confirmado': 'Pagamento confirmado pelo financeiro',
        'ativa': 'Fiança ativada',
        'assinatura_imobiliaria': 'Enviada para assinatura da imobiliária'
      };

      await registrarLog({
        fiancaId,
        acao: acoes[novoStatus] || `Status alterado para ${novoStatus}`,
        detalhes: `Status alterado para ${novoStatus}`
      });

      // Enviar webhook quando o status for alterado para assinatura_imobiliaria
      if (novoStatus === 'assinatura_imobiliaria') {
        try {
          const webhookData = await getFiancaCompleteData(fiancaId);
          await sendWebhook({
            event: 'fianca_payment_confirmed',
            data: webhookData,
            timestamp: new Date().toISOString()
          });
        } catch (webhookError) {
          console.error('Erro ao enviar webhook:', webhookError);
        }
      }

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-financeiro'] });
    }
  });

  const anexarLinkPagamento = useMutation({
    mutationFn: async ({ fiancaId, linkPagamento }: { fiancaId: string; linkPagamento: string }) => {
      console.log('Anexando link de pagamento para fiança:', fiancaId);
      
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
      console.log('Confirmando pagamento para fiança:', fiancaId);
      
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({ 
          status_fianca: 'pagamento_confirmado',
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;

      await registrarLog({
        fiancaId,
        acao: 'Pagamento confirmado',
        detalhes: 'Pagamento confirmado pelo departamento financeiro'
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-financeiro'] });
    }
  });

  const getFinanceiroStats = () => {
    const totalFiancas = fiancas.length;
    const aguardandoLink = fiancas.filter(f => f.status_fianca === 'enviada_ao_financeiro').length;
    const linkEnviado = fiancas.filter(f => f.status_fianca === 'pagamento_disponivel').length;
    const pagos = fiancas.filter(f => f.status_fianca === 'comprovante_enviado').length;
    const confirmados = fiancas.filter(f => f.status_fianca === 'pagamento_confirmado').length;

    return {
      totalFiancas,
      aguardandoLink,
      linkEnviado,
      pagos,
      confirmados
    };
  };

  const getStats = () => {
    const totalFiancas = fiancas.length;
    const aguardandoLink = fiancas.filter(f => f.status_fianca === 'enviada_ao_financeiro').length;
    const linkEnviado = fiancas.filter(f => f.status_fianca === 'pagamento_disponivel').length;
    const pagos = fiancas.filter(f => f.status_fianca === 'comprovante_enviado').length;
    const confirmados = fiancas.filter(f => f.status_fianca === 'pagamento_confirmado').length;
    
    const valorTotal = fiancas.reduce((acc, f) => acc + (f.imovel_valor_aluguel || 0), 0);
    const valorPago = fiancas
      .filter(f => ['comprovante_enviado', 'pagamento_confirmado', 'ativa'].includes(f.status_fianca))
      .reduce((acc, f) => acc + (f.imovel_valor_aluguel || 0), 0);

    return {
      totalFiancas,
      aguardandoLink,
      linkEnviado,
      pagos,
      confirmados,
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
    registrarLog,
    visualizarComprovante
  };
};
