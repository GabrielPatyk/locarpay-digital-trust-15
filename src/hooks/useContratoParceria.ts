
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ContratoParceria {
  id: string;
  imobiliaria_id: string;
  status_assinatura: 'pendente' | 'assinado';
  link_assinatura: string | null;
  documento_assinado_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useContratoParceria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contrato, isLoading, error } = useQuery({
    queryKey: ['contrato-parceria', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Usar service role key para operações administrativas
      const { data, error } = await supabase
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar contrato:', error);
        return null;
      }
      return data as ContratoParceria | null;
    },
    enabled: !!user?.id && user.type === 'imobiliaria'
  });

  const criarContratoMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não encontrado');

      // Chamar edge function para criar contrato
      const { data, error } = await supabase.functions.invoke('criar-contrato-parceria', {
        body: { imobiliaria_id: user.id }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contrato-parceria'] });
      toast({
        title: 'Contrato criado',
        description: 'Contrato de parceria criado. Aguarde a geração do link de assinatura.',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar contrato:', error);
      toast({
        title: 'Erro ao criar contrato',
        description: 'Não foi possível criar o contrato de parceria.',
        variant: 'destructive',
      });
    }
  });

  // Criar contrato automaticamente se não existir
  useEffect(() => {
    if (user?.type === 'imobiliaria' && !isLoading && !contrato && !error) {
      criarContratoMutation.mutate();
    }
  }, [user, contrato, isLoading, error]);

  const podeAcessarPlataforma = () => {
    if (user?.type !== 'imobiliaria') return true;
    return contrato?.status_assinatura === 'assinado';
  };

  const precisaAssinarContrato = () => {
    if (user?.type !== 'imobiliaria') return false;
    return !contrato || contrato.status_assinatura === 'pendente';
  };

  return {
    contrato,
    isLoading: isLoading || criarContratoMutation.isPending,
    error,
    podeAcessarPlataforma,
    precisaAssinarContrato,
    criarContrato: criarContratoMutation.mutate
  };
};
