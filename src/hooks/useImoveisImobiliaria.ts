import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Imovel {
  id: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipo: string;
  area_metros?: number;
  valor_aluguel: number;
  descricao?: string;
  status: 'disponivel' | 'ocupado' | 'manutencao';
  inquilino_nome?: string;
  data_criacao: string;
}

export const useImoveisImobiliaria = (searchTerm: string = '', statusFilter: string = '') => {
  const { user } = useAuth();

  const { data: imoveis = [], isLoading, error, refetch } = useQuery({
    queryKey: ['imoveis-imobiliaria', user?.id, searchTerm, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];

      // Buscar imóveis das fianças da imobiliária logada
      let query = supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          imovel_endereco,
          imovel_numero,
          imovel_complemento,
          imovel_bairro,
          imovel_cidade,
          imovel_estado,
          imovel_tipo,
          imovel_area_metros,
          imovel_valor_aluguel,
          imovel_descricao,
          inquilino_nome_completo,
          data_criacao,
          status_fianca
        `)
        .eq('id_imobiliaria', user.id);

      const { data: fiancas, error } = await query.order('data_criacao', { ascending: false });

      if (error) throw error;

      // Agrupar por imóvel (endereço + número)
      const imoveisMap = new Map<string, Imovel>();

      for (const fianca of fiancas || []) {
        const key = `${fianca.imovel_endereco}-${fianca.imovel_numero}`;
        
        if (imoveisMap.has(key)) {
          // Se já existe o imóvel, verificar se há inquilino ativo
          const imovel = imoveisMap.get(key)!;
          if (fianca.status_fianca === 'ativa' || fianca.status_fianca === 'aprovada') {
            imovel.status = 'ocupado';
            imovel.inquilino_nome = fianca.inquilino_nome_completo;
          }
        } else {
          // Criar novo imóvel
          const status: 'disponivel' | 'ocupado' | 'manutencao' = 
            (fianca.status_fianca === 'ativa' || fianca.status_fianca === 'aprovada') 
              ? 'ocupado' 
              : 'disponivel';

          imoveisMap.set(key, {
            id: key,
            endereco: fianca.imovel_endereco,
            numero: fianca.imovel_numero,
            complemento: fianca.imovel_complemento || undefined,
            bairro: fianca.imovel_bairro,
            cidade: fianca.imovel_cidade,
            estado: fianca.imovel_estado,
            tipo: fianca.imovel_tipo,
            area_metros: fianca.imovel_area_metros || undefined,
            valor_aluguel: fianca.imovel_valor_aluguel,
            descricao: fianca.imovel_descricao || undefined,
            status,
            inquilino_nome: status === 'ocupado' ? fianca.inquilino_nome_completo : undefined,
            data_criacao: fianca.data_criacao
          });
        }
      }

      let imoveisList = Array.from(imoveisMap.values());

      // Aplicar filtro de busca por endereço, bairro ou tipo
      if (searchTerm) {
        imoveisList = imoveisList.filter(imovel =>
          imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imovel.cidade.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de status
      if (statusFilter && statusFilter !== 'todos') {
        imoveisList = imoveisList.filter(imovel => imovel.status === statusFilter);
      }

      return imoveisList;
    },
    enabled: !!user?.id
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'disponivel', label: 'Disponível' },
    { value: 'ocupado', label: 'Ocupado' },
    { value: 'manutencao', label: 'Manutenção' }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'disponivel': 'bg-green-100 text-green-800',
      'ocupado': 'bg-blue-100 text-blue-800',
      'manutencao': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'disponivel': 'Disponível',
      'ocupado': 'Ocupado',
      'manutencao': 'Manutenção'
    };
    return labels[status] || status;
  };

  // Calcular estatísticas para o dashboard
  const stats = {
    total: imoveis.length,
    disponiveis: imoveis.filter(i => i.status === 'disponivel').length,
    ocupados: imoveis.filter(i => i.status === 'ocupado').length,
    manutencao: imoveis.filter(i => i.status === 'manutencao').length
  };

  return {
    imoveis,
    isLoading,
    error,
    refetch,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    stats
  };
};