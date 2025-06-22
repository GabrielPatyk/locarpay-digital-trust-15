
import { supabase } from '@/integrations/supabase/client';

export interface LogParams {
  fiancaId: string;
  acao: string;
  usuarioId?: string | null;
  usuarioNome?: string | null;
  detalhes?: string | null;
}

export const registrarHistorico = async ({
  fiancaId,
  acao,
  usuarioId = null,
  usuarioNome = 'Sistema',
  detalhes = null
}: LogParams) => {
  try {
    const { error } = await supabase
      .from('historico_fiancas')
      .insert({
        fianca_id: fiancaId,
        acao,
        usuario_id: usuarioId,
        usuario_nome: usuarioNome,
        detalhes,
        data_criacao: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao registrar histórico:', error);
      throw error;
    }

    console.log(`✅ Log registrado: ${acao} para fiança ${fiancaId}`);
  } catch (error) {
    console.error('❌ Erro ao registrar histórico:', error);
    throw error;
  }
};

// Ações predefinidas para facilitar o uso
export const ACOES_HISTORICO = {
  FIANCA_CRIADA: 'Fiança criada',
  FIANCA_EDITADA: 'Fiança editada',
  ENVIADA_ANALISE: 'Enviada para análise',
  FIANCA_APROVADA: 'Fiança aprovada',
  FIANCA_REJEITADA: 'Fiança rejeitada',
  ENVIADA_FINANCEIRO: 'Enviada ao financeiro',
  LINK_PAGAMENTO_ANEXADO: 'Link de pagamento anexado',
  COMPROVANTE_ENVIADO: 'Comprovante de pagamento enviado',
  PAGAMENTO_CONFIRMADO: 'Pagamento confirmado',
  FIANCA_ATIVADA: 'Fiança ativada',
  SCORE_EDITADO: 'Score de crédito editado',
  TAXA_EDITADA: 'Taxa aplicada editada',
  OBSERVACOES_ADICIONADAS: 'Observações adicionadas'
} as const;
