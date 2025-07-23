import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useNotificacoes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: notificacoes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['notificacoes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Configurar header com email do usuário para RLS
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notificações:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  });

  const marcarComoLida = useMutation({
    mutationFn: async (notificacaoId: string) => {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', notificacaoId)
        .eq('usuario_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', user?.id] });
    }
  });

  const marcarTodasComoLidas = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('usuario_id', user?.id)
        .eq('lida', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes', user?.id] });
    }
  });

  const notificacaoNaoLidas = notificacoes?.filter(n => !n.lida) || [];

  return {
    notificacoes: notificacoes || [],
    notificacaoNaoLidas,
    totalNaoLidas: notificacaoNaoLidas.length,
    isLoading,
    error,
    marcarComoLida,
    marcarTodasComoLidas
  };
};