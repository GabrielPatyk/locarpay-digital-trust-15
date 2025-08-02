import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAnalystName = (analystId: string | null) => {
  return useQuery({
    queryKey: ['analyst', analystId],
    queryFn: async () => {
      if (!analystId) return 'Analista Responsável';
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('nome')
        .eq('id', analystId)
        .single();

      if (error || !data) {
        console.error('Erro ao buscar analista:', error);
        return 'Analista Responsável';
      }

      return data.nome;
    },
    enabled: !!analystId
  });
};