
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContratoParceria {
  id: string;
  imobiliaria_id: string;
  status_assinatura: 'pendente' | 'assinado';
  link_assinatura?: string;
  documento_assinado_url?: string;
  created_at: string;
  updated_at: string;
}

export const useContratoParceria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contrato, setContrato] = useState<ContratoParceria | null>(null);
  const [loading, setLoading] = useState(true);
  const [criandoContrato, setCriandoContrato] = useState(false);

  const criarContratoEDispararWebhook = async () => {
    if (!user || user.type !== 'imobiliaria') return null;

    setCriandoContrato(true);
    
    try {
      console.log('Criando contrato para imobiliária:', user.id);

      // Primeiro, criar o contrato
      const { data: novoContrato, error: erroContrato } = await supabase
        .from('contratos_parceria')
        .insert({
          imobiliaria_id: user.id,
          status_assinatura: 'pendente'
        })
        .select()
        .single();

      if (erroContrato) {
        console.error('Erro ao criar contrato:', erroContrato);
        throw erroContrato;
      }

      console.log('Contrato criado:', novoContrato);

      // Disparar webhook
      try {
        const webhookData = {
          imobiliaria_id: user.id,
          contrato_status: 'pendente',
          evento: 'primeiro_acesso_plataforma',
          imobiliaria: {
            id: user.id,
            nome: user.name,
            email: user.email,
            telefone: user.telefone,
            cargo: user.type,
            ativo: user.ativo,
            verificado: user.verificado,
            criado_em: user.created_at,
            imagem_perfil: user.imagem_perfil
          }
        };

        console.log('Disparando webhook com dados:', webhookData);

        const webhookResponse = await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });

        if (!webhookResponse.ok) {
          console.error('Erro no webhook:', webhookResponse.status, webhookResponse.statusText);
        } else {
          console.log('Webhook disparado com sucesso');
        }
      } catch (webhookError) {
        console.error('Erro ao disparar webhook:', webhookError);
        // Não falha a criação do contrato se o webhook falhar
      }

      setContrato(novoContrato);
      return novoContrato;

    } catch (error) {
      console.error('Erro geral ao criar contrato:', error);
      toast({
        title: "Erro ao criar contrato",
        description: "Não foi possível criar o contrato de parceria. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setCriandoContrato(false);
    }
  };

  const buscarContrato = async () => {
    if (!user || user.type !== 'imobiliaria') {
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando contrato para imobiliária:', user.id);

      const { data, error } = await supabase
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar contrato:', error);
        throw error;
      }

      if (!data) {
        console.log('Contrato não encontrado, criando novo...');
        await criarContratoEDispararWebhook();
      } else {
        console.log('Contrato encontrado:', data);
        setContrato(data);
      }

    } catch (error) {
      console.error('Erro ao buscar contrato:', error);
      toast({
        title: "Erro ao verificar contrato",
        description: "Não foi possível verificar o status do contrato de parceria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.type === 'imobiliaria') {
      buscarContrato();
    } else {
      setLoading(false);
    }
  }, [user]);

  const precisaAssinarContrato = () => {
    return user?.type === 'imobiliaria' && 
           (!contrato || contrato.status_assinatura === 'pendente');
  };

  const contratoAssinado = () => {
    return contrato?.status_assinatura === 'assinado';
  };

  return {
    contrato,
    loading: loading || criandoContrato,
    precisaAssinarContrato,
    contratoAssinado,
    buscarContrato
  };
};
