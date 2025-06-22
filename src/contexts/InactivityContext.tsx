
import React, { createContext, useContext, useState } from 'react';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import { useAuth } from '@/contexts/AuthContext';
import InactivityWarningModal from '@/components/InactivityWarningModal';

interface InactivityContextType {
  extendSession: () => void;
  resetTimers: () => void;
}

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

export const InactivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);
  const { logout } = useAuth();

  const handleWarning = () => {
    setShowWarning(true);
  };

  const handleLogout = () => {
    setShowWarning(false);
    logout();
  };

  const { extendSession, resetTimers } = useInactivityLogout({
    inactivityTime: 60, // 60 minutos
    warningTime: 5, // 5 minutos de aviso
    onWarning: handleWarning,
    onLogout: handleLogout
  });

  const handleExtendSession = () => {
    setShowWarning(false);
    extendSession();
  };

  return (
    <InactivityContext.Provider value={{ extendSession, resetTimers }}>
      {children}
      <InactivityWarningModal
        isOpen={showWarning}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
        warningTimeSeconds={300} // 5 minutos = 300 segundos
      />
    </InactivityContext.Provider>
  );
};

export const useInactivity = () => {
  const context = useContext(InactivityContext);
  if (context === undefined) {
    throw new Error('useInactivity must be used within an InactivityProvider');
  }
  return context;
};
