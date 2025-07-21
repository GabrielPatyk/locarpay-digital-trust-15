import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('manutencao_ativa')
        .single();

      if (error) {
        console.error('Erro ao verificar status de manutenção:', error);
        return false;
      }

      return data?.manutencao_ativa || false;
    } catch (error) {
      console.error('Erro ao verificar status de manutenção:', error);
      return false;
    }
  };

  const updateMaintenanceMode = async (active: boolean) => {
    try {
      const { error } = await supabase
        .from('configuracoes_sistema')
        .update({ manutencao_ativa: active })
        .eq('id', (await supabase.from('configuracoes_sistema').select('id').single()).data?.id);

      if (error) {
        console.error('Erro ao atualizar modo manutenção:', error);
        return false;
      }

      setIsMaintenanceMode(active);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar modo manutenção:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadMaintenanceStatus = async () => {
      const status = await checkMaintenanceStatus();
      setIsMaintenanceMode(status);
      setLoading(false);
    };

    loadMaintenanceStatus();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('configuracoes_sistema_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'configuracoes_sistema',
        },
        (payload) => {
          setIsMaintenanceMode(payload.new.manutencao_ativa);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    isMaintenanceMode,
    loading,
    updateMaintenanceMode,
    checkMaintenanceStatus,
  };
};