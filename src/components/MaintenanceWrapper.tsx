import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  const { user } = useAuth();
  const { isMaintenanceMode, loading } = useMaintenanceMode();

  // Mostrar loading enquanto verifica o status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se modo manutenção está ativo e usuário não é admin, redirecionar
  const isAdmin = user?.type === 'admin';
  const currentPath = window.location.pathname;
  
  if (isMaintenanceMode && !isAdmin && currentPath !== '/manutencao') {
    return <Navigate to="/manutencao" replace />;
  }

  // Se modo manutenção está desativo e usuário está na página de manutenção, redirecionar para dashboard
  if (!isMaintenanceMode && currentPath === '/manutencao') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default MaintenanceWrapper;