import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DocumentosImobiliaria {
  id: string;
  usuario_id: string;
  cartao_cnpj?: string | null;
  comprovante_endereco?: string | null;
  cartao_creci?: string | null;
  status_cartao_cnpj: 'pendente' | 'verificando' | 'verificado';
  status_comprovante_endereco: 'pendente' | 'verificando' | 'verificado';
  status_cartao_creci: 'pendente' | 'verificando' | 'verificado';
  data_verificacao_cartao_cnpj?: string | null;
  data_verificacao_comprovante_endereco?: string | null;
  data_verificacao_cartao_creci?: string | null;
  usuario: {
    nome: string;
    email: string;
  };
}

export const useDocumentosExecutivo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: imobiliarias,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['documentos-imobiliarias-executivo', user?.id],
    queryFn: async (): Promise<DocumentosImobiliaria[]> => {
      if (!user?.id) return [];

      // Buscar imobiliárias criadas por este executivo
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          nome,
          email,
          perfil_usuario!inner(
            id,
            cartao_cnpj,
            comprovante_endereco,
            cartao_creci,
            status_cartao_cnpj,
            status_comprovante_endereco,
            status_cartao_creci,
            data_verificacao_cartao_cnpj,
            data_verificacao_comprovante_endereco,
            data_verificacao_cartao_creci
          )
        `)
        .eq('cargo', 'imobiliaria')
        .eq('criado_por', user.id);

      if (error) throw error;

      return data.map(item => ({
        id: item.perfil_usuario[0]?.id || '',
        usuario_id: item.id,
        cartao_cnpj: item.perfil_usuario[0]?.cartao_cnpj,
        comprovante_endereco: item.perfil_usuario[0]?.comprovante_endereco,
        cartao_creci: item.perfil_usuario[0]?.cartao_creci,
        status_cartao_cnpj: (item.perfil_usuario[0]?.status_cartao_cnpj as any) || 'pendente',
        status_comprovante_endereco: (item.perfil_usuario[0]?.status_comprovante_endereco as any) || 'pendente',
        status_cartao_creci: (item.perfil_usuario[0]?.status_cartao_creci as any) || 'pendente',
        data_verificacao_cartao_cnpj: item.perfil_usuario[0]?.data_verificacao_cartao_cnpj,
        data_verificacao_comprovante_endereco: item.perfil_usuario[0]?.data_verificacao_comprovante_endereco,
        data_verificacao_cartao_creci: item.perfil_usuario[0]?.data_verificacao_cartao_creci,
        usuario: {
          nome: item.nome,
          email: item.email
        }
      }));
    },
    enabled: !!user?.id && user.type === 'executivo'
  });

  const updateDocumentStatusMutation = useMutation({
    mutationFn: async ({ 
      perfilId, 
      documentType, 
      status,
      dataVerificacao
    }: {
      perfilId: string;
      documentType: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci';
      status: 'pendente' | 'verificando' | 'verificado';
      dataVerificacao?: string;
    }) => {
      const updateData: any = {
        [`status_${documentType}`]: status
      };

      if (status === 'verificado' && dataVerificacao) {
        updateData[`data_verificacao_${documentType}`] = dataVerificacao;
      }

      const { error } = await supabase
        .from('perfil_usuario')
        .update(updateData)
        .eq('id', perfilId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-imobiliarias-executivo'] });
      toast({
        title: "Status atualizado!",
        description: "O status do documento foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Erro ao atualizar status do documento.",
        variant: "destructive",
      });
    }
  });

  return {
    imobiliarias,
    isLoading,
    error,
    refetch,
    updateDocumentStatus: updateDocumentStatusMutation.mutate,
    isUpdating: updateDocumentStatusMutation.isPending
  };
};