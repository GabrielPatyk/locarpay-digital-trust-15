import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAprovarDocumentos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const aprovarDocumentoMutation = useMutation({
    mutationFn: async ({ 
      perfilId, 
      tipoDocumento, 
      aprovar,
      motivo 
    }: { 
      perfilId: string;
      tipoDocumento: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci';
      aprovar: boolean;
      motivo?: string;
    }) => {
      const statusField = `status_${tipoDocumento}` as const;
      const dataField = `data_verificacao_${tipoDocumento}` as const;
      const motivoField = `motivo_rejeicao_${tipoDocumento}` as const;
      
      const updates: any = {
        [statusField]: aprovar ? 'verificado' : 'rejeitado',
        [dataField]: new Date().toISOString()
      };

      if (!aprovar && motivo) {
        updates[motivoField] = motivo;
        updates[statusField] = 'rejeitado'; // Status rejeitado
      } else if (aprovar) {
        updates[statusField] = 'verificado';
        // Limpar motivo de rejeição se aprovar
        updates[motivoField] = null;
      }

      const { data, error } = await supabase
        .from('perfil_usuario')
        .update(updates)
        .eq('id', perfilId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['imobiliarias'] });
      queryClient.invalidateQueries({ queryKey: ['imobiliaria'] });
      queryClient.invalidateQueries({ queryKey: ['documentos-imobiliaria'] });
      queryClient.invalidateQueries({ queryKey: ['documentos-imobiliaria-especifica'] });
      
      const acao = variables.aprovar ? 'aprovado' : 'rejeitado';
      toast({
        title: `Documento ${acao}!`,
        description: `O documento foi ${acao} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao processar documento",
        description: error.message || "Ocorreu um erro ao processar o documento.",
        variant: "destructive",
      });
    }
  });

  return {
    aprovarDocumento: aprovarDocumentoMutation.mutate,
    isProcessing: aprovarDocumentoMutation.isPending
  };
};