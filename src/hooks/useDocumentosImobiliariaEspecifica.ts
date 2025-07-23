import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentosStatus {
  id?: string;
  cartao_cnpj?: string | null;
  comprovante_endereco?: string | null;
  cartao_creci?: string | null;
  status_cartao_cnpj: 'pendente' | 'verificando' | 'verificado' | 'rejeitado';
  status_comprovante_endereco: 'pendente' | 'verificando' | 'verificado' | 'rejeitado';
  status_cartao_creci: 'pendente' | 'verificando' | 'verificado' | 'rejeitado';
  data_verificacao_cartao_cnpj?: string | null;
  data_verificacao_comprovante_endereco?: string | null;
  data_verificacao_cartao_creci?: string | null;
  motivo_rejeicao_cartao_cnpj?: string | null;
  motivo_rejeicao_comprovante_endereco?: string | null;
  motivo_rejeicao_cartao_creci?: string | null;
}

export const useDocumentosImobiliariaEspecifica = (imobiliariaId?: string) => {
  const {
    data: documentos,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['documentos-imobiliaria-especifica', imobiliariaId],
    queryFn: async (): Promise<DocumentosStatus | null> => {
      if (!imobiliariaId) return null;

      const { data, error } = await supabase
        .from('perfil_usuario')
        .select(`
          id,
          cartao_cnpj,
          comprovante_endereco,
          cartao_creci,
          status_cartao_cnpj,
          status_comprovante_endereco,
          status_cartao_creci,
          data_verificacao_cartao_cnpj,
          data_verificacao_comprovante_endereco,
          data_verificacao_cartao_creci,
          motivo_rejeicao_cartao_cnpj,
          motivo_rejeicao_comprovante_endereco,
          motivo_rejeicao_cartao_creci
        `)
        .eq('usuario_id', imobiliariaId)
        .maybeSingle();

      if (error) throw error;

      return data ? {
        id: data.id,
        cartao_cnpj: data.cartao_cnpj,
        comprovante_endereco: data.comprovante_endereco,
        cartao_creci: data.cartao_creci,
        status_cartao_cnpj: (data.status_cartao_cnpj as 'pendente' | 'verificando' | 'verificado' | 'rejeitado') || 'pendente',
        status_comprovante_endereco: (data.status_comprovante_endereco as 'pendente' | 'verificando' | 'verificado' | 'rejeitado') || 'pendente',
        status_cartao_creci: (data.status_cartao_creci as 'pendente' | 'verificando' | 'verificado' | 'rejeitado') || 'pendente',
        data_verificacao_cartao_cnpj: data.data_verificacao_cartao_cnpj,
        data_verificacao_comprovante_endereco: data.data_verificacao_comprovante_endereco,
        data_verificacao_cartao_creci: data.data_verificacao_cartao_creci,
        motivo_rejeicao_cartao_cnpj: data.motivo_rejeicao_cartao_cnpj,
        motivo_rejeicao_comprovante_endereco: data.motivo_rejeicao_comprovante_endereco,
        motivo_rejeicao_cartao_creci: data.motivo_rejeicao_cartao_creci
      } : {
        status_cartao_cnpj: 'pendente' as const,
        status_comprovante_endereco: 'pendente' as const,
        status_cartao_creci: 'pendente' as const
      };
    },
    enabled: !!imobiliariaId
  });

  const todosDocumentosVerificados = () => {
    if (!documentos) return false;
    return (
      documentos.status_cartao_cnpj === 'verificado' &&
      documentos.status_comprovante_endereco === 'verificado' &&
      documentos.status_cartao_creci === 'verificado'
    );
  };

  const algumDocumentoPendente = () => {
    if (!documentos) return true;
    return (
      documentos.status_cartao_cnpj === 'pendente' ||
      documentos.status_comprovante_endereco === 'pendente' ||
      documentos.status_cartao_creci === 'pendente'
    );
  };

  return {
    documentos,
    isLoading,
    error,
    refetch,
    todosDocumentosVerificados,
    algumDocumentoPendente
  };
};