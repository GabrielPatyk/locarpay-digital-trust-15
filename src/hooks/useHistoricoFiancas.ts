
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LogHistoricoParams {
  fiancaId: string;
  acao: string;
  detalhes?: string | null;
}

export const useHistoricoFiancas = () => {
  const { user } = useAuth();

  const registrarLog = async ({ fiancaId, acao, detalhes }: LogHistoricoParams) => {
    try {
      const { error } = await supabase
        .from('historico_fiancas')
        .insert({
          fianca_id: fiancaId,
          acao,
          usuario_id: user?.id || null,
          usuario_nome: user?.name || 'Usuário desconhecido',
          detalhes,
          data_criacao: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao registrar log:', error);
        throw error;
      }

      console.log(`Log registrado: ${acao} para fiança ${fiancaId}`);
    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
      throw error;
    }
  };

  return {
    registrarLog
  };
};
