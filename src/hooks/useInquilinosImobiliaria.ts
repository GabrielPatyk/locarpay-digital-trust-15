
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type StatusFianca = Database['public']['Enums']['status_fianca'];

export interface InquilinoFianca {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  statusAtivo: boolean;
  statusVerificacao: 'verificado' | 'pendente';
  valorAluguel: number;
  valorUltimaFianca: number;
  dataInicio: string;
  fiancaId: string;
  totalFiancas: number;
  usuarioId?: string;
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
          valor_fianca,
          data_criacao,
          inquilino_usuario_id
        `)
        .eq('id_imobiliaria', user.id);

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
            inquilino.valorAluguel = fianca.imovel_valor_aluguel;
            inquilino.valorUltimaFianca = fianca.valor_fianca || fianca.imovel_valor_aluguel;
            inquilino.dataInicio = fianca.data_criacao;
            inquilino.fiancaId = fianca.id;
          }
        } else {
          // Buscar dados do usuário se existir
          let statusVerificacao: 'verificado' | 'pendente' = 'pendente';
          let statusAtivo = false;
          let usuarioId = '';
          
          if (fianca.inquilino_usuario_id) {
            const { data: usuario } = await supabase
              .from('usuarios')
              .select('verificado, ativo, id')
              .eq('id', fianca.inquilino_usuario_id)
              .single();
            
            if (usuario) {
              statusVerificacao = usuario.verificado ? 'verificado' : 'pendente';
              statusAtivo = usuario.ativo;
              usuarioId = usuario.id;
            }
          }

          inquilinosMap.set(key, {
            id: key,
            nome: fianca.inquilino_nome_completo,
            email: fianca.inquilino_email || '',
            telefone: fianca.inquilino_whatsapp || '',
            cpf: fianca.inquilino_cpf,
            statusAtivo,
            statusVerificacao,
            valorAluguel: fianca.imovel_valor_aluguel,
            valorUltimaFianca: fianca.valor_fianca || fianca.imovel_valor_aluguel,
            dataInicio: fianca.data_criacao,
            fiancaId: fianca.id,
            totalFiancas: 1,
            usuarioId
          });
        }
      }

      let inquilinosList = Array.from(inquilinosMap.values());

      // Aplicar filtro de busca por nome, email ou CPF
      if (searchTerm) {
        inquilinosList = inquilinosList.filter(inquilino =>
          inquilino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquilino.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquilino.cpf.includes(searchTerm)
        );
      }

      // Aplicar filtro de status
      if (statusFilter && statusFilter !== 'todos') {
        inquilinosList = inquilinosList.filter(inquilino => {
          switch (statusFilter) {
            case 'verificado':
              return inquilino.statusVerificacao === 'verificado';
            case 'pendente':
              return inquilino.statusVerificacao === 'pendente';
            case 'ativo':
              return inquilino.statusAtivo === true;
            case 'inativo':
              return inquilino.statusAtivo === false;
            default:
              return true;
          }
        });
      }

      return inquilinosList;
    },
    enabled: !!user?.id
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'verificado', label: 'Verificado' },
    { value: 'pendente', label: 'Verificação Pendente' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' }
  ];

  const getStatusColor = (ativo: boolean) => {
    return ativo 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (ativo: boolean) => {
    return ativo ? 'Ativo' : 'Inativo';
  };

  const getVerificationColor = (status: 'verificado' | 'pendente') => {
    return status === 'verificado' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getVerificationLabel = (status: 'verificado' | 'pendente') => {
    return status === 'verificado' ? 'Verificado' : 'Verificação Pendente';
  };

  // Calcular estatísticas para o dashboard
  const stats = {
    total: inquilinos.length,
    ativos: inquilinos.filter(i => i.statusAtivo).length,
    inativos: inquilinos.filter(i => !i.statusAtivo).length,
    verificacaoPendente: inquilinos.filter(i => i.statusVerificacao === 'pendente').length
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
    getVerificationLabel,
    stats
  };
};
