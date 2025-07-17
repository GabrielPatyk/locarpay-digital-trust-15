
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
      
      // Buscar todos os contratos da imobiliária
      const { data: contratos, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .eq('id_imobiliaria', user.id);

      console.log('Contratos encontrados:', contratos);

      if (error) {
        console.error('Erro ao verificar contrato pendente:', error);
        setContratoPendente(null);
        return;
      }

      // Verificar se existe contrato pendente específico
      const contratoPendente = contratos?.find(c => 
        c.modelo_contrato === 'imobiliaria_locarpay' && 
        c.assinado === false
      );

      if (contratoPendente) {
        console.log('Contrato pendente encontrado:', contratoPendente.modelo_contrato);
        console.log('Status assinado:', contratoPendente.assinado);
        
        setContratoPendente(contratoPendente);
        
        // Disparar webhook para contrato pendente
        console.log('Disparando webhook para contrato pendente...');
        try {
          const response = await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_imobiliaria: contratoPendente.id_imobiliaria,
              modelo_contrato: contratoPendente.modelo_contrato,
              assinado: contratoPendente.assinado,
              contrato_id: contratoPendente.id,
              timestamp: new Date().toISOString()
            })
          });
          console.log('Webhook disparado com sucesso:', response.status);
        } catch (webhookError) {
          console.error('Erro ao disparar webhook:', webhookError);
        }
      } else {
        console.log('Nenhum contrato pendente encontrado');
        setContratoPendente(null);
      }
    } catch (err) {
      console.error('Erro ao verificar contrato pendente:', err);
      setContratoPendente(null);
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
