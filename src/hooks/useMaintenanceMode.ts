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
        .select('manutencao_ativa, motivo_manutencao');

      if (error) {
        console.error('Erro ao verificar status de manutenção:', error);
        return { active: false, reason: '' };
      }

      // Retorna o primeiro item do array ou dados padrão se não houver dados
      const configItem = data && data.length > 0 ? data[0] : null;

      return {
        active: configItem?.manutencao_ativa || false,
        reason: configItem?.motivo_manutencao || ''
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
        .eq('id', (await supabase.from('configuracoes_sistema').select('id')).data?.[0]?.id);

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

    // Subscribe to real-time changes with unique channel name
    const channelName = `configuracoes_sistema_changes_${Math.random().toString(36).substr(2, 9)}`;
    const subscription = supabase
      .channel(channelName)
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
      supabase.removeChannel(subscription);
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