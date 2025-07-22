import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContratoParceria = (imobiliariaId: string) => {
  const { data: contrato, isLoading } = useQuery({
    queryKey: ['contrato-parceria', imobiliariaId],
    queryFn: async () => {
      if (!imobiliariaId) return null;

      const { data, error } = await supabase
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', imobiliariaId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!imobiliariaId
  });

  return {
    contrato,
    isLoading
  };
};