
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHistoricoFiancas } from './useHistoricoFiancas';

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
  imovel_tempo_locacao: number;
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
      
      const { data, error } = await supabase
        .from('fiancas_para_analise')
        .select('*')
        .in('status_fianca', ['em_analise', 'aprovada', 'rejeitada']);

      if (error) {
        console.error('Erro ao buscar fianças:', error);
        throw error;
      }

      setFiancas(data || []);
    } catch (error) {
      console.error('Erro ao carregar fianças:', error);
    } finally {
      setLoading(false);
    }
  };

  const aprovarFianca = async (fiancaId: string, score: number, taxa: number) => {
    try {
      // Buscar dados da fiança para cálculo
      const { data: fiancaData, error: fiancaError } = await supabase
        .from('fiancas_locaticias')
        .select('imovel_valor_aluguel, imovel_tempo_locacao')
        .eq('id', fiancaId)
        .single();

      if (fiancaError) {
        console.error('Erro ao buscar dados da fiança:', fiancaError);
        throw fiancaError;
      }

      // Calcular valores
      const valorAluguel = fiancaData.imovel_valor_aluguel || 0;
      const tempoLocacao = fiancaData.imovel_tempo_locacao || 0;
      const valorTotalLocacao = valorAluguel * tempoLocacao;
      const valorFianca = (valorTotalLocacao * taxa) / 100;

      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'aprovada',
          score_credito: score,
          taxa_aplicada: taxa,
          data_analise: new Date().toISOString(),
          id_analista: user?.id,
          valor_total_locacao: valorTotalLocacao,
          valor_fianca: valorFianca
        })
        .eq('id', fiancaId);

      if (error) {
        console.error('Erro ao aprovar fiança:', error);
        throw error;
      }

      // Registro no histórico com detalhes da aprovação
      await registrarLog({
        fiancaId,
        acao: 'Fiança aprovada',
        detalhes: `Score: ${score}, Taxa: ${taxa}% - Valor total da Locação: R$ ${valorTotalLocacao.toLocaleString('pt-BR')}, Valor da Fiança: R$ ${valorFianca.toLocaleString('pt-BR')}`
      });

      await buscarFiancasPendentes();
    } catch (error) {
      console.error('Erro ao aprovar fiança:', error);
      throw error;
    }
  };

  const rejeitarFianca = async (fiancaId: string, motivo: string) => {
    try {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'rejeitada',
          motivo_reprovacao: motivo,
          data_analise: new Date().toISOString(),
          id_analista: user?.id
        })
        .eq('id', fiancaId);

      if (error) {
        console.error('Erro ao rejeitar fiança:', error);
        throw error;
      }

      // Registro no histórico
      await registrarLog({
        fiancaId,
        acao: 'Fiança rejeitada',
        detalhes: motivo
      });

      await buscarFiancasPendentes();
    } catch (error) {
      console.error('Erro ao rejeitar fiança:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user?.type === 'analista') {
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
