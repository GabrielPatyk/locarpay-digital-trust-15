import { useQuery } from '@tanstack/react-query';
import { createSupabaseClient } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/AuthContext'; // ou onde você pega o token

export const useContratoParceria = (imobiliariaId: string) => {
  const { session } = useSession(); // precisa ter accessToken aqui

  const { data: contrato, isLoading } = useQuery({
    queryKey: ['contrato-parceria', imobiliariaId],
    queryFn: async () => {
      if (!imobiliariaId || !session?.access_token) return null;

      const supabase = createSupabaseClient(session.access_token);

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
    enabled: !!imobiliariaId && !!session?.access_token
  });

  return {
    contrato,
    isLoading
  };
};
