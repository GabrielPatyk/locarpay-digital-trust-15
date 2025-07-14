
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ContratoLocarpay {
  id: string;
  id_imobiliaria: string;
  id_executivo: string;
  criado_por: string;
  data_criacao: string;
  modelo_contrato: string;
  link_assinatura?: string;
  arquivo_download?: string;
  assinado: boolean;
  data_assinatura?: string;
  observacoes?: string;
  dados_contrato?: any;
  data_atualizacao: string;
}

export const useContratosLocarpay = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: contratos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['contratos-locarpay', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return (data || []) as ContratoLocarpay[];
    },
    enabled: !!user?.id
  });

  const {
    data: contratoImobiliaria,
    isLoading: isLoadingContrato
  } = useQuery({
    queryKey: ['contrato-imobiliaria', user?.id],
    queryFn: async () => {
      if (!user?.id || user.type !== 'imobiliaria') return null;

      const { data, error } = await supabase
        .from('contratos_locarpay')
        .select('*')
        .eq('id_imobiliaria', user.id)
        .eq('modelo_contrato', 'imobiliaria_locarpay')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return (data || null) as ContratoLocarpay | null;
    },
    enabled: !!user?.id && user.type === 'imobiliaria'
  });

  const assinarContrato = useMutation({
    mutationFn: async (contratoId: string) => {
      const { data, error } = await supabase
        .from('contratos_locarpay')
        .update({
          assinado: true,
          data_assinatura: new Date().toISOString()
        })
        .eq('id', contratoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-locarpay'] });
      queryClient.invalidateQueries({ queryKey: ['contrato-imobiliaria'] });
      toast({
        title: "Sucesso!",
        description: "Contrato assinado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao assinar contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao assinar contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  return {
    contratos,
    contratoImobiliaria,
    isLoading: isLoading || isLoadingContrato,
    error,
    assinarContrato,
    isAssining: assinarContrato.isPending
  };
};
