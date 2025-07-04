
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useContratosLocarpay = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contratos, isLoading, error } = useQuery({
    queryKey: ['contratos-locarpay', user?.id],
    queryFn: async () => {
      if (!user?.id || user?.type !== 'imobiliaria') {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('contratos_locarpay')
          .select('*')
          .eq('imobiliaria_id', user.id);

        if (error) {
          console.error('Erro ao buscar contratos:', error);
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error('Erro na query de contratos:', err);
        return [];
      }
    },
    enabled: !!user?.id && user?.type === 'imobiliaria',
    retry: 1,
    staleTime: 30000 // 30 segundos
  });

  const criarContratoPendente = useMutation({
    mutationFn: async () => {
      if (!user?.id || user?.type !== 'imobiliaria') {
        throw new Error('Usuário deve ser uma imobiliária');
      }

      console.log('Tentando criar contrato pendente para imobiliária:', user.id);

      const { data, error } = await supabase
        .from('contratos_locarpay')
        .insert({
          imobiliaria_id: user.id,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar contrato pendente:', error);
        throw error;
      }

      console.log('Contrato pendente criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-locarpay', user?.id] });
    },
    onError: (error) => {
      console.error('Erro na mutação de criar contrato:', error);
    }
  });

  const verificarECriarContrato = async () => {
    if (!user?.id || user?.type !== 'imobiliaria') {
      console.log('Usuário não é imobiliária, pulando verificação de contrato');
      return;
    }

    // Aguardar carregamento terminar
    if (isLoading) {
      console.log('Ainda carregando contratos, aguardando...');
      return;
    }

    // Verificar se há erro na consulta
    if (error) {
      console.error('Erro ao consultar contratos:', error);
      return;
    }

    // Se não tem contratos, criar um pendente
    if (!contratos || contratos.length === 0) {
      console.log('Nenhum contrato encontrado para a imobiliária, criando contrato pendente...');
      try {
        await criarContratoPendente.mutateAsync();
      } catch (err) {
        console.error('Erro ao criar contrato pendente:', err);
      }
    } else {
      console.log(`Encontrados ${contratos.length} contratos para a imobiliária`);
    }
  };

  return {
    contratos: contratos || [],
    isLoading,
    error,
    verificarECriarContrato,
    criarContratoPendente: criarContratoPendente.mutate,
    isCreating: criarContratoPendente.isPending,
    hasError: !!error || !!criarContratoPendente.error
  };
};
