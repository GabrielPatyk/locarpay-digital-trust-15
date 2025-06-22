
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import InactivityWarningModal from '@/components/InactivityWarningModal';

interface InactivityContextType {
  resetTimer: () => void;
}

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

export const InactivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  const handleWarning = () => {
    setShowWarning(true);
  };

  const handleLogout = () => {
    setShowWarning(false);
    logout();
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
  };

  const { resetTimer } = useInactivityLogout({
    onWarning: handleWarning,
    onLogout: handleLogout,
    inactivityTime: 60 * 60 * 1000, // 60 minutos
    warningTime: 5 * 60 * 1000 // 5 minutos
  });

  return (
    <InactivityContext.Provider value={{ resetTimer }}>
      {children}
      <InactivityWarningModal
        isOpen={showWarning}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
        countdownSeconds={300}
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
