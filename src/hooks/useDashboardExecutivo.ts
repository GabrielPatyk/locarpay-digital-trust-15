
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardExecutivo = () => {
  const { user } = useAuth();

  const {
    data: dashboardData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['dashboard-executivo', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Buscar imobiliárias do executivo
      const { data: imobiliariasData, error: imobiliariasError } = await supabase
        .from('usuarios')
        .select(`
          id,
          nome,
          email,
          telefone,
          ativo,
          perfil_usuario(*)
        `)
        .eq('criado_por', user.id)
        .eq('cargo', 'imobiliaria')
        .order('criado_em', { ascending: false });

      if (imobiliariasError) throw imobiliariasError;

      const totalImobiliarias = imobiliariasData.length;
      const imobiliariasAtivas = imobiliariasData.filter(i => i.ativo).length;
      const imobiliariaIds = imobiliariasData.map(i => i.id);

      let totalFiancas = 0;
      let valorTotalFiancas = 0;

      // Buscar fianças das imobiliárias do executivo
      if (imobiliariaIds.length > 0) {
        const { data: fiancasData, error: fiancasError } = await supabase
          .from('fiancas_locaticias')
          .select('imovel_valor_aluguel, taxa_aplicada, status_fianca')
          .in('id_imobiliaria', imobiliariaIds);

        if (fiancasError) throw fiancasError;

        totalFiancas = fiancasData.length;
        valorTotalFiancas = fiancasData.reduce((acc, fianca) => {
          const valor = fianca.imovel_valor_aluguel || 0;
          const taxa = fianca.taxa_aplicada || 0;
          return acc + (valor * (taxa / 100));
        }, 0);
      }

      // Adicionar estatísticas às imobiliárias
      const imobiliariasComStats = await Promise.all(
        imobiliariasData.map(async (imobiliaria) => {
          const { data: fiancas, error: fiancasError } = await supabase
            .from('fiancas_locaticias')
            .select('imovel_valor_aluguel, taxa_aplicada')
            .eq('id_imobiliaria', imobiliaria.id);

          if (fiancasError) {
            console.error('Erro ao buscar fianças:', fiancasError);
            return { ...imobiliaria, totalFiancas: 0, valorTotal: 0 };
          }

          const totalFiancasImob = fiancas?.length || 0;
          const valorTotalImob = fiancas?.reduce((acc, fianca) => {
            const valor = fianca.imovel_valor_aluguel || 0;
            const taxa = fianca.taxa_aplicada || 0;
            return acc + (valor * (taxa / 100));
          }, 0) || 0;

          return {
            ...imobiliaria,
            totalFiancas: totalFiancasImob,
            valorTotal: Math.round(valorTotalImob)
          };
        })
      );

      return {
        stats: {
          totalImobiliarias,
          imobiliariasAtivas,
          totalFiancas,
          valorTotalFiancas: Math.round(valorTotalFiancas)
        },
        imobiliarias: imobiliariasComStats
      };
    },
    enabled: !!user?.id
  });

  return {
    dashboardData,
    isLoading,
    error
  };
};
