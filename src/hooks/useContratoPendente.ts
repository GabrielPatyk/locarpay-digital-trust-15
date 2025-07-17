
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { Tables } from '@/integrations/supabase/types';

type ContratoPendente = Tables<'contratos_imobiliaria_locarpay'>;

export const useContratoPendente = (user: User | null) => {
  const [contratoPendente, setContratoPendente] = useState<ContratoPendente | null>(null);
  const [loading, setLoading] = useState(false);

  const verificarContratoPendente = async () => {
    if (!user || user.type !== 'imobiliaria') {
      console.log('Usuário não é imobiliária ou não logado');
      setContratoPendente(null);
      return;
    }

    try {
      setLoading(true);
      console.log('Verificando contrato pendente para imobiliária:', user.id);
      
      // Buscar todos os contratos da imobiliária
      const { data: contratos, error } = await supabase
        .from('contratos_imobiliaria_locarpay')
        .select('*')
        .eq('id_imobiliaria', user.id);

      if (error) {
        console.error('Erro ao verificar contratos:', error);
        return;
      }

      console.log('Todos os contratos encontrados:', contratos);

      // Filtrar contrato específico não assinado
      const contratoPendente = contratos?.find(c => 
        c.modelo_contrato === 'imobiliaria_locarpay' && 
        c.assinado === false
      );

      if (contratoPendente) {
        console.log('Contrato pendente encontrado:', contratoPendente.modelo_contrato);
        
        // Enviar webhook quando encontrar contrato pendente
        try {
          await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              evento: 'contrato_pendente_detectado',
              id_imobiliaria: user.id,
              id_contrato: contratoPendente.id,
              modelo_contrato: contratoPendente.modelo_contrato,
              timestamp: new Date().toISOString()
            })
          });
          console.log('Webhook enviado com sucesso');
        } catch (webhookError) {
          console.error('Erro ao enviar webhook:', webhookError);
        }
      } else {
        console.log('Nenhum contrato pendente encontrado');
      }

      setContratoPendente(contratoPendente || null);
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
