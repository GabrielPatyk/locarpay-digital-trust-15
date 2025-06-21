
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, perfil_usuario, isLoadingProfile } = useAuth();

  // Show loading while checking profile
  if (isAuthenticated && isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // If authenticated but no profile, redirect to complete registration
    if (!perfil_usuario) {
      return <Navigate to="/completar-cadastro" replace />;
    }
    // If has profile, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
