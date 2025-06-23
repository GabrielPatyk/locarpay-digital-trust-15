
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useInquilinoData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar fiança ativa do inquilino
  const { data: fiancaAtiva, isLoading: isLoadingFianca, error: errorFianca } = useQuery({
    queryKey: ['fianca-ativa', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log('Buscando fiança ativa para usuário:', user.id);

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_usuario_id', user.id)
        .eq('status_fianca', 'ativa')
        .order('data_criacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar fiança ativa:', error);
        throw error;
      }
      
      console.log('Fiança ativa encontrada:', data);
      return data;
    },
    enabled: !!user?.id
  });

  // Buscar fiança com pagamento disponível
  const { data: fiancaPagamento, isLoading: isLoadingPagamento, error: errorPagamento } = useQuery({
    queryKey: ['fianca-pagamento', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log('Buscando fiança com pagamento disponível para usuário:', user.id);

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_usuario_id', user.id)
        .in('status_fianca', ['pagamento_disponivel', 'comprovante_enviado'])
        .order('data_criacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar fiança pagamento:', error);
        throw error;
      }
      
      console.log('Fiança pagamento encontrada:', data);
      return data;
    },
    enabled: !!user?.id
  });

  // Verificar se o email do usuário está verificado
  const { data: emailVerificado, error: errorEmail } = useQuery({
    queryKey: ['email-verificado', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      console.log('Verificando email para usuário:', user.id);

      const { data, error } = await supabase
        .from('usuarios')
        .select('verificado')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao verificar email:', error);
        throw error;
      }
      
      console.log('Status de verificação do email:', data?.verificado);
      return data?.verificado || false;
    },
    enabled: !!user?.id
  });

  // Mutation para enviar comprovante
  const enviarComprovante = useMutation({
    mutationFn: async ({ fiancaId, comprovantePath }: { fiancaId: string; comprovantePath: string }) => {
      console.log('Enviando comprovante para fiança:', fiancaId);
      
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          comprovante_pagamento: comprovantePath,
          data_comprovante: new Date().toISOString(),
          status_fianca: 'comprovante_enviado'
        })
        .eq('id', fiancaId);

      if (error) {
        console.error('Erro ao enviar comprovante:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Comprovante enviado!",
        description: "Seu comprovante foi enviado e está sendo analisado.",
      });
      queryClient.invalidateQueries({ queryKey: ['fianca-pagamento'] });
    },
    onError: (error: any) => {
      console.error('Erro na mutation:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar comprovante: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Log de erros para debug
  if (errorFianca) console.error('Erro na query fiança ativa:', errorFianca);
  if (errorPagamento) console.error('Erro na query fiança pagamento:', errorPagamento);
  if (errorEmail) console.error('Erro na query email verificado:', errorEmail);

  return {
    fiancaAtiva,
    fiancaPagamento,
    emailVerificado,
    isLoading: isLoadingFianca || isLoadingPagamento,
    enviarComprovante,
    errors: {
      fiancaError: errorFianca,
      pagamentoError: errorPagamento,
      emailError: errorEmail
    }
  };
};
