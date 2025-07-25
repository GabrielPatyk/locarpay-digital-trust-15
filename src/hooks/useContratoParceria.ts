import { useQuery } from '@tanstack/react-query';
import { createSupabaseClient, supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useContratoParceria = (imobiliariaId: string) => {
  const { user } = useAuth();

  const { data: contrato, isLoading } = useQuery({
    queryKey: ['contrato-parceria', imobiliariaId],
    queryFn: async () => {
      if (!imobiliariaId || !user) return null;

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.access_token) {
        console.error('Erro ao obter sessão:', sessionError);
        return null;
      }

      const supabaseWithToken = createSupabaseClient(sessionData.session.access_token);

      const { data, error } = await supabaseWithToken
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', imobiliariaId);

      if (error) {
        console.error('Erro Supabase:', error);
        throw error;
      }

      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!imobiliariaId && !!user
  });

  return {
    contrato,
    isLoading
  };
};
