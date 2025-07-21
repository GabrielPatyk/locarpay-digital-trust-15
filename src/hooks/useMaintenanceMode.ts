import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [maintenanceReason, setMaintenanceReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const checkMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('manutencao_ativa, motivo_manutencao')
        .single();

      if (error) {
        console.error('Erro ao verificar status de manutenção:', error);
        return { active: false, reason: '' };
      }

      return {
        active: data?.manutencao_ativa || false,
        reason: data?.motivo_manutencao || ''
      };
    } catch (error) {
      console.error('Erro ao verificar status de manutenção:', error);
      return { active: false, reason: '' };
    }
  };

  const updateMaintenanceMode = async (active: boolean, reason?: string) => {
    try {
      const updateData: any = { manutencao_ativa: active };
      if (reason !== undefined) {
        updateData.motivo_manutencao = reason;
      }

      const { error } = await supabase
        .from('configuracoes_sistema')
        .update(updateData)
        .eq('id', (await supabase.from('configuracoes_sistema').select('id').single()).data?.id);

      if (error) {
        console.error('Erro ao atualizar modo manutenção:', error);
        return false;
      }

      setIsMaintenanceMode(active);
      if (reason !== undefined) {
        setMaintenanceReason(reason);
      }
      return true;
    } catch (error) {
      console.error('Erro ao atualizar modo manutenção:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadMaintenanceStatus = async () => {
      const status = await checkMaintenanceStatus();
      setIsMaintenanceMode(status.active);
      setMaintenanceReason(status.reason);
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
          setMaintenanceReason(payload.new.motivo_manutencao || '');
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    isMaintenanceMode,
    maintenanceReason,
    loading,
    updateMaintenanceMode,
    checkMaintenanceStatus,
  };
};