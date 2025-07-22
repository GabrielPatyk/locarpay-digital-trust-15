import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useFiancaDocumentosExecutivo = (fiancaId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const anexarDocumentoMutation = useMutation({
    mutationFn: async ({ 
      tipoDocumento, 
      arquivo 
    }: { 
      tipoDocumento: 'rg' | 'cpf' | 'comprovante_residencia';
      arquivo: string;
    }) => {
      const { data: fiancaAtual } = await supabase
        .from('fiancas_locaticias')
        .select('documentos_executivo')
        .eq('id', fiancaId)
        .single();

      const documentosAtuais = (fiancaAtual?.documentos_executivo as Record<string, any>) || {};
      const novosDocumentos = {
        ...documentosAtuais,
        [tipoDocumento]: arquivo
      };

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .update({
          documentos_executivo: novosDocumentos,
          anexado_por_executivo: user?.id,
          status_fianca: 'em_analise'
        })
        .eq('id', fiancaId)
        .select()
        .single();

      if (error) throw error;

      // Criar entrada no histórico
      await supabase
        .from('historico_fiancas')
        .insert({
          fianca_id: fiancaId,
          acao: 'Documento anexado pelo executivo',
          usuario_nome: user?.name || 'Executivo',
          usuario_id: user?.id,
          detalhes: `Documento ${tipoDocumento} foi anexado`
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fianca', fiancaId] });
      queryClient.invalidateQueries({ queryKey: ['historico', fiancaId] });
      toast({
        title: "Documento anexado!",
        description: "O documento foi anexado com sucesso e o status foi atualizado.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao anexar documento",
        description: error.message || "Ocorreu um erro ao anexar o documento.",
        variant: "destructive",
      });
    }
  });

  const atualizarDocumentoMutation = useMutation({
    mutationFn: async ({ 
      tipoDocumento, 
      arquivo 
    }: { 
      tipoDocumento: 'rg' | 'cpf' | 'comprovante_residencia';
      arquivo: string;
    }) => {
      const { data: fiancaAtual } = await supabase
        .from('fiancas_locaticias')
        .select('documentos_executivo')
        .eq('id', fiancaId)
        .single();

      const documentosAtuais = (fiancaAtual?.documentos_executivo as Record<string, any>) || {};
      const novosDocumentos = {
        ...documentosAtuais,
        [tipoDocumento]: arquivo
      };

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .update({
          documentos_executivo: novosDocumentos,
          anexado_por_executivo: user?.id
        })
        .eq('id', fiancaId)
        .select()
        .single();

      if (error) throw error;

      // Criar entrada no histórico
      await supabase
        .from('historico_fiancas')
        .insert({
          fianca_id: fiancaId,
          acao: 'Documento atualizado pelo executivo',
          usuario_nome: user?.name || 'Executivo',
          usuario_id: user?.id,
          detalhes: `Documento ${tipoDocumento} foi atualizado`
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fianca', fiancaId] });
      queryClient.invalidateQueries({ queryKey: ['historico', fiancaId] });
      toast({
        title: "Documento atualizado!",
        description: "O documento foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar documento",
        description: error.message || "Ocorreu um erro ao atualizar o documento.",
        variant: "destructive",
      });
    }
  });

  return {
    anexarDocumento: anexarDocumentoMutation.mutate,
    atualizarDocumento: atualizarDocumentoMutation.mutate,
    isAnexando: anexarDocumentoMutation.isPending,
    isAtualizando: atualizarDocumentoMutation.isPending
  };
};