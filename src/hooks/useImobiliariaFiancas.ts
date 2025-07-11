
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FiancaImobiliaria {
  id: string;
  inquilino_nome_completo: string;
  inquilino_cpf: string;
  status_fianca: string;
  valor_fianca: number;
  imovel_valor_aluguel: number;
  imovel_tempo_locacao: number;
  data_criacao: string;
}

export const useImobiliariaFiancas = (imobiliariaId: string) => {
  const { data: fiancas = [], isLoading, error } = useQuery({
    queryKey: ['imobiliaria-fiancas', imobiliariaId],
    queryFn: async () => {
      if (!imobiliariaId) return [];

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          id,
          inquilino_nome_completo,
          inquilino_cpf,
          status_fianca,
          valor_fianca,
          imovel_valor_aluguel,
          imovel_tempo_locacao,
          data_criacao
        `)
        .eq('id_imobiliaria', imobiliariaId)
        .order('data_criacao', { ascending: false });

      if (error) throw error;

      return data as FiancaImobiliaria[];
    },
    enabled: !!imobiliariaId
  });

  return {
    fiancas,
    isLoading,
    error
  };
};
