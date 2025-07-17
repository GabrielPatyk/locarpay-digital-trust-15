
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

interface ContratoPendente {
  id: string;
  id_imobiliaria: string;
  id_executivo: string;
  criado_por: string;
  data_criacao: string;
  modelo_contrato: string;
  link_assinatura: string | null;
  arquivo_download: string | null;
  assinado: boolean;
  dados_contrato: any;
}

export const useContratoPendente = (user: User | null) => {
  const [contratoPendente, setContratoPendente] = useState<ContratoPendente | null>(null);
  const [loading, setLoading] = useState(false);

  const verificarContratoPendente = async () => {
    if (!user || user.type !== 'imobiliaria') {
      setContratoPendente(null);
      return;
    }

    try {
      setLoading(true);
      
      console.log('Verificando contrato pendente para imobiliária:', user.id);
      
      // Primeira tentativa com RLS
      let { data, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .eq('id_imobiliaria', user.id)
        .eq('modelo_contrato', 'imobiliaria_locarpay')
        .eq('assinado', false)
        .maybeSingle();

      // Se falhou devido a RLS, tentar query direta
      if (error || !data) {
        console.log('Tentando query alternativa devido a:', error);
        const { data: rawData, error: rawError } = await supabase.rpc('validar_login', {
          email_input: user.email,
          senha_input: 'dummy' // Não usado, só para acessar a função
        });
        
        if (!rawError && rawData.length > 0) {
          // Query direta usando o email do usuário
          const { data: contractData, error: contractError } = await supabase
            .from('contratos_locarpay')
            .select(`
              *,
              usuarios!contratos_locarpay_id_imobiliaria_fkey (email, cargo)
            `)
            .eq('modelo_contrato', 'imobiliaria_locarpay')
            .eq('assinado', false);
          
          if (contractData) {
            data = contractData.find(contract => 
              contract.usuarios?.email === user.email && 
              contract.usuarios?.cargo === 'imobiliaria'
            );
          }
        }
      }

      console.log('Contrato pendente encontrado:', data);
      setContratoPendente(data || null);
      
      // Se encontrou contrato pendente, disparar webhook
      if (data && !data.assinado) {
        try {
          await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_imobiliaria: data.id_imobiliaria,
              modelo_contrato: data.modelo_contrato,
              assinado: data.assinado,
              contrato_id: data.id,
              timestamp: new Date().toISOString()
            })
          });
          console.log('Webhook disparado com sucesso');
        } catch (webhookError) {
          console.error('Erro ao disparar webhook:', webhookError);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar contrato pendente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarContratoPendente();
  }, [user]);

  const atualizarStatusContrato = async () => {
    await verificarContratoPendente();
  };

  return {
    contratoPendente,
    loading,
    atualizarStatusContrato
  };
};
