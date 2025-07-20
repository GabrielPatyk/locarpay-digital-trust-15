
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FiancaAnalise {
  id: string;
  inquilino_nome_completo: string;
  score_credito: number | null;
  imovel_valor_aluguel: number;
  valor_fianca: number | null;
  status_fianca: string;
  data_criacao: string;
  taxa_aplicada: number | null;
}

interface DashboardStats {
  fiancasAprovadas: number;
  scoreMedia: number;
  valorMedioAluguel: number;
  totalFiancas: number;
  taxaMedia: number;
}

export const useRelatoriosAnalistaData = () => {
  const { user } = useAuth();
  const [fiancas, setFiancas] = useState<FiancaAnalise[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    fiancasAprovadas: 0,
    scoreMedia: 0,
    valorMedioAluguel: 0,
    totalFiancas: 0,
    taxaMedia: 0
  });

  const buscarFiancas = async (dataInicio?: string, dataFim?: string, statusFiltro?: string) => {
    if (!user || user.type !== 'analista') {
      console.log('Usuário não é analista ou não está logado');
      return;
    }

    setLoading(true);
    try {
      console.log('Buscando fianças para o analista:', user.id);
      console.log('Filtros aplicados:', { dataInicio, dataFim, statusFiltro });
      
      let query = supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          score_credito,
          imovel_valor_aluguel,
          valor_fianca,
          status_fianca,
          data_criacao,
          taxa_aplicada
        `)
        .eq('id_analista', user.id)
        .in('status_fianca', ['aprovada', 'rejeitada']);

      // Aplicar filtros de data
      if (dataInicio) {
        query = query.gte('data_criacao', dataInicio + 'T00:00:00.000Z');
      }
      if (dataFim) {
        query = query.lte('data_criacao', dataFim + 'T23:59:59.999Z');
      }

      // Aplicar filtro de status
      if (statusFiltro && statusFiltro !== 'todos') {
        const statusMap: { [key: string]: string } = {
          'Aprovado': 'aprovada',
          'Reprovado': 'rejeitada'
        };
        const dbStatus = statusMap[statusFiltro];
        if (dbStatus) {
          query = query.eq('status_fianca', dbStatus as any);
        }
      }

      const { data, error } = await query.order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }

      console.log('Fianças encontradas:', data?.length || 0);
      setFiancas(data || []);
      calcularEstatisticas(data || []);
      
    } catch (error) {
      console.error('Erro ao buscar fianças:', error);
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (dados: FiancaAnalise[]) => {
    const aprovadas = dados.filter(f => f.status_fianca === 'aprovada');
    
    const newStats: DashboardStats = {
      fiancasAprovadas: aprovadas.length,
      scoreMedia: aprovadas.length > 0 ? 
        Math.round(aprovadas.reduce((acc, f) => acc + (f.score_credito || 0), 0) / aprovadas.length) : 0,
      valorMedioAluguel: dados.length > 0 ? 
        Math.round(dados.reduce((acc, f) => acc + f.imovel_valor_aluguel, 0) / dados.length) : 0,
      totalFiancas: aprovadas.reduce((acc, f) => acc + (f.valor_fianca || 0), 0),
      taxaMedia: aprovadas.length > 0 ? 
        Math.round((aprovadas.reduce((acc, f) => acc + (f.taxa_aplicada || 0), 0) / aprovadas.length) * 100) / 100 : 0
    };

    console.log('Estatísticas calculadas:', newStats);
    setStats(newStats);
  };

  return {
    fiancas,
    loading,
    stats,
    buscarFiancas
  };
};
