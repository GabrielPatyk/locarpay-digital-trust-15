
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type StatusFianca = Database['public']['Enums']['status_fianca'];

export interface FiancaInquilino {
  id: string;
  numero: string;
  imovel: string;
  endereco: string;
  valor: number;
  dataEmissao: string;
  status: StatusFianca;
  imobiliaria: string;
  dataVencimento?: string;
}

export const useFiancasInquilino = (searchTerm: string = '', statusFilter: string = '') => {
  const { user } = useAuth();

  const { data: fiancas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['fiancas-inquilino', user?.id, searchTerm, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          imovel_tipo,
          imovel_endereco,
          imovel_cidade,
          imovel_estado,
          imovel_valor_aluguel,
          data_criacao,
          data_vencimento,
          status_fianca,
          usuarios!fiancas_locaticias_id_imobiliaria_fkey(nome)
        `)
        .eq('inquilino_usuario_id', user.id);

      const { data, error } = await query.order('data_criacao', { ascending: false });

      if (error) throw error;

      let fiancasList: FiancaInquilino[] = (data || []).map((fianca, index) => ({
        id: fianca.id,
        numero: `FI-${new Date(fianca.data_criacao).getFullYear()}-${String(index + 1).padStart(3, '0')}`,
        imovel: fianca.imovel_tipo,
        endereco: `${fianca.imovel_endereco}, ${fianca.imovel_cidade} - ${fianca.imovel_estado}`,
        valor: fianca.imovel_valor_aluguel,
        dataEmissao: fianca.data_criacao,
        status: fianca.status_fianca,
        imobiliaria: fianca.usuarios?.nome || 'Imobiliária',
        dataVencimento: fianca.data_vencimento || undefined
      }));

      // Aplicar filtro de busca
      if (searchTerm) {
        fiancasList = fiancasList.filter(fianca =>
          fianca.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fianca.imovel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fianca.endereco.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de status
      if (statusFilter && statusFilter !== 'todos') {
        fiancasList = fiancasList.filter(fianca => fianca.status === statusFilter);
      }

      return fiancasList;
    },
    enabled: !!user?.id
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'ativa', label: 'Ativa' },
    { value: 'rejeitada', label: 'Rejeitada' },
    { value: 'vencida', label: 'Vencida' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  const getStatusColor = (status: StatusFianca) => {
    switch (status) {
      case 'ativa': return 'bg-success';
      case 'em_analise': return 'bg-warning';
      case 'aprovada': return 'bg-blue-500';
      case 'vencida': return 'bg-red-500';
      case 'rejeitada': return 'bg-red-500';
      case 'cancelada': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: StatusFianca) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'em_analise': return 'Em Análise';
      case 'aprovada': return 'Aprovada';
      case 'vencida': return 'Vencida';
      case 'rejeitada': return 'Rejeitada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  // Calcular estatísticas para o dashboard
  const stats = {
    ativas: fiancas.filter(f => f.status === 'ativa').length,
    pendentes: fiancas.filter(f => ['em_analise', 'enviada_ao_financeiro', 'pagamento_disponivel'].includes(f.status)).length,
    valorTotal: fiancas.filter(f => f.status === 'ativa').reduce((acc, f) => acc + f.valor, 0),
    vencidas: fiancas.filter(f => f.status === 'vencida').length
  };

  return {
    fiancas,
    isLoading,
    error,
    refetch,
    getStatusOptions,
    getStatusColor,
    getStatusText,
    stats
  };
};
