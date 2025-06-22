
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useImobiliariaData = () => {
  const { user } = useAuth();

  const { data: imobiliaria, isLoading } = useQuery({
    queryKey: ['imobiliaria-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar dados da imobiliária:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });

  return {
    imobiliaria,
    isLoading
  };
};
