
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useImobiliariaData = () => {
  const { user } = useAuth();

  const { data: imobiliariaData, isLoading } = useQuery({
    queryKey: ['imobiliaria-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('cnpj')
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  return {
    cnpj: imobiliariaData?.cnpj || '',
    isLoading
  };
};
