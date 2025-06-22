
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Usuario = Tables<'usuarios'>;
type PerfilUsuario = Tables<'perfil_usuario'>;

export interface ImobiliariaCompleta extends Usuario {
  perfil_usuario?: PerfilUsuario;
  _count?: {
    fiancas_ativas: number;
  };
}

export const useImobiliarias = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: imobiliarias = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['imobiliarias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          perfil_usuario(*)
        `)
        .eq('cargo', 'imobiliaria')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data as ImobiliariaCompleta[];
    },
    enabled: !!user?.id
  });

  const {
    data: stats = {
      totalImobiliarias: 0,
      ativas: 0,
      inativas: 0,
      contratosTotais: 0
    },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['imobiliarias-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('ativo')
        .eq('cargo', 'imobiliaria');

      if (error) throw error;
      
      const totalImobiliarias = data.length;
      const ativas = data.filter(i => i.ativo).length;
      const inativas = data.filter(i => !i.ativo).length;

      // Buscar total de contratos/fianças
      const { data: fiancasData, error: fiancasError } = await supabase
        .from('fiancas_locaticias')
        .select('id');

      if (fiancasError) throw fiancasError;

      return {
        totalImobiliarias,
        ativas,
        inativas,
        contratosTotais: fiancasData.length
      };
    },
    enabled: !!user?.id
  });

  const atualizarStatusImobiliaria = useMutation({
    mutationFn: async ({ imobiliariaId, ativo }: { imobiliariaId: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo })
        .eq('id', imobiliariaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imobiliarias'] });
      queryClient.invalidateQueries({ queryKey: ['imobiliarias-stats'] });
    }
  });

  const excluirImobiliaria = useMutation({
    mutationFn: async ({ imobiliariaId }: { imobiliariaId: string }) => {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', imobiliariaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imobiliarias'] });
      queryClient.invalidateQueries({ queryKey: ['imobiliarias-stats'] });
    }
  });

  return {
    imobiliarias,
    stats,
    isLoading: isLoading || isLoadingStats,
    error,
    atualizarStatusImobiliaria,
    excluirImobiliaria,
    isUpdating: atualizarStatusImobiliaria.isPending || excluirImobiliaria.isPending
  };
};
