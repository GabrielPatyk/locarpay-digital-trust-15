
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: UserType;
  allowedRoles?: UserType[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, isLoading, contratoPendente } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Support both requiredUserType and allowedRoles for backward compatibility
  const roles = allowedRoles || (requiredUserType ? [requiredUserType] : undefined);
  
  if (roles && user && !roles.includes(user.type as UserType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is imobiliaria and has a pending contract, block access to platform
  if (user?.type === 'imobiliaria' && contratoPendente && 
      contratoPendente.modelo_contrato === 'imobiliaria_locarpay' && 
      !contratoPendente.assinado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[#0C1C2E] mb-4">
            Contrato Pendente
          </h1>
          <p className="text-gray-600 mb-4">
            Você precisa assinar o contrato de parceria para acessar a plataforma.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C] mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
