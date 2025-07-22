import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContratoImobiliaria {
  id: string;
  fianca_id: string;
  status_contrato: string;
  inquilino_nome_completo: string;
  inquilino_email: string;
  inquilino_cpf: string;
  inquilino_whatsapp: string;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_bairro: string;
  imovel_cidade: string;
  imovel_valor_aluguel: number;
  imovel_tempo_locacao: number;
  imovel_tipo: string;
  valor_fianca: number;
  created_at: string;
  data_criacao: string;
  url_assinatura_inquilino: string | null;
}

export const useContratosImobiliaria = () => {
  const { user } = useAuth();

  const { data: contratos = [], isLoading, error } = useQuery({
    queryKey: ['contratos-imobiliaria', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('contratos_fianca')
        .select(`
          id,
          fianca_id,
          status_contrato,
          inquilino_nome,
          inquilino_email,
          inquilino_cpf,
          inquilino_whatsapp,
          valor_fianca,
          valor_aluguel,
          created_at,
          url_assinatura_inquilino,
          fiancas_locaticias!inner (
            inquilino_nome_completo,
            inquilino_email,
            imovel_endereco,
            imovel_numero,
            imovel_bairro,
            imovel_cidade,
            imovel_valor_aluguel,
            imovel_tempo_locacao,
            imovel_tipo,
            valor_fianca,
            data_criacao,
            id_imobiliaria
          )
        `)
        .eq('fiancas_locaticias.id_imobiliaria', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contratos:', error);
        throw error;
      }

      // Transformar os dados para o formato esperado
      return data.map((contrato: any) => ({
        id: contrato.id,
        fianca_id: contrato.fianca_id,
        status_contrato: contrato.status_contrato,
        inquilino_nome_completo: contrato.fiancas_locaticias.inquilino_nome_completo,
        inquilino_email: contrato.fiancas_locaticias.inquilino_email,
        inquilino_cpf: contrato.inquilino_cpf || '',
        inquilino_whatsapp: contrato.inquilino_whatsapp || '',
        imovel_endereco: contrato.fiancas_locaticias.imovel_endereco,
        imovel_numero: contrato.fiancas_locaticias.imovel_numero,
        imovel_bairro: contrato.fiancas_locaticias.imovel_bairro,
        imovel_cidade: contrato.fiancas_locaticias.imovel_cidade,
        imovel_valor_aluguel: contrato.fiancas_locaticias.imovel_valor_aluguel,
        imovel_tempo_locacao: contrato.fiancas_locaticias.imovel_tempo_locacao,
        imovel_tipo: contrato.fiancas_locaticias.imovel_tipo,
        valor_fianca: contrato.fiancas_locaticias.valor_fianca,
        created_at: contrato.created_at,
        data_criacao: contrato.fiancas_locaticias.data_criacao,
        url_assinatura_inquilino: contrato.url_assinatura_inquilino
      })) as ContratoImobiliaria[];
    },
    enabled: !!user?.id && user.type === 'imobiliaria'
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'gerando_link':
        return 'Gerando Link';
      case 'assinatura_inquilino':
        return 'Aguardando Assinatura';
      case 'assinado':
        return 'Assinado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assinado':
        return 'bg-green-100 text-green-800';
      case 'gerando_link':
        return 'bg-yellow-100 text-yellow-800';
      case 'assinatura_inquilino':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'residencial':
        return 'Residencial';
      case 'comercial':
        return 'Comercial';
      default:
        return tipo;
    }
  };

  return {
    contratos,
    isLoading,
    error,
    getStatusLabel,
    getStatusColor,
    getTipoLabel
  };
};