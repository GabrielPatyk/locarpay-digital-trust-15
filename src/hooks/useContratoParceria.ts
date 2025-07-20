
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

      const { data, error } = await supabase
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as ContratoParceria | null;
    },
    enabled: !!user?.id && user.type === 'imobiliaria'
  });

  const criarContratoMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não encontrado');

      // Criar o contrato na base de dados
      const { data: novoContrato, error: contratoError } = await supabase
        .from('contratos_parceria')
        .insert({
          imobiliaria_id: user.id,
          status_assinatura: 'pendente'
        })
        .select()
        .single();

      if (contratoError) throw contratoError;

      // Buscar dados completos da imobiliária
      const { data: perfilData } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .maybeSingle();

      // Preparar dados para o webhook
      const webhookData = {
        imobiliaria_id: user.id,
        contrato_status: 'pendente',
        evento: 'primeiro_acesso_plataforma',
        imobiliaria: {
          id: user.id,
          nome: user.name,
          email: user.email,
          telefone: user.telefone,
          cnpj: perfilData?.cnpj,
          endereco: perfilData?.endereco,
          numero: perfilData?.numero,
          complemento: perfilData?.complemento,
          bairro: perfilData?.bairro,
          cidade: perfilData?.cidade,
          estado: perfilData?.estado,
          pais: perfilData?.pais,
          nome_empresa: perfilData?.nome_empresa
        }
      };

      // Enviar webhook
      try {
        await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });
      } catch (webhookError) {
        console.warn('Erro ao enviar webhook:', webhookError);
        // Não falhar a criação do contrato por causa do webhook
      }

      return novoContrato;
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
