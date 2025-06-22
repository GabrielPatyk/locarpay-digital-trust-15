
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseInactivityLogoutProps {
  onWarning: () => void;
  onLogout: () => void;
  inactivityTime?: number; // em millisegundos
  warningTime?: number; // em millisegundos antes do logout
}

export const useInactivityLogout = ({
  onWarning,
  onLogout,
  inactivityTime = 60 * 60 * 1000, // 60 minutos
  warningTime = 5 * 60 * 1000 // 5 minutos
}: UseInactivityLogoutProps) => {
  const { isAuthenticated } = useAuth();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
      warningTimer.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;

    clearTimers();

    // Timer para o aviso (55 minutos)
    warningTimer.current = setTimeout(() => {
      onWarning();
    }, inactivityTime - warningTime);

    // Timer para logout automático (60 minutos)
    inactivityTimer.current = setTimeout(() => {
      onLogout();
    }, inactivityTime);
  }, [isAuthenticated, inactivityTime, warningTime, onWarning, onLogout, clearTimers]);

  const handleUserActivity = useCallback(() => {
    if (isAuthenticated) {
      resetTimer();
    }
  }, [isAuthenticated, resetTimer]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    // Eventos que detectam atividade do usuário
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Adicionar listeners para todos os eventos
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Iniciar o timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      clearTimers();
    };
  }, [isAuthenticated, handleUserActivity, resetTimer, clearTimers]);

  return {
    resetTimer,
    clearTimers
  };
};
