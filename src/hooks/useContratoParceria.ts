import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContratoParceria = (imobiliariaId: string) => {
  const { data: contrato, isLoading } = useQuery({
    queryKey: ['contrato-parceria', imobiliariaId],
    queryFn: async () => {
      if (!imobiliariaId) return null;

      const { data, error } = await supabase
        .from('contratos_parceria')
        .select('*')
        .eq('imobiliaria_id', imobiliariaId);

      if (error) {
        throw error;
      }

      // Se não houver contrato, criar um novo e disparar webhook
      if (!data || data.length === 0) {
        // Buscar dados da imobiliária
        const { data: imobiliariaData, error: imobiliariaError } = await supabase
          .from('usuarios')
          .select('*, perfil_usuario(*)')
          .eq('id', imobiliariaId)
          .single();

        if (imobiliariaError || !imobiliariaData) {
          console.error('Erro ao buscar dados da imobiliária:', imobiliariaError);
          return null;
        }

        // Criar novo contrato
        const { data: novoContrato, error: contratoError } = await supabase
          .from('contratos_parceria')
          .insert({
            imobiliaria_id: imobiliariaId,
            status_assinatura: 'pendente'
          })
          .select()
          .single();

        if (contratoError) {
          console.error('Erro ao criar contrato:', contratoError);
          return null;
        }

        // Disparar webhook com os dados da imobiliária
        try {
          const webhookData = {
            ...imobiliariaData,
            perfil: imobiliariaData.perfil_usuario?.[0] || null
          };

          await fetch('https://webhook.locarpay.com.br/webhook/ae5ec49a-0e3e-4122-afec-101b2984f9a6', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
          });
        } catch (webhookError) {
          console.error('Erro ao disparar webhook:', webhookError);
        }

        return novoContrato;
      }

      // Retorna o primeiro item do array
      return data[0];
    },
    enabled: !!imobiliariaId
  });

  return {
    contrato,
    isLoading
  };
};