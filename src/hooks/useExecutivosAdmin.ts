
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ExecutivoAdmin {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  ativo: boolean;
  criado_em: string;
  imobiliarias_count: number;
  fiancas_count: number;
  valor_total_fiancas: number;
}

export const useExecutivosAdmin = (searchTerm: string = '', statusFilter: string = '') => {
  const { user } = useAuth();

  const { data: executivos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['executivos-admin', searchTerm, statusFilter],
    queryFn: async () => {
      if (!user?.id) return [];

      console.log('Buscando executivos...');
      
      // Buscar executivos
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

      if (executivosError) {
        console.error('Erro ao buscar executivos:', executivosError);
        throw executivosError;
      }

      console.log('Executivos encontrados:', executivosData?.length || 0);

      // Para cada executivo, buscar estatísticas
      const executivosComStats = await Promise.all(
        (executivosData || []).map(async (executivo) => {
          // Contar imobiliárias criadas por este executivo
          const { count: imobiliariasCount } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('cargo', 'imobiliaria')
            .eq('criado_por', executivo.id);

          // Contar fianças das imobiliárias criadas por este executivo
          const { data: fiancasData } = await supabase
            .from('fiancas_locaticias')
            .select('valor_fianca, imovel_valor_aluguel')
            .in(
              'id_imobiliaria',
              // Buscar IDs das imobiliárias criadas por este executivo
              await supabase
                .from('usuarios')
                .select('id')
                .eq('cargo', 'imobiliaria')
                .eq('criado_por', executivo.id)
                .then(({ data }) => data?.map(u => u.id) || [])
            );

          const fiancasCount = fiancasData?.length || 0;
          const valorTotalFiancas = fiancasData?.reduce((sum, f) => sum + (f.valor_fianca || f.imovel_valor_aluguel || 0), 0) || 0;

          return {
            ...executivo,
            imobiliarias_count: imobiliariasCount || 0,
            fiancas_count: fiancasCount,
            valor_total_fiancas: valorTotalFiancas
          };
        })
      );

      // Aplicar filtros de busca
      let filteredExecutivos = executivosComStats;
      
      if (searchTerm) {
        filteredExecutivos = filteredExecutivos.filter(executivo =>
          executivo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          executivo.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro de status
      if (statusFilter && statusFilter !== 'todos') {
        filteredExecutivos = filteredExecutivos.filter(executivo => {
          if (statusFilter === 'ativo') return executivo.ativo;
          if (statusFilter === 'inativo') return !executivo.ativo;
          return true;
        });
      }

      return filteredExecutivos as ExecutivoAdmin[];
    },
    enabled: !!user?.id
  });

  const getStatusOptions = () => [
    { value: 'todos', label: 'Todos' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' }
  ];

  const getStats = () => {
    const totalExecutivos = executivos.length;
    const ativos = executivos.filter(e => e.ativo).length;
    const totalImobiliarias = executivos.reduce((sum, e) => sum + e.imobiliarias_count, 0);
    const performanceMedia = totalExecutivos > 0 ? Math.round((ativos / totalExecutivos) * 100) : 0;

    return {
      totalExecutivos,
      ativos,
      performanceMedia,
      totalImobiliarias
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return {
    executivos,
    isLoading,
    error,
    refetch,
    getStatusOptions,
    getStats,
    formatCurrency
  };
};
