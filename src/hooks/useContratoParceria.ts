import { useQuery } from '@tanstack/react-query';
import { createSupabaseClient } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useContratoParceria = (imobiliariaId: string) => {
  const { user } = useAuth();

  const { data: contrato, isLoading } = useQuery({
    queryKey: ['contrato-parceria', imobiliariaId],
    queryFn: async () => {
      if (!imobiliariaId || !user?.access_token) return null;

      const supabase = createSupabaseClient(user.access_token);

      const { data, error } = await supabase
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', imobiliariaId);

      if (error) {
        console.error('Erro Supabase:', error);
        throw error;
      }

      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!imobiliariaId && !!user?.access_token
  });

  return {
    contrato,
    isLoading
  };
};
