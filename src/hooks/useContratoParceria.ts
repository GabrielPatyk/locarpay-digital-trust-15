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
        .eq('imobiliaria_id', imobiliariaId);

      if (error) {
        throw error;
      }

      // Retorna o primeiro item do array ou null se não houver dados
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!imobiliariaId
  });

  return {
    contrato,
    isLoading
  };
};