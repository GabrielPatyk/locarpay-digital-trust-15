
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface InquilinoFianca {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  statusFianca: string;
  statusVerificacao: 'verificado' | 'pendente';
  valorAluguel: number;
  dataInicio: string;
  fiancaId: string;
  totalFiancas: number;
}

export const useInquilinosImobiliaria = (searchTerm: string = '', statusFilter: string = '') => {
  const { user } = useAuth();

  const { data: inquilinos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inquilinos-imobiliaria', user?.id, searchTerm, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];

      // Buscar todas as fianças da imobiliária logada
      let query = supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          inquilino_email,
          inquilino_cpf,
          inquilino_whatsapp,
          status_fianca,
          imovel_valor_aluguel,
          data_criacao,
          inquilino_usuario_id
        `)
        .eq('id_imobiliaria', user.id);

      // Aplicar filtro de status se fornecido
      if (statusFilter && statusFilter !== 'todos') {
        query = query.eq('status_fianca', statusFilter);
      }

      const { data: fiancas, error } = await query.order('data_criacao', { ascending: false });

      if (error) throw error;

      // Agrupar por inquilino
      const inquilinosMap = new Map<string, InquilinoFianca>();

      for (const fianca of fiancas || []) {
        const key = fianca.inquilino_cpf || fianca.inquilino_nome_completo;
        
        if (inquilinosMap.has(key)) {
          // Atualizar contagem de fianças
          const inquilino = inquilinosMap.get(key)!;
          inquilino.totalFiancas += 1;
          
          // Se a fiança atual é mais recente, atualizar os dados principais
          if (new Date(fianca.data_criacao) > new Date(inquilino.dataInicio)) {
            inquilino.statusFianca = fianca.status_fianca;
            inquilino.valorAluguel = fianca.imovel_valor_aluguel;
            inquilino.dataInicio = fianca.data_criacao;
            inquilino.fiancaId = fianca.id;
          }
        } else {
          // Verificar se o inquilino tem cadastro como usuário
          let statusVerificacao: 'verificado' | 'pendente' = 'pendente';
          
          if (fianca.inquilino_usuario_id) {
            // Verificar se o usuário está verificado
            const { data: usuario } = await supabase
              .from('usuarios')
              .select('verificado')
              .eq('id', fianca.inquilino_usuario_id)
              .single();
            
            statusVerificacao = usuario?.verificado ? 'verificado' : 'pendente';
          }

          inquilinosMap.set(key, {
            id: key,
            nome: fianca.inquilino_nome_completo,
            email: fianca.inquilino_email || '',
            telefone: fianca.inquilino_whatsapp || '',
            cpf: fianca.inquilino_cpf,
            statusFianca: fianca.status_fianca,
            statusVerificacao,
            valorAluguel: fianca.imovel_valor_aluguel,
            dataInicio: fianca.data_criacao,
            fiancaId: fianca.id,
            totalFiancas: 1
          });
        }
      }

      let inquilinosList = Array.from(inquilinosMap.values());

      // Aplicar filtro de busca por nome
      if (searchTerm) {
        inquilinosList = inquilinosList.filter(inquilino =>
          inquilino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquilino.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return inquilinosList;
    },
    enabled: !!user?.id
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'enviada_ao_financeiro', label: 'Enviada ao Financeiro' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'ativa', label: 'Ativa' },
    { value: 'rejeitada', label: 'Rejeitada' },
    { value: 'vencida', label: 'Vencida' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'aprovada':
        return 'bg-blue-100 text-blue-800';
      case 'em_analise':
        return 'bg-yellow-100 text-yellow-800';
      case 'enviada_ao_financeiro':
        return 'bg-purple-100 text-purple-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      case 'vencida':
        return 'bg-gray-100 text-gray-800';
      case 'cancelada':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'Ativa';
      case 'aprovada':
        return 'Aprovada';
      case 'em_analise':
        return 'Em Análise';
      case 'enviada_ao_financeiro':
        return 'Enviada ao Financeiro';
      case 'rejeitada':
        return 'Rejeitada';
      case 'vencida':
        return 'Vencida';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getVerificationColor = (status: 'verificado' | 'pendente') => {
    return status === 'verificado' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getVerificationLabel = (status: 'verificado' | 'pendente') => {
    return status === 'verificado' ? 'Verificado' : 'Verificação Pendente';
  };

  return {
    inquilinos,
    isLoading,
    error,
    refetch,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    getVerificationColor,
    getVerificationLabel
  };
};
