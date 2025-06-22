import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Fianca = Tables<'fiancas_locaticias'>;
type FiancaInsert = TablesInsert<'fiancas_locaticias'>;

export interface FiancaFormData {
  // Dados do Inquilino
  nomeCompleto: string;
  cpf: string;
  email: string;
  whatsapp: string;
  rendaMensal: string;
  // Endereço do Inquilino
  inquilinoEndereco: string;
  inquilinoNumero: string;
  inquilinoComplemento: string;
  inquilinoBairro: string;
  inquilinoCidade: string;
  inquilinoEstado: string;
  inquilinoPais: string;
  // Dados do Imóvel
  tipoImovel: string;
  tipoLocacao: string;
  valorAluguel: string;
  descricaoImovel: string;
  areaMetros: string;
  tempoLocacao: string;
  // Endereço do Imóvel
  imovelEndereco: string;
  imovelNumero: string;
  imovelComplemento: string;
  imovelBairro: string;
  imovelCidade: string;
  imovelEstado: string;
  imovelPais: string;
}

export const useFiancas = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: fiancas = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['fiancas', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('id_imobiliaria', user.id)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data as Fianca[];
    },
    enabled: !!user?.id
  });

  const createFiancaMutation = useMutation({
    mutationFn: async (formData: FiancaFormData) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const fiancaData: Omit<FiancaInsert, 'id'> = {
        id_imobiliaria: user.id,
        inquilino_nome_completo: formData.nomeCompleto,
        inquilino_cpf: formData.cpf,
        inquilino_email: formData.email,
        inquilino_whatsapp: formData.whatsapp,
        inquilino_renda_mensal: parseFloat(formData.rendaMensal.replace(/[^\d,]/g, '').replace(',', '.')),
        inquilino_endereco: formData.inquilinoEndereco,
        inquilino_numero: formData.inquilinoNumero,
        inquilino_complemento: formData.inquilinoComplemento || null,
        inquilino_bairro: formData.inquilinoBairro,
        inquilino_cidade: formData.inquilinoCidade,
        inquilino_estado: formData.inquilinoEstado,
        inquilino_pais: formData.inquilinoPais,
        imovel_tipo: formData.tipoImovel,
        imovel_tipo_locacao: formData.tipoLocacao,
        imovel_valor_aluguel: parseFloat(formData.valorAluguel.replace(/[^\d,]/g, '').replace(',', '.')),
        imovel_descricao: formData.descricaoImovel || null,
        imovel_area_metros: formData.areaMetros ? parseFloat(formData.areaMetros) : null,
        imovel_tempo_locacao: parseInt(formData.tempoLocacao),
        imovel_endereco: formData.imovelEndereco,
        imovel_numero: formData.imovelNumero,
        imovel_complemento: formData.imovelComplemento || null,
        imovel_bairro: formData.imovelBairro,
        imovel_cidade: formData.imovelCidade,
        imovel_estado: formData.imovelEstado,
        imovel_pais: formData.imovelPais,
        status_fianca: 'em_analise'
      };

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .insert(fiancaData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas', user?.id] });
    }
  });

  const acceptFianca = useMutation({
    mutationFn: async (fiancaId: string) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({ 
          status_fianca: 'enviada_ao_financeiro',
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', fiancaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiancas'] });
    }
  });

  const getFiancasStats = () => {
    const totalFiancas = fiancas.length;
    const fiancasPendentes = fiancas.filter(f => f.status_fianca === 'em_analise').length;
    const fiancasAtivas = fiancas.filter(f => f.status_fianca === 'ativa').length;
    const fiancasVencidas = fiancas.filter(f => f.status_fianca === 'vencida').length;

    return {
      totalFiancas,
      fiancasPendentes,
      fiancasAtivas,
      fiancasVencidas
    };
  };

  return {
    fiancas,
    isLoading,
    createFianca: createFiancaMutation.mutate,
    isCreating: createFiancaMutation.isPending,
    createError: createFiancaMutation.error,
    acceptFianca,
    isAccepting: acceptFianca.isPending,
    getFiancasStats
  };
};
