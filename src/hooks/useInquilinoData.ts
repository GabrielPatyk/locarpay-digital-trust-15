
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Tipo personalizado para fiança com dados da imobiliária
type FiancaComImobiliaria = {
  id: string;
  id_imobiliaria: string;
  inquilino_usuario_id: string;
  status_fianca: string;
  valor_fianca: number;
  valor_total_locacao: number;
  imovel_valor_aluguel: number;
  imovel_tempo_locacao: number;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_bairro: string;
  imovel_cidade: string;
  imovel_estado: string;
  data_criacao: string;
  score_credito?: number;
  taxa_aplicada?: number;
  link_pagamento?: string;
  comprovante_pagamento?: string;
  data_comprovante?: string;
  motivo_reprovacao?: string;
  observacoes_aprovacao?: string;
  // Propriedades adicionadas pela nossa query
  usuarios?: {
    id: string;
    nome: string;
    email: string;
  };
  perfil_usuario?: Array<{
    nome_empresa?: string;
  }>;
  [key: string]: any; // Para outras propriedades da fiança
};

export const useInquilinoData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar fiança ativa do inquilino
  const { data: fiancaAtiva, isLoading: isLoadingFianca } = useQuery({
    queryKey: ['fianca-ativa', user?.id],
    queryFn: async (): Promise<FiancaComImobiliaria | null> => {
      if (!user?.id) return null;

      console.log('Buscando fiança ativa para o usuário:', user.id);

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_usuario_id', user.id)
        .eq('status_fianca', 'ativa')
        .order('data_criacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar fiança ativa:', error);
        throw error;
      }

      // Se encontrou uma fiança, buscar dados da imobiliária separadamente
      if (data) {
        const { data: imobiliariaData, error: imobiliariaError } = await supabase
          .from('usuarios')
          .select('id, nome, email')
          .eq('id', data.id_imobiliaria)
          .single();

        if (!imobiliariaError && imobiliariaData) {
          // Buscar perfil da imobiliária
          const { data: perfilData } = await supabase
            .from('perfil_usuario')
            .select('nome_empresa')
            .eq('usuario_id', data.id_imobiliaria)
            .single();

          return {
            ...data,
            usuarios: imobiliariaData,
            perfil_usuario: perfilData ? [perfilData] : []
          } as FiancaComImobiliaria;
        }
        
        // Se não conseguiu buscar dados da imobiliária, retornar com arrays vazios
        return {
          ...data,
          usuarios: undefined,
          perfil_usuario: []
        } as FiancaComImobiliaria;
      }

      return null;
    },
    enabled: !!user?.id
  });

  // Buscar fiança com pagamento disponível ou comprovante enviado
  const { data: fiancaPagamento, isLoading: isLoadingPagamento } = useQuery({
    queryKey: ['fianca-pagamento', user?.id],
    queryFn: async (): Promise<FiancaComImobiliaria | null> => {
      if (!user?.id) return null;

      console.log('Buscando fiança pagamento para o usuário:', user.id);

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('inquilino_usuario_id', user.id)
        .in('status_fianca', ['pagamento_disponivel', 'comprovante_enviado'])
        .order('data_criacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar fiança pagamento:', error);
        throw error;
      }

      // Se encontrou uma fiança, buscar dados da imobiliária separadamente
      if (data) {
        const { data: imobiliariaData, error: imobiliariaError } = await supabase
          .from('usuarios')
          .select('id, nome, email')
          .eq('id', data.id_imobiliaria)
          .single();

        if (!imobiliariaError && imobiliariaData) {
          // Buscar perfil da imobiliária
          const { data: perfilData } = await supabase
            .from('perfil_usuario')
            .select('nome_empresa')
            .eq('usuario_id', data.id_imobiliaria)
            .single();

          return {
            ...data,
            usuarios: imobiliariaData,
            perfil_usuario: perfilData ? [perfilData] : []
          } as FiancaComImobiliaria;
        }
        
        // Se não conseguiu buscar dados da imobiliária, retornar com arrays vazios
        return {
          ...data,
          usuarios: undefined,
          perfil_usuario: []
        } as FiancaComImobiliaria;
      }

      return null;
    },
    enabled: !!user?.id
  });

  // Verificar se o email do usuário está verificado
  const { data: emailVerificado } = useQuery({
    queryKey: ['email-verificado', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('usuarios')
        .select('verificado')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao verificar email:', error);
        return false;
      }
      
      return data.verificado || false;
    },
    enabled: !!user?.id
  });

  // Mutation para enviar comprovante
  const enviarComprovante = useMutation({
    mutationFn: async ({ fiancaId, comprovantePath }: { fiancaId: string; comprovantePath: string }) => {
      const { error } = await supabase
        .from('fiancas_locaticias')
        .update({
          comprovante_pagamento: comprovantePath,
          data_comprovante: new Date().toISOString(),
          status_fianca: 'comprovante_enviado'
        })
        .eq('id', fiancaId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Comprovante enviado!",
        description: "Seu comprovante foi enviado e está sendo analisado.",
      });
      queryClient.invalidateQueries({ queryKey: ['fianca-pagamento'] });
      queryClient.invalidateQueries({ queryKey: ['fianca-ativa'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao enviar comprovante: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    fiancaAtiva,
    fiancaPagamento,
    emailVerificado,
    isLoading: isLoadingFianca || isLoadingPagamento,
    enviarComprovante
  };
};
