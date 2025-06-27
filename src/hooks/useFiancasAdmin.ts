
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FiancaAdmin {
  id: string;
  inquilino_nome_completo: string;
  imobiliaria_nome: string;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_bairro: string;
  imovel_valor_aluguel: number;
  status_fianca: string;
  data_criacao: string;
  motivo_reprovacao?: string;
  data_analise?: string;
  analisado_por?: string;
}

export const useFiancasAdmin = (searchTerm: string = '', statusFilter: string = '') => {
  const { user } = useAuth();

  const { data: fiancas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['fiancas-admin', searchTerm, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          imovel_endereco,
          imovel_numero,
          imovel_bairro,
          imovel_valor_aluguel,
          status_fianca,
          data_criacao,
          motivo_reprovacao,
          data_analise,
          id_imobiliaria,
          usuarios!fiancas_locaticias_id_imobiliaria_fkey(nome)
        `)
        .order('data_criacao', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to include imobiliaria name
      const fiancasWithImobiliaria = data?.map(fianca => ({
        ...fianca,
        imobiliaria_nome: fianca.usuarios?.nome || 'Imobiliária não encontrada'
      })) || [];

      // Apply search filter
      let filteredFiancas = fiancasWithImobiliaria;
      
      if (searchTerm) {
        filteredFiancas = filteredFiancas.filter(fianca =>
          fianca.inquilino_nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fianca.imobiliaria_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fianca.imovel_endereco.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter && statusFilter !== 'todos') {
        filteredFiancas = filteredFiancas.filter(fianca => fianca.status_fianca === statusFilter);
      }

      return filteredFiancas as FiancaAdmin[];
    },
    enabled: !!user?.id
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'rejeitada', label: 'Rejeitada' },
    { value: 'ativa', label: 'Ativa' },
    { value: 'vencida', label: 'Vencida' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejeitada': return 'bg-red-100 text-red-800 border-red-200';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ativa': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vencida': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelada': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aprovada': return 'Aprovada';
      case 'rejeitada': return 'Rejeitada';
      case 'em_analise': return 'Em Análise';
      case 'ativa': return 'Ativa';
      case 'vencida': return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return {
    fiancas,
    isLoading,
    error,
    refetch,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    formatCurrency
  };
};
