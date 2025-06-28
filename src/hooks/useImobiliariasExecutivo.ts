
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Usuario = Tables<'usuarios'>;
type PerfilUsuario = Tables<'perfil_usuario'>;

export interface ImobiliariaComPerfil extends Usuario {
  perfil_usuario?: PerfilUsuario;
  totalFiancas?: number;
  valorTotal?: number;
}

export interface NovaImobiliariaData {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  contato: string;
  observacoes?: string;
}

export const useImobiliariasExecutivo = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: imobiliarias = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['imobiliarias-executivo', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          perfil_usuario(*)
        `)
        .eq('criado_por', user.id)
        .eq('cargo', 'imobiliaria')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      // Buscar dados de fianças para cada imobiliária
      const imobiliariasComStats = await Promise.all(
        (data as ImobiliariaComPerfil[]).map(async (imobiliaria) => {
          const { data: fiancas, error: fiancasError } = await supabase
            .from('fiancas_locaticias')
            .select('imovel_valor_aluguel, taxa_aplicada')
            .eq('id_imobiliaria', imobiliaria.id);

          if (fiancasError) {
            console.error('Erro ao buscar fianças:', fiancasError);
            return { ...imobiliaria, totalFiancas: 0, valorTotal: 0 };
          }

          const totalFiancas = fiancas?.length || 0;
          const valorTotal = fiancas?.reduce((acc, fianca) => {
            const valor = fianca.imovel_valor_aluguel || 0;
            const taxa = fianca.taxa_aplicada || 0;
            return acc + (valor * (taxa / 100));
          }, 0) || 0;

          return {
            ...imobiliaria,
            totalFiancas,
            valorTotal: Math.round(valorTotal)
          };
        })
      );

      return imobiliariasComStats;
    },
    enabled: !!user?.id
  });

  const {
    data: stats = {
      totalImobiliarias: 0,
      ativas: 0,
      totalFiancas: 0
    },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['stats-executivo', user?.id],
    queryFn: async () => {
      if (!user?.id) return { totalImobiliarias: 0, ativas: 0, totalFiancas: 0 };

      const { data: imobiliariasData, error } = await supabase
        .from('usuarios')
        .select('id, ativo')
        .eq('criado_por', user.id)
        .eq('cargo', 'imobiliaria');

      if (error) throw error;

      const totalImobiliarias = imobiliariasData.length;
      const ativas = imobiliariasData.filter(i => i.ativo).length;

      // Buscar total de fianças de todas as imobiliárias do executivo
      if (imobiliariasData.length > 0) {
        const imobiliariaIds = imobiliariasData.map(i => i.id);
        const { data: fiancasData, error: fiancasError } = await supabase
          .from('fiancas_locaticias')
          .select('id')
          .in('id_imobiliaria', imobiliariaIds);

        if (fiancasError) throw fiancasError;

        return {
          totalImobiliarias,
          ativas,
          totalFiancas: fiancasData.length
        };
      }

      return { totalImobiliarias, ativas, totalFiancas: 0 };
    },
    enabled: !!user?.id
  });

  const criarImobiliaria = useMutation({
    mutationFn: async (dados: NovaImobiliariaData) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Gerar senha temporária
      const senhaTemporaria = Math.random().toString(36).slice(-8);

      // Criar usuário imobiliária
      const { data: novoUsuario, error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          cargo: 'imobiliaria',
          senha: senhaTemporaria, // Será hasheada pelo trigger
          criado_por: user.id,
          verificado: false,
          ativo: true
        })
        .select()
        .single();

      if (usuarioError) throw usuarioError;

      // Criar perfil da imobiliária
      const { error: perfilError } = await supabase
        .from('perfil_usuario')
        .insert({
          usuario_id: novoUsuario.id,
          nome_empresa: dados.nome,
          cnpj: dados.cnpj,
          endereco: dados.endereco,
          numero: dados.numero,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado,
          pais: dados.pais
        });

      if (perfilError) throw perfilError;

      return novoUsuario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imobiliarias-executivo'] });
      queryClient.invalidateQueries({ queryKey: ['stats-executivo'] });
      toast({
        title: "Sucesso!",
        description: "Imobiliária cadastrada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar imobiliária:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar imobiliária. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  return {
    imobiliarias,
    stats,
    isLoading: isLoading || isLoadingStats,
    error,
    criarImobiliaria,
    isCreating: criarImobiliaria.isPending
  };
};
