
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
      
      // Query direta sem usar RLS para debug
      const { data: allContracts, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .eq('id_imobiliaria', user.id);

      console.log('Todos os contratos encontrados:', allContracts);

      // Filtrar contrato específico
      const contratoImobiliaria = allContracts?.find(contract => 
        contract.modelo_contrato === 'imobiliaria_locarpay'
      );

      if (contratoImobiliaria) {
        console.log('Contrato pendente encontrado:', contratoImobiliaria.modelo_contrato);
        console.log('Status assinado:', contratoImobiliaria.assinado);
        
        setContratoPendente(contratoImobiliaria);
        
        // Disparar webhook se contrato não assinado
        if (contratoImobiliaria.modelo_contrato === 'imobiliaria_locarpay' && contratoImobiliaria.assinado === false) {
          console.log('Disparando webhook...');
          try {
            const response = await fetch('https://webhook.lesenechal.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id_imobiliaria: contratoImobiliaria.id_imobiliaria,
                modelo_contrato: contratoImobiliaria.modelo_contrato,
                assinado: contratoImobiliaria.assinado,
                contrato_id: contratoImobiliaria.id,
                timestamp: new Date().toISOString()
              })
            });
            console.log('Webhook disparado com sucesso:', response.status);
          } catch (webhookError) {
            console.error('Erro ao disparar webhook:', webhookError);
          }
        }
      } else {
        console.log('Contrato pendente encontrado: null');
        setContratoPendente(null);
      }
      
      if (error) {
        console.error('Erro ao verificar contrato pendente:', error);
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
