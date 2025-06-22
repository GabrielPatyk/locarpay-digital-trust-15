
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useInquilinoData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar fiança ativa do inquilino
  const { data: fiancaAtiva, isLoading: isLoadingFianca } = useQuery({
    queryKey: ['fianca-ativa', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_usuario_id', user.id)
        .eq('status_fianca', 'ativa')
        .order('data_criacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Buscar fiança com pagamento disponível
  const { data: fiancaPagamento, isLoading: isLoadingPagamento } = useQuery({
    queryKey: ['fianca-pagamento', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_usuario_id', user.id)
        .eq('status_fianca', 'pagamento_disponivel')
        .order('data_criacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Verificar se o email do usuário está verificado
  const { data: emailVerificado } = useQuery({
    queryKey: ['email-verificado', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('usuarios')
        .select('verificado')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data.verificado || false;
    },
    enabled: !!user?.id
  });

  // Mutation para enviar comprovante
  const enviarComprovante = useMutation({
    mutationFn: async ({ fiancaId, comprovantePath }: { fiancaId: string; comprovantePath: string }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          comprovante_pagamento: comprovantePath,
          data_comprovante: new Date().toISOString(),
          status_fianca: 'comprovante_enviado'
        })
        .eq('id', fiancaId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Comprovante enviado!",
        description: "Seu comprovante foi enviado e está sendo analisado.",
      });
      queryClient.invalidateQueries({ queryKey: ['fianca-pagamento'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao enviar comprovante: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    fiancaAtiva,
    fiancaPagamento,
    emailVerificado,
    isLoading: isLoadingFianca || isLoadingPagamento,
    enviarComprovante
  };
};
