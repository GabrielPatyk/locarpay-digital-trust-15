
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const WEBHOOK_URL = 'https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6';

let webhookDisparado = false; // Flag para evitar múltiplos webhooks

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

  const buscarDadosCompletosImobiliaria = async () => {
    if (!user?.id) return null;

    try {
      // Buscar dados do usuário e perfil completo
      const { data: dadosUsuario, error: errorUsuario } = await supabase
        .from('usuarios')
        .select(`
          id,
          nome,
          email,
          telefone,
          cpf,
          cargo,
          ativo,
          verificado,
          criado_em,
          perfil_usuario (
            nome_empresa,
            cnpj,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            pais
          )
        `)
        .eq('id', user.id)
        .single();

      if (errorUsuario) {
        console.error('Erro ao buscar dados da imobiliária:', errorUsuario);
        return null;
      }

      return dadosUsuario;
    } catch (error) {
      console.error('Erro ao buscar dados completos da imobiliária:', error);
      return null;
    }
  };

  const dispararWebhook = async (contratoData: any) => {
    // Evitar múltiplos disparos do webhook
    if (webhookDisparado) {
      console.log('Webhook já foi disparado, ignorando...');
      return;
    }

    try {
      console.log('Disparando webhook para:', WEBHOOK_URL);
      webhookDisparado = true; // Marcar como disparado
      
      // Buscar dados completos da imobiliária
      const dadosCompletos = await buscarDadosCompletosImobiliaria();
      
      if (!dadosCompletos) {
        console.error('Não foi possível buscar dados completos da imobiliária');
        webhookDisparado = false; // Resetar em caso de erro
        return;
      }

      const payload = {
        evento: 'contrato_pendente',
        timestamp: new Date().toISOString(),
        imobiliaria: {
          id: dadosCompletos.id,
          nome_responsavel: dadosCompletos.nome,
          email: dadosCompletos.email,
          telefone: dadosCompletos.telefone,
          cpf: dadosCompletos.cpf,
          cargo: dadosCompletos.cargo,
          ativo: dadosCompletos.ativo,
          verificado: dadosCompletos.verificado,
          criado_em: dadosCompletos.criado_em,
          // Dados do perfil da empresa
          nome_empresa: dadosCompletos.perfil_usuario?.nome_empresa || null,
          cnpj: dadosCompletos.perfil_usuario?.cnpj || null,
          endereco: dadosCompletos.perfil_usuario?.endereco || null,
          numero: dadosCompletos.perfil_usuario?.numero || null,
          complemento: dadosCompletos.perfil_usuario?.complemento || null,
          bairro: dadosCompletos.perfil_usuario?.bairro || null,
          cidade: dadosCompletos.perfil_usuario?.cidade || null,
          estado: dadosCompletos.perfil_usuario?.estado || null,
          pais: dadosCompletos.perfil_usuario?.pais || null
        },
        contrato: contratoData
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('Webhook retornou status:', response.status);
        webhookDisparado = false; // Resetar em caso de erro
      } else {
        console.log('Webhook disparado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao disparar webhook:', error);
      webhookDisparado = false; // Resetar em caso de erro
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
      
      // Verificar se há contratos pendentes e disparar webhook apenas uma vez
      const contratosPendentes = contratos.filter(contrato => contrato.status === 'pendente');
      if (contratosPendentes.length > 0 && !webhookDisparado) {
        console.log('Encontrados contratos pendentes, disparando webhook...');
        // Disparar webhook apenas para o primeiro contrato pendente
        await dispararWebhook(contratosPendentes[0]);
      }
    }
  };

  const temContratoPendente = () => {
    return contratos?.some(contrato => contrato.status === 'pendente') || false;
  };

  const temContratoAssinado = () => {
    return contratos?.some(contrato => contrato.status === 'assinado') || false;
  };

  const getContratoPendente = () => {
    return contratos?.find(contrato => contrato.status === 'pendente') || null;
  };

  const resetWebhookFlag = () => {
    webhookDisparado = false;
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
    temContratoAssinado,
    getContratoPendente,
    resetWebhookFlag
  };
};
