import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatusPlataforma {
  id: string;
  versao_atual: string;
  data_ultima_atualizacao: string;
  changelog: any[];
  navegadores_compativeis: any[];
  infraestrutura: any;
  apis_integracoes: any[];
  proximas_atualizacoes: any[];
}

export const useStatusPlataforma = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: statusPlataforma,
    isLoading,
    error
  } = useQuery({
    queryKey: ['status-plataforma'],
    queryFn: async (): Promise<StatusPlataforma | null> => {
      const { data, error } = await supabase
        .from('status_plataforma')
        .select('*')
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0] as StatusPlataforma : null;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (updates: Partial<StatusPlataforma>) => {
      const { data, error } = await supabase
        .from('status_plataforma')
        .update(updates)
        .eq('id', statusPlataforma?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-plataforma'] });
      toast({
        title: "Status atualizado!",
        description: "As configurações da plataforma foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Erro ao atualizar status da plataforma.",
        variant: "destructive",
      });
    }
  });

  return {
    statusPlataforma,
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending
  };
};