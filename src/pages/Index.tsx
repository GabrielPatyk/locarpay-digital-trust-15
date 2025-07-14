
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading, contratoPendente } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC942C]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Se há contrato pendente, ficar na página atual (o modal irá bloquear)
    if (contratoPendente && !contratoPendente.assinado) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#0C1C2E] mb-4">Bem-vindo à LOCARPAY</h1>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      );
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
