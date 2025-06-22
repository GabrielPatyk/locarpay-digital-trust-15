import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHistoricoFiancas } from './useHistoricoFiancas';
import { useInquilinoCreation } from './useInquilinoCreation';
import type { Tables } from '@/integrations/supabase/types';

type Fianca = Tables<'fiancas_locaticias'>;
type FiancaParaAnalise = Tables<'fiancas_para_analise'>;

export const useAnalista = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { registrarLog } = useHistoricoFiancas();
  const { verificarOuCriarInquilino } = useInquilinoCreation();

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

  const {
    data: fiancasParaAnalise = [],
    isLoading: isLoadingFiancas
  } = useQuery({
    queryKey: ['fiancas-para-analise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_para_analise')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data as FiancaParaAnalise[];
    },
    enabled: !!user?.id
  });

  const {
    data: estatisticas = {
      pendentes: 0,
      aprovadas: 0,
      reprovadas: 0,
      taxaMedia: 0
    },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['analista-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('status_fianca, taxa_aplicada');

      if (error) throw error;

      const pendentes = data.filter(f => f.status_fianca === 'em_analise').length;
      const aprovadas = data.filter(f => f.status_fianca === 'aprovada').length;
      const reprovadas = data.filter(f => f.status_fianca === 'rejeitada').length;
      
      const taxas = data.filter(f => f.taxa_aplicada).map(f => f.taxa_aplicada);
      const taxaMedia = taxas.length > 0 ? taxas.reduce((a, b) => (a || 0) + (b || 0), 0) / taxas.length : 0;

      return {
        pendentes,
        aprovadas,
        reprovadas,
        taxaMedia: Math.round(taxaMedia * 100) / 100
      };
    },
    enabled: !!user?.id
  });

  const updateScoreETaxa = useMutation({
    mutationFn: async ({ id, score, taxa }: { id: string; score: number; taxa: number }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          score_credito: score,
          taxa_aplicada: taxa,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await registrarLog({
        fiancaId: id,
        acao: 'Score e taxa atualizados',
        detalhes: `Score: ${score}, Taxa: ${taxa}%`
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
    }
  });

  const aprovarFianca = useMutation({
    mutationFn: async ({ 
      id, 
      score, 
      taxa, 
      observacoes 
    }: { 
      id: string; 
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
        .eq('id', id);

      if (error) throw error;

      await registrarLog({
        fiancaId: id,
        acao: 'Fiança aprovada',
        detalhes: `Score: ${score}, Taxa: ${taxa}%${observacoes ? `, Observações: ${observacoes}` : ''}`
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
    }
  });

  const reprovarFianca = useMutation({
    mutationFn: async ({ 
      id, 
      motivo,
      score,
      taxa
    }: { 
      id: string; 
      motivo: string;
      score?: number;
      taxa?: number;
    }) => {
      const updateData: any = {
        status_fianca: 'rejeitada',
        motivo_reprovacao: motivo,
        data_analise: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      if (score) updateData.score_credito = score;
      if (taxa) updateData.taxa_aplicada = taxa;

      const { error } = await supabase
        .from('fiancas_locaticias')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await registrarLog({
        fiancaId: id,
        acao: 'Fiança rejeitada',
        detalhes: motivo
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
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

      await registrarLog({
        fiancaId,
        acao: 'Score de crédito editado',
        detalhes: `Novo score: ${novoScore}`
      });

      return fiancaId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
    }
  });

  const consultarScoreComInquilino = useMutation({
    mutationFn: async ({ fiancaId, dadosInquilino }: { 
      fiancaId: string; 
      dadosInquilino: {
        nome_completo: string;
        cpf: string;
        email: string;
        whatsapp: string;
        endereco: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
        renda_mensal: number;
      }
    }) => {
      console.log('Iniciando consulta de score com verificação de inquilino...');
      
      // Verificar ou criar inquilino
      const resultadoInquilino = await verificarOuCriarInquilino(dadosInquilino);
      
      if (!resultadoInquilino.success) {
        throw new Error(resultadoInquilino.error);
      }

      // Registrar no histórico
      await registrarLog({
        fiancaId,
        acao: resultadoInquilino.isNew ? 'Conta de inquilino criada' : 'Inquilino encontrado',
        detalhes: `${resultadoInquilino.isNew ? 'Nova conta criada' : 'Conta existente encontrada'} para ${dadosInquilino.nome_completo}`
      });

      // Simular consulta de score (aqui você integraria com o serviço real)
      const scoreSimulado = Math.floor(Math.random() * (850 - 300) + 300);
      
      await registrarLog({
        fiancaId,
        acao: 'Score consultado',
        detalhes: `Score obtido: ${scoreSimulado}`
      });

      return { inquilino: resultadoInquilino.usuario, score: scoreSimulado };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas-analise'] });
      queryClient.invalidateQueries({ queryKey: ['fiancas-para-analise'] });
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
    fiancasParaAnalise,
    isLoading,
    isLoadingFiancas,
    error,
    estatisticas,
    isLoadingStats,
    updateScoreETaxa,
    isUpdatingScore: updateScoreETaxa.isPending,
    aprovarFianca,
    isApprovingFianca: aprovarFianca.isPending,
    reprovarFianca,
    isReprovingFianca: reprovarFianca.isPending,
    rejeitarFianca: reprovarFianca,
    editarScore,
    isApproving: aprovarFianca.isPending,
    isRejecting: reprovarFianca.isPending,
    isEditingScore: editarScore.isPending,
    getAnaliseStats,
    registrarLog,
    consultarScoreComInquilino,
    isConsultingScore: consultarScoreComInquilino.isPending,
  };
};
