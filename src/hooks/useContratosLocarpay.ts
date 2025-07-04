
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const WEBHOOK_URL = 'https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6';

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
          throw error;
        }
        
        console.log('Contratos encontrados:', data);
        return data || [];
      } catch (err) {
        console.error('Erro na query de contratos:', err);
        throw err;
      }
    },
    enabled: !!user?.id && user?.type === 'imobiliaria',
    retry: 2,
    staleTime: 30000 // 30 segundos
  });

  const dispararWebhook = async (contratoData: any) => {
    try {
      console.log('Disparando webhook para:', WEBHOOK_URL);
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evento: 'contrato_pendente',
          imobiliaria_id: user?.id,
          imobiliaria_nome: user?.name,
          contrato: contratoData,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        console.warn('Webhook retornou status:', response.status);
      } else {
        console.log('Webhook disparado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao disparar webhook:', error);
    }
  };

  const criarContratoPendente = useMutation({
    mutationFn: async () => {
      if (!user?.id || user?.type !== 'imobiliaria') {
        throw new Error('Usuário deve ser uma imobiliária');
      }

      console.log('Criando contrato pendente para imobiliária:', user.id);

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
      
      // Disparar webhook após criar o contrato
      await dispararWebhook(data);
      
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
        console.log('Contrato pendente criado automaticamente');
      } catch (err) {
        console.error('Erro ao criar contrato pendente automaticamente:', err);
      }
    } else {
      console.log(`Encontrados ${contratos.length} contratos para a imobiliária`);
      
      // Verificar se há contratos pendentes e disparar webhook
      const contratosPendentes = contratos.filter(contrato => contrato.status === 'pendente');
      if (contratosPendentes.length > 0) {
        console.log('Encontrados contratos pendentes, disparando webhook...');
        for (const contrato of contratosPendentes) {
          await dispararWebhook(contrato);
        }
      }
    }
  };

  const temContratoPendente = () => {
    return contratos?.some(contrato => contrato.status === 'pendente') || false;
  };

  const getContratoPendente = () => {
    return contratos?.find(contrato => contrato.status === 'pendente') || null;
  };

  return {
    contratos: contratos || [],
    isLoading,
    error,
    verificarECriarContrato,
    criarContratoPendente: criarContratoPendente.mutate,
    isCreating: criarContratoPendente.isPending,
    hasError: !!error || !!criarContratoPendente.error,
    temContratoPendente,
    getContratoPendente
  };
};
