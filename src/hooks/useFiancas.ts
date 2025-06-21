
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface FiancaData {
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fiancas = [], isLoading } = useQuery({
    queryKey: ['fiancas', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('id_imobiliaria', user.id)
        .order('data_criacao', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar fianças:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  const createFiancaMutation = useMutation({
    mutationFn: async (formData: FiancaData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const fiancaData = {
        id_imobiliaria: user.id,
        inquilino_nome_completo: formData.nomeCompleto,
        inquilino_cpf: formData.cpf,
        inquilino_email: formData.email,
        inquilino_whatsapp: formData.whatsapp,
        inquilino_renda_mensal: parseFloat(formData.rendaMensal.replace(/[^0-9,]/g, '').replace(',', '.')),
        inquilino_endereco: formData.inquilinoEndereco,
        inquilino_numero: formData.inquilinoNumero,
        inquilino_complemento: formData.inquilinoComplemento || null,
        inquilino_bairro: formData.inquilinoBairro,
        inquilino_cidade: formData.inquilinoCidade,
        inquilino_estado: formData.inquilinoEstado,
        inquilino_pais: formData.inquilinoPais,
        imovel_tipo: formData.tipoImovel,
        imovel_tipo_locacao: formData.tipoLocacao,
        imovel_valor_aluguel: parseFloat(formData.valorAluguel.replace(/[^0-9,]/g, '').replace(',', '.')),
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
        status_fianca: 'em_analise' as const
      };

      console.log('Dados da fiança a serem inseridos:', fiancaData);

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .insert([fiancaData])
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado ao criar fiança:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Fiança criada com sucesso!",
        description: "A fiança foi enviada para análise.",
      });
      queryClient.invalidateQueries({ queryKey: ['fiancas'] });
    },
    onError: (error: any) => {
      console.error('Erro ao criar fiança:', error);
      toast({
        title: "Erro ao criar fiança",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const dashboardStats = {
    totalFiancas: fiancas.length,
    fiancasPendentes: fiancas.filter(f => f.status_fianca === 'em_analise').length,
    fiancasAtivas: fiancas.filter(f => f.status_fianca === 'ativa').length,
    fiancasVencidas: fiancas.filter(f => f.status_fianca === 'vencida').length,
  };

  return {
    fiancas,
    isLoading,
    createFianca: createFiancaMutation.mutate,
    isCreating: createFiancaMutation.isPending,
    dashboardStats,
  };
};
