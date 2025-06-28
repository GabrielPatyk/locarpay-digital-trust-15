
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExecutivoAdmin {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  totalImobiliarias: number;
  imobiliariasAtivas: number;
  dataUltimoLogin: string;
  dataCriacao: string;
}

export const useExecutivosAdmin = (searchTerm: string = '', statusFilter: string = '') => {
  const { data: executivos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['executivos-admin', searchTerm, statusFilter],
    queryFn: async () => {
      // Buscar todos os usuários com cargo 'executivo'
      let query = supabase
        .from('usuarios')
        .select(`
          id,
          nome,
          email,
          telefone,
          ativo,
          criado_em
        `)
        .eq('cargo', 'executivo')
        .order('nome', { ascending: true });

      const { data: executivosData, error: executivosError } = await query;

      if (executivosError) throw executivosError;

      // Para cada executivo, buscar suas imobiliárias
      const executivosComImobiliarias = await Promise.all(
        (executivosData || []).map(async (executivo) => {
          const { data: imobiliarias, error: imobiliariasError } = await supabase
            .from('usuarios')
            .select('id, ativo')
            .eq('criado_por', executivo.id)
            .eq('cargo', 'imobiliaria');

          if (imobiliariasError) {
            console.error('Erro ao buscar imobiliárias:', imobiliariasError);
          }

          const totalImobiliarias = imobiliarias?.length || 0;
          const imobiliariasAtivas = imobiliarias?.filter(i => i.ativo).length || 0;

          return {
            id: executivo.id,
            nome: executivo.nome,
            email: executivo.email,
            telefone: executivo.telefone || '',
            status: executivo.ativo ? 'ativo' as const : 'inativo' as const,
            totalImobiliarias,
            imobiliariasAtivas,
            dataUltimoLogin: executivo.criado_em, // Temporário, até implementar último login
            dataCriacao: executivo.criado_em
          };
        })
      );

      let filteredExecutivos = executivosComImobiliarias;

      // Aplicar filtro de busca
      if (searchTerm) {
        filteredExecutivos = filteredExecutivos.filter(executivo =>
          executivo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          executivo.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de status
      if (statusFilter && statusFilter !== 'todos') {
        filteredExecutivos = filteredExecutivos.filter(executivo => {
          switch (statusFilter) {
            case 'ativo':
              return executivo.status === 'ativo';
            case 'inativo':
              return executivo.status === 'inativo';
            case 'sem_imobiliarias':
              return executivo.totalImobiliarias === 0;
            case 'com_imobiliarias':
              return executivo.totalImobiliarias > 0;
            default:
              return true;
          }
        });
      }

      return filteredExecutivos;
    }
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'com_imobiliarias', label: 'Com Imobiliárias' },
    { value: 'sem_imobiliarias', label: 'Sem Imobiliárias' }
  ];

  const getStatusColor = (status: 'ativo' | 'inativo') => {
    return status === 'ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (status: 'ativo' | 'inativo') => {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  };

  // Calcular estatísticas para o dashboard
  const stats = {
    total: executivos.length,
    ativos: executivos.filter(e => e.status === 'ativo').length,
    inativos: executivos.filter(e => e.status === 'inativo').length,
    totalImobiliarias: executivos.reduce((sum, e) => sum + e.totalImobiliarias, 0),
    performanceMedia: executivos.length > 0 ? 
      Math.round(
        executivos.reduce((sum, e) => sum + (e.imobiliariasAtivas / Math.max(e.totalImobiliarias, 1)) * 100, 0) / 
        executivos.length
      ) : 0
  };

  return {
    executivos,
    isLoading,
    error,
    refetch,
    getStatusOptions,
    getStatusColor,
    getStatusLabel,
    stats
  };
};
