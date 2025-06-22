
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFileUpload } from './useFileUpload';

export const useInquilinoData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { uploadFile } = useFileUpload();

  const { data: fiancas = [], isLoading } = useQuery({
    queryKey: ['inquilino-fiancas', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_usuario_id', user.id)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar fianças do inquilino:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });

  const enviarComprovante = useMutation({
    mutationFn: async ({ fiancaId, arquivo }: { fiancaId: string; arquivo: File }) => {
      console.log('Enviando comprovante para fiança:', fiancaId);
      
      // Upload do arquivo
      const { path, url } = await uploadFile(arquivo, `comprovantes/${fiancaId}`);
      
      // Atualizar fiança com comprovante
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          status_fianca: 'comprovante_enviado',
          comprovante_pagamento: url,
          situacao_pagamento: 'comprovante_enviado',
          data_comprovante: new Date().toISOString(),
          data_atualizacao_pagamento: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;
      
      return { path, url };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquilino-fiancas'] });
    }
  });

  return {
    fiancas,
    isLoading,
    enviarComprovante,
    isEnviandoComprovante: enviarComprovante.isPending
  };
};
