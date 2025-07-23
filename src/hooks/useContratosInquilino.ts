import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContratoInquilino {
  id: string;
  fianca_id: string;
  status_contrato: string;
  inquilino_nome: string;
  inquilino_email: string;
  inquilino_cpf: string;
  valor_fianca: number;
  valor_aluguel: number;
  url_assinatura_inquilino: string | null;
  created_at: string;
  updated_at: string;
  fianca: {
    id: string;
    imovel_endereco: string;
    imovel_numero: string;
    imovel_complemento: string | null;
    imovel_bairro: string;
    imovel_cidade: string;
    imovel_estado: string;
    imovel_tipo: string;
    usuarios: {
      nome: string;
      email: string;
    } | null;
  } | null;
}

export const useContratosInquilino = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['contratos-inquilino', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('contratos_fianca')
        .select(`
          *,
          fianca:fiancas_locaticias!inner(
            id,
            imovel_endereco,
            imovel_numero,
            imovel_complemento,
            imovel_bairro,
            imovel_cidade,
            imovel_estado,
            imovel_tipo,
            usuarios:usuarios!fiancas_locaticias_id_imobiliaria_fkey(
              nome,
              email
            )
          )
        `)
        .eq('fianca.inquilino_usuario_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contratos:', error);
        throw error;
      }

      return (data || []) as ContratoInquilino[];
    },
    enabled: !!user?.id
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'gerando_link': return 'bg-yellow-500';
      case 'aguardando_assinatura': return 'bg-blue-500';
      case 'assinado': return 'bg-green-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'gerando_link': return 'Gerando Link';
      case 'aguardando_assinatura': return 'Aguardando Assinatura';
      case 'assinado': return 'Assinado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };
};