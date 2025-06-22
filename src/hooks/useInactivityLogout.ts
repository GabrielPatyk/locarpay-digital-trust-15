
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UseInactivityLogoutOptions {
  inactivityTime?: number; // em minutos
  warningTime?: number; // em minutos antes do logout
  onWarning?: () => void;
  onLogout?: () => void;
}

export const useInactivityLogout = (options: UseInactivityLogoutOptions = {}) => {
  const {
    inactivityTime = 60, // 60 minutos por padrão
    warningTime = 5, // 5 minutos de aviso por padrão
    onWarning,
    onLogout
  } = options;

  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  const inactivityTimeMs = inactivityTime * 60 * 1000;
  const warningTimeMs = warningTime * 60 * 1000;
  const timeUntilWarning = inactivityTimeMs - warningTimeMs;

  const resetTimers = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    warningShownRef.current = false;
  };

  const startTimers = () => {
    resetTimers();

    // Timer para mostrar o aviso
    warningTimerRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true;
        onWarning?.();
      }
    }, timeUntilWarning);

    // Timer para fazer logout
    inactivityTimerRef.current = setTimeout(() => {
      logout();
      onLogout?.();
      toast({
        title: "Sessão expirada",
        description: "Você foi desconectado por inatividade.",
        variant: "destructive"
      });
    }, inactivityTimeMs);
  };

  const handleActivity = () => {
    if (user) {
      startTimers();
    }
  };

  const extendSession = () => {
    resetTimers();
    startTimers();
    toast({
      title: "Sessão estendida",
      description: "Sua sessão foi renovada com sucesso."
    });
  };

  useEffect(() => {
    if (!user) {
      resetTimers();
      return;
    }

    // Eventos que consideramos como atividade
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Iniciar timers quando o usuário está logado
    startTimers();

    // Adicionar listeners para atividade
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      resetTimers();
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user]);

  return {
    extendSession,
    resetTimers
  };
};
