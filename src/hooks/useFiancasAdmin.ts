import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FiancaAdmin {
  id: string;
  inquilino_nome_completo: string;
  imobiliaria_nome: string;
  imobiliaria_responsavel: string;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_bairro: string;
  imovel_valor_aluguel: number;
  valor_fianca: number;
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

      // First get the fiancas with imobiliaria data
      const { data: fiancasData, error: fiancasError } = await supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          imovel_endereco,
          imovel_numero,
          imovel_bairro,
          imovel_valor_aluguel,
          valor_fianca,
          status_fianca,
          data_criacao,
          motivo_reprovacao,
          data_analise,
          id_imobiliaria,
          id_analista
        `)
        .order('data_criacao', { ascending: false });

      if (fiancasError) throw fiancasError;

      // Get unique imobiliaria and analista IDs
      const imobiliariaIds = [...new Set(fiancasData?.map(f => f.id_imobiliaria).filter(Boolean) || [])];
      const analistaIds = [...new Set(fiancasData?.map(f => f.id_analista).filter(Boolean) || [])];

      // Get imobiliaria data with perfil
      const { data: imobiliariasData } = await supabase
        .from('usuarios')
        .select(`
          id,
          nome,
          perfil_usuario!inner(nome_empresa)
        `)
        .in('id', imobiliariaIds);

      // Get analista data
      const { data: analistasData } = await supabase
        .from('usuarios')
        .select('id, nome')
        .in('id', analistaIds);

      // Create lookup maps
      const imobiliariaMap = new Map();
      imobiliariasData?.forEach(imob => {
        imobiliariaMap.set(imob.id, {
          nome_empresa: imob.perfil_usuario?.[0]?.nome_empresa || 'N/A',
          responsavel: imob.nome
        });
      });

      const analistaMap = new Map();
      analistasData?.forEach(analista => {
        analistaMap.set(analista.id, analista.nome);
      });

      // Transform data
      const fiancasWithImobiliaria = fiancasData?.map(fianca => {
        const imobData = imobiliariaMap.get(fianca.id_imobiliaria);
        return {
          ...fianca,
          imobiliaria_nome: imobData?.nome_empresa || 'Imobiliária não encontrada',
          imobiliaria_responsavel: imobData?.responsavel || '',
          analisado_por: analistaMap.get(fianca.id_analista) || ''
        };
      }) || [];

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