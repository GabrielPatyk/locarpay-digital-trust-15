
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useHistoricoFiancas } from '@/hooks/useHistoricoFiancas';

interface FiancaAnalise {
  id: string;
  data_criacao: string;
  data_vencimento: string | null;
  inquilino_nome_completo: string;
  inquilino_cpf: string;
  inquilino_email: string;
  inquilino_whatsapp: string;
  inquilino_renda_mensal: number;
  inquilino_endereco: string;
  inquilino_numero: string;
  inquilino_bairro: string;
  inquilino_cidade: string;
  inquilino_estado: string;
  imovel_tipo: string;
  imovel_valor_aluguel: number;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_bairro: string;
  imovel_cidade: string;
  imovel_estado: string;
  status_fianca: string;
  imobiliaria_nome?: string;
  imobiliaria_responsavel?: string;
  score_credito?: number;
  taxa_aplicada?: number;
  motivo_reprovacao?: string;
}

export const useAnalista = () => {
  const { user } = useAuth();
  const { registrarLog } = useHistoricoFiancas();
  const [fiancas, setFiancas] = useState<FiancaAnalise[]>([]);
  const [loading, setLoading] = useState(true);

  const buscarFiancasPendentes = async () => {
    try {
      setLoading(true);
      console.log('Buscando fianças pendentes para análise...');

      const { data, error } = await supabase
        .from('fiancas_para_analise')
        .select('*')
        .eq('status_fianca', 'em_analise')
        .order('data_criacao', { ascending: true });

      console.log('Dados da query:', data);

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }

      setFiancas(data || []);
    } catch (error) {
      console.error('Erro ao buscar fianças:', error);
      toast.error('Erro ao carregar fianças para análise');
    } finally {
      setLoading(false);
    }
  };

  const aprovarFianca = async (fiancaId: string, scoreCredito: number, taxaAplicada: number, observacoes?: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('Aprovando fiança:', fiancaId, 'pelo analista:', user.id);

      // Atualizar a fiança com aprovação e ID do analista
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'aprovada',
          score_credito: scoreCredito,
          taxa_aplicada: taxaAplicada,
          observacoes_aprovacao: observacoes,
          data_analise: new Date().toISOString(),
          id_analista: user.id // Salvar o ID do analista logado
        })
        .eq('id', fiancaId);

      if (error) throw error;

      // Registrar no histórico
      await registrarLog({
        fiancaId,
        acao: 'Fiança aprovada',
        detalhes: observacoes || `Score: ${scoreCredito}, Taxa: ${taxaAplicada}%`
      });

      toast.success('Fiança aprovada com sucesso!');
      await buscarFiancasPendentes();
    } catch (error) {
      console.error('Erro ao aprovar fiança:', error);
      toast.error('Erro ao aprovar fiança');
    }
  };

  const rejeitarFianca = async (fiancaId: string, motivoReprovacao: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('Rejeitando fiança:', fiancaId, 'pelo analista:', user.id);

      // Atualizar a fiança com rejeição e ID do analista
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'rejeitada',
          motivo_reprovacao: motivoReprovacao,
          data_analise: new Date().toISOString(),
          id_analista: user.id // Salvar o ID do analista logado
        })
        .eq('id', fiancaId);

      if (error) throw error;

      // Registrar no histórico
      await registrarLog({
        fiancaId,
        acao: 'Fiança rejeitada',
        detalhes: motivoReprovacao
      });

      toast.success('Fiança rejeitada com sucesso!');
      await buscarFiancasPendentes();
    } catch (error) {
      console.error('Erro ao rejeitar fiança:', error);
      toast.error('Erro ao rejeitar fiança');
    }
  };

  useEffect(() => {
    if (user && user.type === 'analista') {
      buscarFiancasPendentes();
    }
  }, [user]);

  return {
    fiancas,
    loading,
    aprovarFianca,
    rejeitarFianca,
    buscarFiancasPendentes
  };
};
