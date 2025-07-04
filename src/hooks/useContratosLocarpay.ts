
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useContratosLocarpay = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contratos, isLoading } = useQuery({
    queryKey: ['contratos-locarpay', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .eq('imobiliaria_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && user?.type === 'imobiliaria'
  });

  const criarContratoPendente = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não encontrado');

      const { data, error } = await supabase
        .from('contratos_locarpay')
        .insert({
          imobiliaria_id: user.id,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-locarpay', user?.id] });
    }
  });

  const verificarECriarContrato = async () => {
    if (!user?.id || user?.type !== 'imobiliaria') return;

    // Se ainda está carregando, aguarda
    if (isLoading) return;

    // Se não tem contratos, cria um pendente
    if (!contratos || contratos.length === 0) {
      console.log('Nenhum contrato encontrado para a imobiliária, criando contrato pendente...');
      await criarContratoPendente.mutateAsync();
    }
  };

  return {
    contratos: contratos || [],
    isLoading,
    verificarECriarContrato,
    criarContratoPendente: criarContratoPendente.mutate,
    isCreating: criarContratoPendente.isPending
  };
};
