
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading, user, contratoPendente } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // If user is imobiliaria and has a pending contract, stay here to show the modal
    if (user?.type === 'imobiliaria' && contratoPendente && 
        contratoPendente.modelo_contrato === 'imobiliaria_locarpay' && 
        !contratoPendente.assinado) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-[#0C1C2E] mb-4">
              Bem-vindo à LOCARPAY
            </h1>
            <p className="text-gray-600 mb-4">
              Carregando contrato de parceria...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C] mx-auto"></div>
          </div>
        </div>
      );
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
